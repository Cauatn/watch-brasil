import { getVideo } from "@/features/catalog/services/video";
import { useQuery } from "@tanstack/vue-query";
import type { MaybeRefOrGetter } from "vue";
import { toValue } from "vue";

export function useVideoQuery(id: MaybeRefOrGetter<string | undefined>) {
  return useQuery({
    queryKey: ["videos", "detail", id],
    queryFn: () => getVideo(toValue(id)!),
    enabled: () => Boolean(toValue(id)),
  });
}
