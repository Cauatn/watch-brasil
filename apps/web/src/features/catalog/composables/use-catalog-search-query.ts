import { useQuery } from "@tanstack/vue-query";
import { computed, type MaybeRefOrGetter, toValue } from "vue";
import { listVideos } from "@/features/catalog/services/video";

const SEARCH_LIMIT = 100;

export function useCatalogSearchQuery(search: MaybeRefOrGetter<string>) {
  const term = computed(() => (toValue(search) ?? "").trim());

  return useQuery({
    queryKey: ["videos", "catalog-search", term],
    queryFn: () =>
      listVideos({
        page: 1,
        limit: SEARCH_LIMIT,
        search: term.value,
      }),
    enabled: computed(() => term.value.length > 0),
  });
}
