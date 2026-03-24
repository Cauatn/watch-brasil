import { and, count, desc, eq, sql } from "drizzle-orm";
import { db } from "../../shared/db/client.js";
import { videosTable } from "../../shared/db/schema.js";
import type { VideoStatus } from "../../shared/types/index.js";

export type VideoRecord = {
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

function mapVideo(video: typeof videosTable.$inferSelect): VideoRecord {
  return {
    ...video,
    status: video.status as VideoStatus,
    createdAt: video.createdAt.toISOString(),
  };
}

export const videosRepository = {
  async createVideo(input: {
    id: string;
    title: string;
    url: string;
    coverUrl: string;
    description?: string;
    uploadedById: string;
    mimeType: string;
    sizeBytes: number;
    status: VideoStatus;
  }) {
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
  },

  async listVideos(input: {
    page: number;
    limit: number;
    status?: VideoStatus;
    uploadedBy?: string;
  }) {
    const filters = [];
    if (input.status) filters.push(eq(videosTable.status, input.status));
    if (input.uploadedBy)
      filters.push(eq(videosTable.uploadedById, input.uploadedBy));

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
  },

  async findVideoById(videoId: string) {
    const video = await db.query.videosTable.findFirst({
      where: eq(videosTable.id, videoId),
    });
    return video ? mapVideo(video) : null;
  },

  async updateVideo(
    videoId: string,
    input: {
      title?: string;
      url?: string;
      coverUrl?: string;
      description?: string;
    },
  ) {
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
  },

  async deleteVideo(videoId: string) {
    await db.delete(videosTable).where(eq(videosTable.id, videoId));
  },
};
