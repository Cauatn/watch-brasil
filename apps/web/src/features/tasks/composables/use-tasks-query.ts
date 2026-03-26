import { listTasks } from "@/features/tasks/services/task";
import type { TaskCategory, TaskStatus } from "@/features/tasks/types/task";
import { useAuthStore } from "@/stores/auth.store";
import { useQuery } from "@tanstack/vue-query";
import { computed, type MaybeRefOrGetter, toValue } from "vue";

export function useTasksQuery(filters?: {
  status?: MaybeRefOrGetter<TaskStatus | undefined>;
  category?: MaybeRefOrGetter<TaskCategory | undefined>;
}) {
  const authStore = useAuthStore();
  const userId = computed(() => authStore.user?.id);
  const status = computed(() => toValue(filters?.status));
  const category = computed(() => toValue(filters?.category));

  return useQuery({
    queryKey: ["tasks", userId, status, category],
    enabled: computed(() => Boolean(userId.value)),
    queryFn: () =>
      listTasks({
        status: status.value,
        category: category.value,
      }),
  });
}
