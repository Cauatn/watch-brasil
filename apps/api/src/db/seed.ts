import "dotenv/config";

import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { db } from "../db/client.js";
import { commentsTable, usersTable, videosTable } from "../db/schema.js";

type UserRole = "admin" | "user";

const SEED_USERS: Array<{
  email: string;
  name: string;
  password: string;
  role: UserRole;
}> = [
  {
    email: "admin@example.com",
    name: "Admin",
    password: "admin1234",
    role: "admin",
  },
  {
    email: "user@example.com",
    name: "User",
    password: "user12345",
    role: "user",
  },
];

const SEED_VIDEOS: Array<{
  title: string;
  url: string;
  coverUrl: string;
  description: string;
  mimeType: string;
}> = [
  {
    title: "Marvel — elenco e Vingadores: Doomsday",
    url: "https://youtu.be/vXloUcjVMx4?si=u1Jx8JRn7BOe_4_9",
    coverUrl:
      "https://rollingstone.com.br/wp-content/uploads/2025/03/marvel-anuncia-elenco-de-proximo-filme-dos-vingadores-avengers-doomsday.jpg",
    description:
      "Cobertura Rolling Stone BR sobre o próximo filme dos Vingadores (YouTube).",
    mimeType: "text/html",
  },
  {
    title: "Trailer em destaque",
    url: "https://youtu.be/X23XCFgdh2M?si=cdbqg8MvBcOdk_n7",
    coverUrl:
      "https://br.web.img3.acsta.net/pictures/16/09/29/21/15/495786.jpg",
    description: "Trailer hospedado no YouTube com capa Allociné/ACSTA.",
    mimeType: "text/html",
  },
  {
    title: "Big Buck Bunny",
    url: "https://youtu.be/YE7VzlLtp-4",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/960px-Big_buck_bunny_poster_big.jpg",
    description: "Curta open movie da Blender Foundation (domínio público).",
    mimeType: "text/html",
  },
  {
    title: "Sintel",
    url: "https://youtu.be/eRsGyueVLvQ",
    coverUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjBYIFMa_X7iGXImrCNz4plKxcMMgEaTXV0g&s",
    description: "Trailer do open movie Sintel (Blender Foundation).",
    mimeType: "text/html",
  },
  {
    title: "Tears of Steel",
    url: "https://youtu.be/R6MlEdmsc2Y",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Tos-poster.png/500px-Tos-poster.png",
    description: "Live action / VFX open movie da Blender Foundation.",
    mimeType: "text/html",
  },
];

async function upsertUser(input: {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}) {
  const existing = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, input.email),
  });

  const passwordHash = await hash(input.password, 10);
  const now = new Date();

  if (!existing) {
    const id = randomUUID();
    await db.insert(usersTable).values({
      id,
      name: input.name,
      email: input.email,
      password: passwordHash,
      role: input.role,
      createdAt: now,
    });
    return { id, role: input.role };
  }

  await db
    .update(usersTable)
    .set({
      name: input.name,
      password: passwordHash,
      role: input.role,
      createdAt: now,
    })
    .where(eq(usersTable.id, existing.id));

  return { id: existing.id, role: input.role };
}

async function resetVideosAndComments() {
  // delete comments first to avoid FK constraint
  await db.delete(commentsTable);
  await db.delete(videosTable);
}

async function seed() {
  const [admin, user] = await Promise.all(SEED_USERS.map(upsertUser));
  await resetVideosAndComments();

  const insertedVideos = await Promise.all(
    SEED_VIDEOS.map(async (v) => {
      const id = randomUUID();
      const created = await db
        .insert(videosTable)
        .values({
          id,
          title: v.title,
          description: v.description,
          url: v.url,
          coverUrl: v.coverUrl,
          mimeType: v.mimeType,
          sizeBytes: 0,
          status: "ready",
          uploadedById: admin.id,
          createdAt: new Date(),
        })
        .returning();

      return created[0];
    }),
  );

  // optional comments for dev UX: user comments on all seeded videos
  const commentRows = insertedVideos.map((video) => ({
    id: randomUUID(),
    videoId: video.id,
    authorId: user.id,
    content: `Comentário de exemplo para: ${video.title}`,
  }));

  if (commentRows.length) {
    await db.insert(commentsTable).values(
      commentRows.map((c) => ({
        ...c,
        createdAt: new Date(),
      })),
    );
  }
}

try {
  await seed();
} catch (err) {
  console.error(err);
  process.exit(1);
}

process.exit(0);
