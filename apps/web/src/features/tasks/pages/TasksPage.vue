<script setup lang="ts">
import LocaleSwitcher from "@/components/LocaleSwitcher.vue";
import { SidebarTrigger } from "@/components/ui/sidebar";
import CatalogShell from "@/features/catalog/components/CatalogShell.vue";
import TasksPanelContent from "@/features/tasks/components/TasksPanelContent.vue";
import { ListTodo } from "lucide-vue-next";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <CatalogShell>
    <header
      class="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-[#121212]/95 px-4 backdrop-blur-md md:px-6"
    >
      <SidebarTrigger class="text-white" />
      <ListTodo class="size-5 text-[#E50914]" />
      <h1
        class="min-w-0 flex-1 text-lg font-semibold tracking-tight text-white"
      >
        {{ t("tasks.pageTitle") }}
      </h1>
      <LocaleSwitcher />
    </header>

    <p
      class="border-b border-white/10 bg-black/35 px-4 py-3 text-sm leading-relaxed text-white/70 md:px-6"
    >
      {{ t("tasks.pageIntro") }}
    </p>

    <TasksPanelContent />
  </CatalogShell>
</template>
