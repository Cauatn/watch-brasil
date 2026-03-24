<script setup lang="ts">
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import CatalogHeroSection from "../components/CatalogHeroSection.vue";
import CatalogSidebarPanel from "../components/CatalogSidebarPanel.vue";
import CatalogTopBar from "../components/CatalogTopBar.vue";
import MoviePosterStrip from "../components/MoviePosterStrip.vue";
import { useVideosQuery } from "../composables/use-videos-query";
import { computed, ref } from "vue";

const search = ref("");

const { data, isPending, isError, error, refetch } = useVideosQuery();

const list = computed(() => data.value?.data ?? []);

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return list.value;
  return list.value.filter((v) => v.title.toLowerCase().includes(q));
});

const featured = computed(() => filtered.value[0] ?? null);
const spotlight = computed(() => filtered.value[1] ?? null);

const afterHero = computed(() => filtered.value.slice(2));
const recommended = computed(() => afterHero.value.slice(0, 12));
const trending = computed(() => afterHero.value.slice(12, 24));
const rest = computed(() => afterHero.value.slice(24));
</script>

<template>
  <SidebarProvider>
    <Sidebar
      collapsible="offcanvas"
      class="border-white/10 bg-[#0f0f0f] text-sidebar-foreground"
    >
      <CatalogSidebarPanel />
    </Sidebar>
    <SidebarInset class="flex min-h-svh flex-1 flex-col bg-[#121212]">
      <CatalogTopBar v-model:search="search" />
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
          <p class="text-white">Não foi possível carregar os filmes.</p>
          <p class="mt-2 text-sm text-white/50">
            {{ error?.message }}
          </p>
          <button
            type="button"
            class="mt-6 rounded-full bg-[#E50914] px-6 py-2 text-sm font-medium text-white hover:bg-[#f6121a]"
            @click="() => refetch()"
          >
            Tentar de novo
          </button>
        </div>

        <template v-else>
          <CatalogHeroSection :featured="featured" :spotlight="spotlight" />

          <MoviePosterStrip
            v-if="recommended.length"
            title="Recomendados para você"
            :videos="recommended"
          />

          <MoviePosterStrip
            v-if="trending.length"
            title="Em alta"
            :videos="trending"
          />

          <MoviePosterStrip
            v-if="rest.length"
            title="Mais filmes"
            :videos="rest"
          />

          <div
            v-if="!filtered.length"
            class="rounded-2xl border border-dashed border-white/15 py-20 text-center text-white/50"
          >
            <template v-if="search.trim()">
              Nenhum resultado para "{{ search.trim() }}".
            </template>
            <template v-else> Ainda não há filmes cadastrados. </template>
          </div>
        </template>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
