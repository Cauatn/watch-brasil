import { useQuery } from "@tanstack/vue-query";
import { computed, type MaybeRefOrGetter, toValue } from "vue";
import { listVideos } from "@/features/catalog/services/video";

export function useVideosQuery(opts?: { limit?: MaybeRefOrGetter<number> }) {
  const limit = computed(() => toValue(opts?.limit) ?? 80);

  return useQuery({
    queryKey: ["videos", "catalog", limit],
    queryFn: () => listVideos({ page: 1, limit: limit.value }),
  });
}
