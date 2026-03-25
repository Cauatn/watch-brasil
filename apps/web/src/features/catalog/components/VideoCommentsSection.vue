<script setup lang="ts">
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { isAxiosError } from "axios";
import { Trash2 } from "lucide-vue-next";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/auth.store";
import { useVideoCommentsQuery } from "../composables/use-video-comments-query";
import { deleteVideoComment, postVideoComment } from "../services/comments";

const props = defineProps<{
  videoId: string;
}>();

const { t, locale } = useI18n();
const auth = useAuthStore();
const queryClient = useQueryClient();

const { data, isPending } = useVideoCommentsQuery(() => props.videoId);

const comments = computed(() => data.value?.data ?? []);

const draft = ref("");
const maxLen = 1000;

const canSubmit = computed(() => {
  const s = draft.value.trim();
  return s.length >= 1 && s.length <= maxLen;
});

const { mutate: submitComment, isPending: isPosting } = useMutation({
  mutationFn: () => postVideoComment(props.videoId, draft.value.trim()),
  onSuccess: async () => {
    draft.value = "";
    await queryClient.invalidateQueries({
      queryKey: ["video-comments", props.videoId],
    });
    toast.success(t("comments.posted"));
  },
  onError: (e) => {
    if (isAxiosError(e) && e.response?.status === 400) {
      toast.error(t("comments.errorValidation"));
      return;
    }
    toast.error(t("comments.errorGeneric"));
  },
});

const { mutate: removeComment, isPending: isDeleting } = useMutation({
  mutationFn: (commentId: string) =>
    deleteVideoComment(props.videoId, commentId),
  onSuccess: async () => {
    await queryClient.invalidateQueries({
      queryKey: ["video-comments", props.videoId],
    });
  },
  onError: () => toast.error(t("comments.deleteError")),
});

function submit() {
  if (!canSubmit.value || isPosting.value) return;
  submitComment();
}

function formatDate(iso: string) {
  const loc = locale.value === "en" ? "en-US" : "pt-BR";
  return new Date(iso).toLocaleString(loc);
}

function authorLabel(name: string | undefined) {
  return name?.trim() || t("comments.anonymous");
}
</script>

<template>
  <section class="space-y-4 border-t border-white/10 pt-8">
    <h2 class="text-lg font-semibold text-white">
      {{ t("comments.title") }}
    </h2>

    <div class="space-y-3">
      <Textarea
        v-model="draft"
        rows="3"
        :maxlength="maxLen"
        class="border-white/15 bg-[#1a1a1a] text-white placeholder:text-white/40"
        :placeholder="t('comments.placeholder')"
        @keydown.ctrl.enter="submit"
        @keydown.meta.enter="submit"
      />
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xs text-white/40">
          {{ draft.length }} / {{ maxLen }}
        </span>
        <Button
          type="button"
          class="bg-[#E50914] text-white hover:bg-[#f6121a]"
          :disabled="!canSubmit || isPosting"
          @click="submit"
        >
          {{ isPosting ? t("comments.posting") : t("comments.submit") }}
        </Button>
      </div>
    </div>

    <div v-if="isPending" class="space-y-3">
      <Skeleton v-for="n in 3" :key="n" class="h-20 w-full bg-white/10" />
    </div>
    <p v-else-if="comments.length === 0" class="text-sm text-white/50">
      {{ t("comments.empty") }}
    </p>
    <ul v-else class="space-y-4">
      <li
        v-for="c in comments"
        :key="c.id"
        class="rounded-xl border border-white/10 bg-[#161616] p-4"
      >
        <div class="mb-2 flex items-start justify-between gap-2">
          <div>
            <p class="font-medium text-white">
              {{ authorLabel(c.author?.name) }}
            </p>
            <p class="text-xs text-white/45">
              {{ formatDate(c.createdAt) }}
            </p>
          </div>
          <Button
            v-if="auth.user?.id === c.authorId"
            type="button"
            variant="ghost"
            size="icon"
            class="shrink-0 text-white/50 hover:bg-white/10 hover:text-[#E50914]"
            :disabled="isDeleting"
            :aria-label="t('comments.delete')"
            @click="removeComment(c.id)"
          >
            <Trash2 class="size-4" />
          </Button>
        </div>
        <p class="whitespace-pre-wrap text-sm text-white/85">
          {{ c.content }}
        </p>
      </li>
    </ul>
  </section>
</template>
