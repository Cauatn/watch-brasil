import { api } from "@/lib/api";
import type {
  CreateTaskPayload,
  TaskCategory,
  TaskItem,
  TaskStatus,
  UpdateTaskPayload,
} from "@/features/tasks/types/task";

export async function listTasks(params?: {
  status?: TaskStatus;
  category?: TaskCategory;
}) {
  const { data } = await api.get<{ data: TaskItem[] }>("/tasks", {
    params,
  });
  return data.data;
}

export async function createTask(body: CreateTaskPayload) {
  const { data } = await api.post<TaskItem>("/tasks", body);
  return data;
}

export async function updateTask(id: string, body: UpdateTaskPayload) {
  const { data } = await api.patch<TaskItem>(`/tasks/${id}`, body);
  return data;
}

export async function deleteTask(id: string) {
  await api.delete(`/tasks/${id}`);
}
