<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ExternalLink } from "lucide-vue-next";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import CatalogShell from "../components/CatalogShell.vue";
import LocaleSwitcher from "../components/LocaleSwitcher.vue";
import VideoCommentsSection from "../components/VideoCommentsSection.vue";
import { useVideoQuery } from "../composables/use-video-query";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const videoId = computed(() => route.params.id as string);

const { data: video, isPending, isError, refetch } = useVideoQuery(videoId);

const useNativePlayer = computed(
  () => Boolean(video.value?.mimeType.startsWith("video/")),
);

function openOriginal() {
  const url = video.value?.url;
  if (url) window.open(url, "_blank", "noopener,noreferrer");
}
</script>

<template>
  <CatalogShell>
    <header
      class="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-[#121212]/95 px-4 backdrop-blur-md md:px-6"
    >
      <SidebarTrigger class="text-white" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="text-white/80 hover:bg-white/10 hover:text-white"
        @click="router.push({ path: '/' })"
      >
        <ArrowLeft class="size-5" />
      </Button>
      <h1
        class="min-w-0 flex-1 truncate text-lg font-semibold tracking-tight text-white"
      >
        <template v-if="video">
          {{ video.title }}
        </template>
        <template v-else>
          {{ t("watch.loadingTitle") }}
        </template>
      </h1>
      <Button
        v-if="video"
        type="button"
        variant="outline"
        size="sm"
        class="hidden border-white/20 bg-transparent text-white hover:bg-white/10 sm:inline-flex"
        @click="openOriginal"
      >
        <ExternalLink class="mr-2 size-4" />
        {{ t("watch.openOriginal") }}
      </Button>
      <LocaleSwitcher />
    </header>

    <div class="flex flex-1 flex-col overflow-auto p-4 pb-16 md:p-8">
      <div v-if="isPending" class="mx-auto w-full max-w-4xl space-y-4">
        <Skeleton class="aspect-video w-full rounded-xl bg-white/10" />
        <Skeleton class="h-4 w-2/3 bg-white/10" />
      </div>

      <div
        v-else-if="isError"
        class="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-xl border border-white/10 bg-[#1a1a1a] p-8 text-center"
      >
        <p class="text-white/80">
          {{ t("watch.loadError") }}
        </p>
        <Button
          type="button"
          class="bg-[#E50914] text-white hover:bg-[#f6121a]"
          @click="refetch"
        >
          {{ t("catalog.retry") }}
        </Button>
      </div>

      <div v-else-if="video" class="mx-auto w-full max-w-4xl space-y-8">
        <div class="overflow-hidden rounded-xl border border-white/10 bg-black">
          <video
            v-if="useNativePlayer"
            :src="video.url"
            controls
            playsinline
            class="aspect-video w-full bg-black"
          />
          <div
            v-else
            class="flex aspect-video flex-col items-center justify-center gap-4 bg-[#0a0a0a] p-6 text-center"
          >
            <p class="max-w-md text-sm text-white/65">
              {{ t("watch.embedUnavailable") }}
            </p>
            <Button
              type="button"
              class="bg-[#E50914] text-white hover:bg-[#f6121a]"
              @click="openOriginal"
            >
              <ExternalLink class="mr-2 size-4" />
              {{ t("watch.openOriginal") }}
            </Button>
          </div>
        </div>

        <p
          v-if="video.description"
          class="text-sm leading-relaxed text-white/70"
        >
          {{ video.description }}
        </p>

        <Button
          type="button"
          variant="outline"
          class="w-full border-white/20 bg-transparent text-white hover:bg-white/10 sm:hidden"
          @click="openOriginal"
        >
          <ExternalLink class="mr-2 size-4" />
          {{ t("watch.openOriginal") }}
        </Button>

        <VideoCommentsSection :video-id="videoId" />
      </div>
    </div>
  </CatalogShell>
</template>
