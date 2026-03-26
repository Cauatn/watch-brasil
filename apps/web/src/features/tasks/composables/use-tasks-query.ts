import { listTasks } from "@/features/tasks/services/task";
import type { TaskCategory, TaskStatus } from "@/features/tasks/types/task";
import { useQuery } from "@tanstack/vue-query";
import { computed, type MaybeRefOrGetter, toValue } from "vue";

export function useTasksQuery(filters?: {
  status?: MaybeRefOrGetter<TaskStatus | undefined>;
  category?: MaybeRefOrGetter<TaskCategory | undefined>;
}) {
  const status = computed(() => toValue(filters?.status));
  const category = computed(() => toValue(filters?.category));

  return useQuery({
    queryKey: ["tasks", status, category],
    queryFn: () =>
      listTasks({
        status: status.value,
        category: category.value,
      }),
  });
}
