import { randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../../db/client.js";
import { tasksTable, videosTable } from "../../db/schema.js";
import type { PublicTask, TaskCategory, TaskStatus } from "../../shared/types/index.js";
import { findVideoById } from "../videos/videos.service.js";

type TaskRow = typeof tasksTable.$inferSelect;

function mapTask(
  row: TaskRow,
  video: PublicTask["video"],
): PublicTask {
  return {
    id: row.id,
    userId: row.userId,
    title: row.title,
    description: row.description,
    status: row.status as TaskStatus,
    category: row.category as TaskCategory,
    video,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function loadVideoRef(
  videoId: string | null,
): Promise<PublicTask["video"]> {
  if (!videoId) return null;
  const v = await findVideoById(videoId);
  if (!v) return null;
  return { id: v.id, title: v.title, coverUrl: v.coverUrl };
}

export const tasksService = {
  async list(input: {
    userId: string;
    status?: TaskStatus;
    category?: TaskCategory;
  }) {
    const filters = [eq(tasksTable.userId, input.userId)];
    if (input.status) filters.push(eq(tasksTable.status, input.status));
    if (input.category) filters.push(eq(tasksTable.category, input.category));

    const where = filters.length > 1 ? and(...filters) : filters[0];
    const rows = await db.query.tasksTable.findMany({
      where,
      orderBy: [desc(tasksTable.updatedAt)],
    });

    const data: PublicTask[] = [];
    for (const row of rows) {
      data.push(mapTask(row, await loadVideoRef(row.videoId)));
    }
    return data;
  },

  async getById(taskId: string, userId: string) {
    const row = await db.query.tasksTable.findFirst({
      where: and(eq(tasksTable.id, taskId), eq(tasksTable.userId, userId)),
    });
    if (!row) return null;
    return mapTask(row, await loadVideoRef(row.videoId));
  },

  async create(input: {
    userId: string;
    title: string;
    description?: string;
    status: TaskStatus;
    category: TaskCategory;
    videoId: string | null;
  }) {
    if (input.videoId) {
      const v = await findVideoById(input.videoId);
      if (!v) return { type: "video_not_found" as const };
    }

    const now = new Date();
    const id = randomUUID();
    await db.insert(tasksTable).values({
      id,
      userId: input.userId,
      title: input.title,
      description: input.description ?? null,
      status: input.status,
      category: input.category,
      videoId: input.videoId,
      createdAt: now,
      updatedAt: now,
    });

    const row = await db.query.tasksTable.findFirst({
      where: eq(tasksTable.id, id),
    });
    if (!row) return { type: "error" as const };
    return {
      type: "ok" as const,
      task: mapTask(row, await loadVideoRef(row.videoId)),
    };
  },

  async update(input: {
    taskId: string;
    userId: string;
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    category?: TaskCategory;
    videoId?: string | null;
  }) {
    const existing = await db.query.tasksTable.findFirst({
      where: and(
        eq(tasksTable.id, input.taskId),
        eq(tasksTable.userId, input.userId),
      ),
    });
    if (!existing) return { type: "not_found" as const };

    if (input.videoId !== undefined && input.videoId !== null) {
      const v = await findVideoById(input.videoId);
      if (!v) return { type: "video_not_found" as const };
    }

    const now = new Date();
    const patch: Partial<typeof tasksTable.$inferInsert> = {
      updatedAt: now,
    };
    if (input.title !== undefined) patch.title = input.title;
    if (input.description !== undefined) patch.description = input.description;
    if (input.status !== undefined) patch.status = input.status;
    if (input.category !== undefined) patch.category = input.category;
    if (input.videoId !== undefined) patch.videoId = input.videoId;

    await db.update(tasksTable).set(patch).where(eq(tasksTable.id, input.taskId));

    const row = await db.query.tasksTable.findFirst({
      where: eq(tasksTable.id, input.taskId),
    });
    if (!row) return { type: "not_found" as const };
    return {
      type: "ok" as const,
      task: mapTask(row, await loadVideoRef(row.videoId)),
    };
  },

  async delete(taskId: string, userId: string) {
    const existing = await db.query.tasksTable.findFirst({
      where: and(eq(tasksTable.id, taskId), eq(tasksTable.userId, userId)),
    });
    if (!existing) return { type: "not_found" as const };

    await db.delete(tasksTable).where(eq(tasksTable.id, taskId));
    return { type: "ok" as const };
  },
};
