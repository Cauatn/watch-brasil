<script setup lang="ts">
import type { CatalogVideo } from "@/features/catalog/services/video"
import { useCreateWatchTask } from "@/features/tasks/composables/use-create-watch-task"
import { ListPlus } from "lucide-vue-next"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

defineProps<{
  title: string
  videos: CatalogVideo[]
}>()

const { t } = useI18n()
const router = useRouter()
const { addWatchTask, pendingVideoId } = useCreateWatchTask()

function openWatch(v: CatalogVideo) {
  router.push({ name: "watch", params: { id: v.id } })
}
</script>

<template>
  <section class="space-y-3">
    <div class="flex items-end justify-between gap-4 px-1">
      <h3 class="text-lg font-semibold tracking-tight text-white md:text-xl">
        {{ title }}
      </h3>
      <button
        type="button"
        class="text-xs font-medium text-[#E50914] hover:underline"
      >
        {{ t("catalog.seeAll") }}
      </button>
    </div>
    <div class="-mx-1 flex gap-3 overflow-x-auto pb-2 pt-1">
      <div
        v-for="v in videos"
        :key="v.id"
        class="group relative shrink-0"
      >
        <button
          type="button"
          class="block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
          @click="openWatch(v)"
        >
          <div
            class="w-[120px] overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] shadow-lg transition-transform duration-200 group-hover:scale-[1.03] group-hover:border-white/20 sm:w-[140px] md:w-[152px]"
          >
            <img
              :src="v.coverUrl"
              :alt="v.title"
              class="aspect-[2/3] w-full object-cover"
              loading="lazy"
            >
          </div>
        </button>
        <button
          type="button"
          class="absolute bottom-2 right-2 flex size-9 items-center justify-center rounded-lg border border-white/20 bg-black/75 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-[#E50914] hover:border-[#E50914] disabled:opacity-50"
          :disabled="pendingVideoId === v.id"
          :aria-label="t('catalog.watchLater')"
          @click.stop="addWatchTask(v)"
        >
          <ListPlus class="size-5" />
        </button>
      </div>
    </div>
  </section>
</template>
