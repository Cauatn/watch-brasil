import { randomUUID } from "node:crypto";
import { SQL, and, count, desc, eq, sql } from "drizzle-orm";
import { db } from "../../db/client.js";
import { videosTable } from "../../db/schema.js";
import type { VideoStatus } from "../../shared/types/index.js";
import { findUserById } from "../users/users.service.js";

type VideoRecord = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  coverUrl: string;
  mimeType: string;
  sizeBytes: number;
  status: VideoStatus;
  uploadedById: string;
  createdAt: string;
};

const mapVideo = (video: typeof videosTable.$inferSelect): VideoRecord => ({
  ...video,
  status: video.status as VideoStatus,
  createdAt: video.createdAt.toISOString(),
});

const createVideo = async (input: {
  id: string;
  title: string;
  url: string;
  coverUrl: string;
  description?: string;
  uploadedById: string;
  mimeType: string;
  sizeBytes: number;
  status: VideoStatus;
}) => {
  await db.insert(videosTable).values({
    id: input.id,
    title: input.title,
    description: input.description ?? null,
    url: input.url,
    coverUrl: input.coverUrl,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    status: input.status,
    uploadedById: input.uploadedById,
    createdAt: new Date(),
  });
  const created = await db.query.videosTable.findFirst({
    where: eq(videosTable.id, input.id),
  });
  return created ? mapVideo(created) : null;
};

const listVideos = async (input: {
  page: number;
  limit: number;
  status?: VideoStatus;
  uploadedBy?: string;
  search?: string;
}) => {
  const filters: SQL[] = [];
  if (input.status) filters.push(eq(videosTable.status, input.status));
  if (input.uploadedBy)
    filters.push(eq(videosTable.uploadedById, input.uploadedBy));
  const titleSearch = input.search?.trim();

  if (titleSearch)
    filters.push(sql`${videosTable.title} ILIKE ${`%${titleSearch}%`}`);

  const whereClause = filters.length > 1 ? and(...filters) : filters[0];
  const offset = (input.page - 1) * input.limit;

  const [data, totalResult] = await Promise.all([
    db.query.videosTable.findMany({
      where: whereClause,
      orderBy: [desc(videosTable.createdAt)],
      limit: input.limit,
      offset,
    }),
    db
      .select({ value: count(videosTable.id) })
      .from(videosTable)
      .where(whereClause ?? sql`true`),
  ]);

  return {
    data: data.map(mapVideo),
    total: Number(totalResult[0]?.value ?? 0),
    page: input.page,
    limit: input.limit,
  };
};

export const findVideoById = async (videoId: string) => {
  const video = await db.query.videosTable.findFirst({
    where: eq(videosTable.id, videoId),
  });
  return video ? mapVideo(video) : null;
};

const updateVideo = async (
  videoId: string,
  input: {
    title?: string;
    url?: string;
    coverUrl?: string;
    description?: string;
  },
) => {
  const updated = await db
    .update(videosTable)
    .set({
      title: input.title,
      url: input.url,
      coverUrl: input.coverUrl,
      description: input.description,
    })
    .where(eq(videosTable.id, videoId))
    .returning();
  return updated[0] ? mapVideo(updated[0]) : null;
};

const deleteVideo = async (videoId: string) => {
  await db.delete(videosTable).where(eq(videosTable.id, videoId));
};

export const videosService = {
  async list(input: {
    page: number;
    limit: number;
    status?: VideoStatus;
    uploadedBy?: string;
    search?: string;
  }) {
    return listVideos(input);
  },

  async create(input: {
    actorId: string;
    title: string;
    url: string;
    coverUrl: string;
    description?: string;
  }) {
    const created = await createVideo({
      id: randomUUID(),
      title: input.title,
      url: input.url,
      coverUrl: input.coverUrl,
      description: input.description,
      mimeType: "video/mp4",
      sizeBytes: 0,
      status: "ready",
      uploadedById: input.actorId,
    });
    if (!created) return null;
    return {
      ...created,
      uploadedBy: await findUserById(input.actorId),
    };
  },

  async getById(videoId: string) {
    const video = await findVideoById(videoId);
    if (!video) return null;
    return {
      ...video,
      uploadedBy: await findUserById(video.uploadedById),
    };
  },

  async update(input: {
    videoId: string;
    actorId: string;
    title?: string;
    url?: string;
    coverUrl?: string;
    description?: string;
  }) {
    const current = await findVideoById(input.videoId);
    if (!current) return { type: "not_found" as const };
    if (current.uploadedById !== input.actorId)
      return { type: "forbidden" as const };

    const updated = await updateVideo(input.videoId, {
      title: input.title,
      url: input.url,
      coverUrl: input.coverUrl,
      description: input.description,
    });

    if (!updated) return { type: "not_found" as const };

    return {
      type: "ok" as const,
      video: {
        ...updated,
        uploadedBy: await findUserById(updated.uploadedById),
      },
    };
  },

  async delete(input: { videoId: string; actorId: string }) {
    const current = await findVideoById(input.videoId);
    if (!current) return { type: "not_found" as const };
    if (current.uploadedById !== input.actorId)
      return { type: "forbidden" as const };
    await deleteVideo(input.videoId);
    return { type: "ok" as const };
  },
};
