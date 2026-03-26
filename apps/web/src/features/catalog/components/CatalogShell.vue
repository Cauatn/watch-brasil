<script setup lang="ts">
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import CatalogSidebarPanel from "./CatalogSidebarPanel.vue"
</script>

<template>
  <SidebarProvider :default-open="false">
    <Sidebar
      collapsible="icon"
      class="border-white/10 bg-[#0f0f0f] text-sidebar-foreground"
    >
      <CatalogSidebarPanel />
      <SidebarRail />
    </Sidebar>
    <SidebarInset class="flex min-h-svh flex-1 flex-col bg-[#121212]">
      <slot />
    </SidebarInset>
  </SidebarProvider>
</template>
