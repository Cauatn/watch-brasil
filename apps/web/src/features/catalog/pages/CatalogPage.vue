<script setup lang="ts">
import { Skeleton } from "@/components/ui/skeleton";
import { refDebounced } from "@vueuse/core";
import CatalogShell from "../components/CatalogShell.vue";
import CatalogHeroSection from "../components/CatalogHeroSection.vue";
import CatalogTopBar from "../components/CatalogTopBar.vue";
import MoviePosterStrip from "../components/MoviePosterStrip.vue";
import { useCatalogSearchQuery } from "../composables/use-catalog-search-query";
import { useVideosQuery } from "../composables/use-videos-query";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const search = ref("");
const debouncedSearch = refDebounced(search, 300);

const { data, isPending, isError, error, refetch } = useVideosQuery();

const {
  data: searchData,
  isFetching: searchFetching,
} = useCatalogSearchQuery(debouncedSearch);

const list = computed(() => data.value?.data ?? []);
const searchResults = computed(() => searchData.value?.data ?? []);

const searchStale = computed(
  () =>
    search.value.trim().length > 0 &&
    search.value.trim() !== debouncedSearch.value.trim(),
);

const searchDropdownPending = computed(
  () =>
    searchStale.value ||
    (Boolean(debouncedSearch.value.trim()) && searchFetching.value),
);

const featured = computed(() => list.value[0] ?? null);
const spotlight = computed(() => list.value[1] ?? null);

const afterHero = computed(() => list.value.slice(2));
const recommended = computed(() => afterHero.value.slice(0, 12));
const trending = computed(() => afterHero.value.slice(12, 24));
const rest = computed(() => afterHero.value.slice(24));
</script>

<template>
  <CatalogShell>
    <CatalogTopBar
      v-model:search="search"
      :search-results="searchResults"
      :search-pending="searchDropdownPending"
    />
    <div class="flex flex-1 flex-col gap-10 overflow-auto p-4 pb-16 md:p-8">
        <div v-if="isPending" class="space-y-8">
          <div class="grid gap-4 lg:grid-cols-[1.4fr_0.75fr]">
            <Skeleton class="h-[320px] rounded-2xl bg-white/10" />
            <Skeleton class="h-[320px] rounded-2xl bg-white/10" />
          </div>
          <div class="space-y-3">
            <Skeleton class="h-6 w-48 bg-white/10" />
            <div class="flex gap-3">
              <Skeleton
                v-for="i in 6"
                :key="i"
                class="h-[210px] w-[140px] shrink-0 rounded-xl bg-white/10"
              />
            </div>
          </div>
        </div>

        <div
          v-else-if="isError"
          class="rounded-2xl border border-white/10 bg-[#1a1a1a] p-8 text-center"
        >
          <p class="text-white">{{ t("catalog.loadError") }}</p>
          <p class="mt-2 text-sm text-white/50">
            {{ error?.message }}
          </p>
          <button
            type="button"
            class="mt-6 rounded-full bg-[#E50914] px-6 py-2 text-sm font-medium text-white hover:bg-[#f6121a]"
            @click="() => refetch()"
          >
            {{ t("catalog.retry") }}
          </button>
        </div>

        <template v-else>
          <CatalogHeroSection :featured="featured" :spotlight="spotlight" />

          <MoviePosterStrip
            v-if="recommended.length"
            :title="t('catalog.recommended')"
            :videos="recommended"
          />

          <MoviePosterStrip
            v-if="trending.length"
            :title="t('catalog.trending')"
            :videos="trending"
          />

          <MoviePosterStrip
            v-if="rest.length"
            :title="t('catalog.moreMovies')"
            :videos="rest"
          />

          <div
            v-if="!list.length"
            class="rounded-2xl border border-dashed border-white/15 py-20 text-center text-white/50"
          >
            {{ t("catalog.emptyCatalog") }}
          </div>
        </template>
    </div>
  </CatalogShell>
</template>
