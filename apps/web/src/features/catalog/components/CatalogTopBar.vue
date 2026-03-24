<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, ChevronDown, Globe, Search, SlidersHorizontal } from "lucide-vue-next"

const search = defineModel<string>("search", { default: "" })
</script>

<template>
  <header
    class="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-[#121212]/95 px-4 backdrop-blur-md md:px-6"
  >
    <SidebarTrigger class="text-white md:hidden" />
    <div
      class="relative mx-auto flex w-full max-w-3xl flex-1 items-center gap-2 rounded-full border border-white/10 bg-[#1a1a1a] px-3 py-1.5 shadow-inner"
    >
      <Search class="size-4 shrink-0 text-white/40" />
      <Input
        v-model="search"
        type="search"
        placeholder="Busque pelo título de um filme"
        class="h-9 border-0 bg-transparent px-0 text-sm text-white placeholder:text-white/40 focus-visible:ring-0"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="hidden shrink-0 text-white/50 hover:bg-white/10 hover:text-white sm:inline-flex"
      >
        <SlidersHorizontal class="size-4" />
      </Button>
    </div>
    <div class="hidden items-center gap-1 sm:flex">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="relative text-white/70 hover:bg-white/10 hover:text-white"
      >
        <Bell class="size-5" />
        <span
          class="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#E50914] ring-2 ring-[#121212]"
        />
      </Button>
      <Button
        type="button"
        variant="ghost"
        class="gap-1.5 text-white/80 hover:bg-white/10 hover:text-white"
      >
        <Globe class="size-4" />
        <span class="text-sm">Português</span>
        <ChevronDown class="size-4 opacity-60" />
      </Button>
    </div>
  </header>
</template>
