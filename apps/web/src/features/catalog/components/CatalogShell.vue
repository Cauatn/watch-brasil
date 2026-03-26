<script setup lang="ts">
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import CatalogSidebarPanel from "./CatalogSidebarPanel.vue"
</script>

<template>
  <SidebarProvider :default-open="true">
    <Sidebar
      collapsible="none"
      class="border-white/10 bg-[#0f0f0f] text-sidebar-foreground"
    >
      <CatalogSidebarPanel />
    </Sidebar>
    <SidebarInset class="flex min-h-svh flex-1 flex-col bg-[#121212]">
      <slot />
    </SidebarInset>
  </SidebarProvider>
</template>
