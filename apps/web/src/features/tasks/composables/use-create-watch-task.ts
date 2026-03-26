import type { CatalogVideo } from "@/features/catalog/services/video";
import { createTask } from "@/features/tasks/services/task";
import { useQueryClient } from "@tanstack/vue-query";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";

export function useCreateWatchTask() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  const pendingVideoId = ref<string | null>(null);

  async function addWatchTask(video: CatalogVideo) {
    if (pendingVideoId.value) return;
    pendingVideoId.value = video.id;
    try {
      await createTask({
        title: video.title,
        category: "watch_movie",
        videoId: video.id,
        status: "pending",
      });
      void queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(t("tasks.addedFromCatalog"));
    } catch {
      toast.error(t("tasks.addFromCatalogError"));
    } finally {
      pendingVideoId.value = null;
    }
  }

  return { addWatchTask, pendingVideoId };
}
