import { and, count, eq, gte, ne } from "drizzle-orm";
import { db } from "../../db/client.js";
import {
  commentsTable,
  tasksTable,
  usersTable,
  videosTable,
} from "../../db/schema.js";

export const reportsService = {
  async getAdminSummary() {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [[{ value: users }], [{ value: videos }], [{ value: comments }], [{ value: tasksTotal }]] =
      await Promise.all([
        db.select({ value: count() }).from(usersTable),
        db.select({ value: count() }).from(videosTable),
        db.select({ value: count() }).from(commentsTable),
        db.select({ value: count() }).from(tasksTable),
      ]);

    const statusRows = await db
      .select({ status: tasksTable.status, value: count() })
      .from(tasksTable)
      .groupBy(tasksTable.status);

    const categoryRows = await db
      .select({ category: tasksTable.category, value: count() })
      .from(tasksTable)
      .groupBy(tasksTable.category);

    const [{ value: watchMovieOpen }] = await db
      .select({ value: count() })
      .from(tasksTable)
      .where(
        and(
          eq(tasksTable.category, "watch_movie"),
          ne(tasksTable.status, "done"),
        ),
      );

    const tasksByStatus = Object.fromEntries(
      statusRows.map((r) => [r.status, Number(r.value)]),
    ) as Record<string, number>;

    const tasksByCategory = Object.fromEntries(
      categoryRows.map((r) => [r.category, Number(r.value)]),
    ) as Record<string, number>;

    const [{ value: recentUsers }] = await db
      .select({ value: count() })
      .from(usersTable)
      .where(gte(usersTable.createdAt, weekAgo));

    return {
      totals: {
        users: Number(users),
        videos: Number(videos),
        comments: Number(comments),
        tasks: Number(tasksTotal),
      },
      tasksByStatus,
      tasksByCategory,
      watchlistOpen: Number(watchMovieOpen),
      newUsersLast7Days: Number(recentUsers),
    };
  },
};
