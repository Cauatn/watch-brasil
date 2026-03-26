export type TaskStatus = "pending" | "in_progress" | "done";

export type TaskCategory = "general" | "watch_movie";

export type TaskVideoRef = {
  id: string;
  title: string;
  coverUrl: string;
};

export type TaskItem = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  category: TaskCategory;
  video: TaskVideoRef | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskPayload = {
  title: string;
  description?: string;
  status?: TaskStatus;
  category?: TaskCategory;
  videoId?: string | null;
};

export type UpdateTaskPayload = {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  category?: TaskCategory;
  videoId?: string | null;
};
