<script setup lang="ts">
import LocaleSwitcher from "@/components/LocaleSwitcher.vue";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { CatalogVideo } from "@/features/catalog/services/video";
import { Search } from "lucide-vue-next";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const search = defineModel<string>("search", { default: "" });

const props = defineProps<{
  searchResults: CatalogVideo[];
  searchPending: boolean;
}>();

const { t } = useI18n();
const router = useRouter();

const rootRef = ref<HTMLElement | null>(null);
const focusWithin = ref(false);

const showDropdown = computed(
  () => focusWithin.value && search.value.trim().length > 0,
);

function onFocusOut(e: FocusEvent) {
  const next = e.relatedTarget as Node | null;
  if (next && rootRef.value?.contains(next)) return;
  focusWithin.value = false;
}

function onFocusIn() {
  focusWithin.value = true;
}

function goToVideo(id: string) {
  void router.push({ name: "watch", params: { id } });
  focusWithin.value = false;
}
</script>

<template>
  <header
    class="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-[#121212]/95 px-4 backdrop-blur-md md:px-6"
  >
    <SidebarTrigger class="text-white" />
    <div
      ref="rootRef"
      class="relative mx-auto flex w-full max-w-3xl flex-1 overflow-visible"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
    >
      <div
        class="flex w-full items-center gap-2 rounded-full border border-white/10 bg-[#1a1a1a] px-3 py-1.5 shadow-inner"
      >
        <Search class="size-4 shrink-0 text-white/40" />
        <Input
          v-model="search"
          type="search"
          autocomplete="off"
          :placeholder="t('catalog.searchPlaceholder')"
          class="h-9 border-0 bg-transparent px-0 text-sm text-white placeholder:text-white/40 focus-visible:ring-0"
        />
      </div>

      <div
        v-if="showDropdown"
        class="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 max-h-[min(70vh,22rem)] overflow-y-auto rounded-xl border border-white/10 bg-[#141414] py-1 shadow-2xl ring-1 ring-black/40"
        role="listbox"
        :aria-label="t('catalog.searchResultsLabel')"
      >
        <div
          v-if="searchPending"
          class="px-4 py-3 text-sm text-white/50"
        >
          {{ t("catalog.searchLoading") }}
        </div>
        <template v-else>
          <button
            v-for="v in searchResults"
            :key="v.id"
            type="button"
            role="option"
            class="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-white hover:bg-white/10"
            @mousedown.prevent
            @click="goToVideo(v.id)"
          >
            <img
              :src="v.coverUrl"
              alt=""
              class="size-11 shrink-0 rounded-md object-cover"
              loading="lazy"
            >
            <span class="min-w-0 flex-1 truncate font-medium leading-tight">{{
              v.title
            }}</span>
          </button>
          <p
            v-if="searchResults.length === 0"
            class="px-4 py-3 text-sm text-white/50"
          >
            {{ t("catalog.searchNoResults") }}
          </p>
        </template>
      </div>
    </div>
    <LocaleSwitcher />
  </header>
</template>
