<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import TasksPanelContent from "@/features/tasks/components/TasksPanelContent.vue";
import { ListTodo } from "lucide-vue-next";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button
        type="button"
        variant="outline"
        size="sm"
        class="shrink-0 border-white/20 bg-transparent text-white hover:bg-white/10"
      >
        <ListTodo class="mr-2 size-4 text-[#E50914]" />
        {{ t("tasks.viewTasks") }}
      </Button>
    </SheetTrigger>
    <SheetContent
      side="right"
      class="flex w-full max-w-full flex-col border-white/10 bg-[#121212] p-0 sm:max-w-2xl"
    >
      <div class="flex max-h-[100dvh] flex-1 flex-col overflow-hidden">
        <SheetHeader
          class="space-y-2 border-b border-white/10 px-4 py-4 text-left sm:px-6"
        >
          <SheetTitle class="pr-8 text-white">
            {{ t("tasks.pageTitle") }}
          </SheetTitle>
          <SheetDescription class="text-left text-sm leading-relaxed text-white/65">
            {{ t("tasks.pageIntro") }}
          </SheetDescription>
        </SheetHeader>
        <div class="min-h-0 w-full flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <TasksPanelContent stacked />
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
