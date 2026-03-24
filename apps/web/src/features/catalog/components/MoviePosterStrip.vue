<script setup lang="ts">
import type { CatalogVideo } from "@/features/catalog/services/video"
import { useI18n } from "vue-i18n"

defineProps<{
  title: string
  videos: CatalogVideo[]
}>()

const { t } = useI18n()

function openWatch(v: CatalogVideo) {
  window.open(v.url, "_blank", "noopener,noreferrer")
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
      <button
        v-for="v in videos"
        :key="v.id"
        type="button"
        class="group shrink-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
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
    </div>
  </section>
</template>
