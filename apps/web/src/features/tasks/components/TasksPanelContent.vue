<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import TasksFormBody from "@/features/tasks/components/TasksFormBody.vue";
import { useVideosQuery } from "@/features/catalog/composables/use-videos-query";
import { useTasksQuery } from "@/features/tasks/composables/use-tasks-query";
import {
  createTask,
  deleteTask,
  updateTask,
} from "@/features/tasks/services/task";
import type { TaskCategory, TaskStatus } from "@/features/tasks/types/task";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { ChevronDown } from "lucide-vue-next";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

const props = withDefaults(
  defineProps<{
    stacked?: boolean;
  }>(),
  { stacked: false },
);

const { t } = useI18n();
const router = useRouter();
const queryClient = useQueryClient();

const { data: tasks, isPending, isError } = useTasksQuery();
const { data: videosPage } = useVideosQuery({ limit: 120 });
const videoOptions = computed(() => videosPage.value?.data ?? []);

const title = ref("");
const description = ref("");
const category = ref<TaskCategory>("watch_movie");
const videoId = ref<string>("");
const filterStatus = ref<TaskStatus | "">("");

const filteredTasks = computed(() => {
  const list = tasks.value ?? [];
  if (!filterStatus.value) return list;
  return list.filter((x) => x.status === filterStatus.value);
});

function invalidateTasks() {
  void queryClient.invalidateQueries({ queryKey: ["tasks"] });
}

const createMut = useMutation({
  mutationFn: () =>
    createTask({
      title: title.value.trim(),
      description: description.value.trim() || undefined,
      category: category.value,
      videoId:
        category.value === "watch_movie" && videoId.value
          ? videoId.value
          : null,
      status: "pending",
    }),
  onSuccess: () => {
    title.value = "";
    description.value = "";
    videoId.value = "";
    invalidateTasks();
    toast.success(t("tasks.created"));
  },
  onError: () => toast.error(t("tasks.createError")),
});

function setStatus(id: string, status: TaskStatus) {
  updateTask(id, { status })
    .then(() => {
      invalidateTasks();
      toast.success(t("tasks.updated"));
    })
    .catch(() => toast.error(t("tasks.updateError")));
}

function remove(id: string) {
  deleteTask(id)
    .then(() => {
      invalidateTasks();
      toast.success(t("tasks.deleted"));
    })
    .catch(() => toast.error(t("tasks.deleteError")));
}

const rootClass = computed(() =>
  props.stacked
    ? "flex flex-col gap-8"
    : "flex flex-1 flex-col gap-8 overflow-auto p-4 pb-16 md:flex-row md:p-8",
);
</script>

