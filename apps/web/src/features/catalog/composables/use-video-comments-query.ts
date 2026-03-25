import { listVideoComments } from "@/features/catalog/services/comments";
import { useQuery } from "@tanstack/vue-query";
import type { MaybeRefOrGetter } from "vue";
import { toValue } from "vue";

export function useVideoCommentsQuery(
  videoId: MaybeRefOrGetter<string | undefined>,
) {
  return useQuery({
    queryKey: ["video-comments", videoId],
    queryFn: () => listVideoComments(toValue(videoId)!),
    enabled: () => Boolean(toValue(videoId)),
  });
}
