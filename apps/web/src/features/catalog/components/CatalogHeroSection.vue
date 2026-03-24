<script setup lang="ts">
import { Button } from "@/components/ui/button"
import type { CatalogVideo } from "../services/video"
import { Play } from "lucide-vue-next"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const props = defineProps<{
  featured: CatalogVideo | null
  spotlight: CatalogVideo | null
}>()

function openWatch(v: CatalogVideo) {
  window.open(v.url, "_blank", "noopener,noreferrer")
}
</script>

<template>
  <section
    :class="[
      'grid gap-4 lg:gap-6',
      spotlight ? 'lg:grid-cols-[1.4fr_0.75fr]' : 'lg:grid-cols-1',
    ]"
  >
    <div
      v-if="featured"
      class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-2xl"
    >
      <div class="absolute inset-0">
        <img
          :src="featured.coverUrl"
          :alt="featured.title"
          class="h-full w-full object-cover opacity-60"
        >
        <div
          class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent"
        />
      </div>
      <div class="relative flex min-h-[280px] flex-col justify-end p-6 sm:min-h-[320px] md:p-8">
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#E50914]">
          {{ t("catalog.featured") }}
        </p>
        <h2 class="mb-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          {{ featured.title }}
        </h2>
        <p
          v-if="featured.description"
          class="mb-6 line-clamp-2 max-w-xl text-sm text-white/70"
        >
          {{ featured.description }}
        </p>
        <div class="flex flex-wrap gap-3">
          <Button
            type="button"
            class="rounded-full bg-[#E50914] px-8 text-white hover:bg-[#f6121a]"
            @click="openWatch(featured)"
          >
            <Play class="size-4 fill-current" />
            {{ t("catalog.watchNow") }}
          </Button>
        </div>
      </div>
    </div>
    <div
      v-else
      class="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03] text-center text-white/40"
    >
      {{ t("catalog.noFeatured") }}
    </div>

    <div
      v-if="spotlight"
      class="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#161616] shadow-xl"
    >
      <p class="px-4 pb-2 pt-4 text-xs font-semibold uppercase tracking-widest text-white/50">
        {{ t("catalog.movieOfDay") }}
      </p>
      <div class="relative flex-1 px-4 pb-4">
        <img
          :src="spotlight.coverUrl"
          :alt="spotlight.title"
          class="aspect-[3/4] w-full rounded-xl object-cover"
        >
        <div class="mt-3">
          <h3 class="font-semibold text-white">
            {{ spotlight.title }}
          </h3>
          <Button
            type="button"
            variant="outline"
            class="mt-3 w-full border-white/20 bg-transparent text-white hover:bg-white/10"
            @click="openWatch(spotlight)"
          >
            {{ t("catalog.watch") }}
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>
