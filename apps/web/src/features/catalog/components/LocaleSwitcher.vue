<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppLocale } from "public/i18n";
import { persistLocale } from "public/i18n";
import { Languages } from "lucide-vue-next";
import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();

function setLocale(next: AppLocale) {
  locale.value = next;
  persistLocale(next);
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        class="shrink-0 gap-2 text-white/80 hover:bg-white/10 hover:text-white"
      >
        <Languages class="size-4" />
        <span class="hidden text-sm sm:inline">{{ t("locale.label") }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-44">
      <DropdownMenuRadioGroup
        :model-value="locale"
        @update:model-value="(v) => setLocale(v as AppLocale)"
      >
        <DropdownMenuRadioItem value="pt-BR">
          {{ t("locale.pt") }}
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="en">
          {{ t("locale.en") }}
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