<template>
  <div :class="rootClass">
    <Card
      class="w-full shrink-0 border-white/10 bg-[#1a1a1a] text-white md:max-w-md"
    >
      <Collapsible
        v-if="props.stacked"
        :default-open="false"
      >
        <template #default="{ open }">
          <CollapsibleTrigger
            class="flex w-full items-start justify-between gap-3 border-b border-white/10 p-4 text-left text-white outline-none transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[#E50914] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]"
          >
            <div class="min-w-0 space-y-1">
              <p class="text-base font-semibold leading-tight">
                {{ t("tasks.formTitle") }}
              </p>
              <p class="text-sm text-white/60 leading-snug">
                {{ t("tasks.formCollapsibleHint") }}
              </p>
            </div>
            <ChevronDown
              class="size-5 shrink-0 text-white/70 transition-transform duration-200"
              :class="open ? 'rotate-180' : ''"
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent class="border-t border-transparent px-6 pb-6 pt-4">
              <TasksFormBody
                v-model:title="title"
                v-model:description="description"
                v-model:category="category"
                v-model:video-id="videoId"
                :video-options="videoOptions"
                :submit-disabled="!title.trim() || createMut.isPending.value"
                @submit="createMut.mutate()"
              />
            </CardContent>
          </CollapsibleContent>
        </template>
      </Collapsible>
      <template v-else>
        <CardHeader>
          <CardTitle>{{ t("tasks.formTitle") }}</CardTitle>
          <CardDescription class="text-white/60">
            {{ t("tasks.formHint") }}
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <TasksFormBody
            v-model:title="title"
            v-model:description="description"
            v-model:category="category"
            v-model:video-id="videoId"
            :video-options="videoOptions"
            :submit-disabled="!title.trim() || createMut.isPending.value"
            @submit="createMut.mutate()"
          />
        </CardContent>
      </template>
    </Card>

    <div class="min-w-0 flex-1 space-y-4">
      <div class="flex flex-wrap items-center gap-3">
        <Label class="text-white/80">{{ t("tasks.filterStatus") }}</Label>
        <select
          v-model="filterStatus"
          class="h-9 rounded-md border border-white/15 bg-black/30 px-2 text-sm text-white"
        >
          <option value="">{{ t("tasks.all") }}</option>
          <option value="pending">{{ t("tasks.statusPending") }}</option>
          <option value="in_progress">
            {{ t("tasks.statusProgress") }}
          </option>
          <option value="done">{{ t("tasks.statusDone") }}</option>
        </select>
      </div>

      <div
        v-if="isPending"
        class="rounded-xl border border-white/10 bg-white/5 p-8 text-white/70"
      >
        {{ t("tasks.loading") }}
      </div>
      <div
        v-else-if="isError"
        class="rounded-xl border border-red-500/30 bg-red-500/10 p-8 text-white"
      >
        {{ t("tasks.loadError") }}
      </div>
      <ul v-else class="space-y-3">
        <li v-for="task in filteredTasks" :key="task.id">
          <Card class="border-white/10 bg-[#1a1a1a] text-white">
            <CardContent class="p-4">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <p class="font-medium">{{ task.title }}</p>
                  <p
                    v-if="task.description"
                    class="mt-1 text-sm text-white/60"
                  >
                    {{ task.description }}
                  </p>
                  <div class="mt-2 flex flex-wrap gap-2 text-xs">
                    <span
                      class="rounded-full bg-white/10 px-2 py-0.5 text-white/80"
                    >
                      {{
                        task.category === "watch_movie"
                          ? t("tasks.badgeWatch")
                          : t("tasks.badgeGeneral")
                      }}
                    </span>
                    <span
                      class="rounded-full bg-white/10 px-2 py-0.5 capitalize text-white/80"
                    >
                      {{ task.status.replace("_", " ") }}
                    </span>
                  </div>
                  <div
                    v-if="task.video"
                    class="mt-3 flex items-center gap-2"
                  >
                    <img
                      :src="task.video.coverUrl"
                      alt=""
                      class="h-12 w-8 rounded object-cover"
                    >
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      class="border-[#E50914] text-[#E50914] hover:bg-[#E50914]/10"
                      @click="router.push({ name: 'watch', params: { id: task.video!.id } })"
                    >
                      {{ t("tasks.openStream") }}
                    </Button>
                  </div>
                </div>
                <div class="flex flex-wrap gap-2">
                  <Button
                    v-if="task.status !== 'pending'"
                    type="button"
                    size="sm"
                    variant="secondary"
                    class="bg-white/10 text-white"
                    @click="setStatus(task.id, 'pending')"
                  >
                    {{ t("tasks.markPending") }}
                  </Button>
                  <Button
                    v-if="task.status !== 'in_progress'"
                    type="button"
                    size="sm"
                    variant="secondary"
                    class="bg-white/10 text-white"
                    @click="setStatus(task.id, 'in_progress')"
                  >
                    {{ t("tasks.markProgress") }}
                  </Button>
                  <Button
                    v-if="task.status !== 'done'"
                    type="button"
                    size="sm"
                    class="bg-emerald-700 text-white hover:bg-emerald-800"
                    @click="setStatus(task.id, 'done')"
                  >
                    {{ t("tasks.markDone") }}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    @click="remove(task.id)"
                  >
                    {{ t("tasks.remove") }}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </li>
        <li
          v-if="filteredTasks.length === 0"
          class="rounded-xl border border-dashed border-white/20 p-8 text-center text-white/50"
        >
          {{ t("tasks.empty") }}
        </li>
      </ul>
    </div>
  </div>
</template>
