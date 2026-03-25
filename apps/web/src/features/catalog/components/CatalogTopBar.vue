<script setup lang="ts">
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search } from "lucide-vue-next"
import { useI18n } from "vue-i18n"
import LocaleSwitcher from "@/components/LocaleSwitcher.vue"

const search = defineModel<string>("search", { default: "" })
const { t } = useI18n()
</script>

<template>
  <header
    class="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-[#121212]/95 px-4 backdrop-blur-md md:px-6"
  >
    <SidebarTrigger class="text-white" />
    <div
      class="relative mx-auto flex w-full max-w-3xl flex-1 items-center gap-2 rounded-full border border-white/10 bg-[#1a1a1a] px-3 py-1.5 shadow-inner"
    >
      <Search class="size-4 shrink-0 text-white/40" />
      <Input
        v-model="search"
        type="search"
        :placeholder="t('catalog.searchPlaceholder')"
        class="h-9 border-0 bg-transparent px-0 text-sm text-white placeholder:text-white/40 focus-visible:ring-0"
      />
    </div>
    <LocaleSwitcher />
  </header>
</template>
