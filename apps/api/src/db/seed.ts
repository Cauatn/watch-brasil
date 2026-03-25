import "dotenv/config";

import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { db } from "../shared/db/client.js";
import { commentsTable, usersTable, videosTable } from "../shared/db/schema.js";

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
    title: "Sample Video 1",
    url: "https://example.com/video1.mp4",
    coverUrl: "https://example.com/cover1.jpg",
    description: "Vídeo de exemplo para popular o catálogo.",
    mimeType: "video/mp4",
  },
  {
    title: "Sample Video 2",
    url: "https://example.com/video2.mp4",
    coverUrl: "https://example.com/cover2.jpg",
    description: "Vídeo de exemplo para testar upload/UX.",
    mimeType: "video/mp4",
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
