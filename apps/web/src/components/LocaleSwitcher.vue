<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppLocale } from "@/i18n";
import { persistLocale } from "@/i18n";
import { ChevronDown } from "lucide-vue-next";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = withDefaults(
  defineProps<{
    /** "light" = texto claro (headers escuros); "muted" = tema formulário */
    tone?: "light" | "muted";
  }>(),
  { tone: "light" },
);

const { locale, t } = useI18n();

const triggerClass = computed(() =>
  props.tone === "muted"
    ? "shrink-0 gap-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
    : "shrink-0 gap-1.5 text-white/80 hover:bg-white/10 hover:text-white",
);

const currentFlag = computed(() =>
  locale.value === "pt-BR" ? "\u{1F1E7}\u{1F1F7}" : "\u{1F1FA}\u{1F1F8}",
);

const currentLabel = computed(() =>
  locale.value === "pt-BR" ? t("locale.namePt") : t("locale.nameEn"),
);

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
        :class="['font-normal', triggerClass]"
        :aria-label="`${t('locale.label')}: ${currentLabel}`"
      >
        <span class="text-lg leading-none" aria-hidden="true">{{
          currentFlag
        }}</span>
        <span class="max-w-[9rem] truncate text-sm font-medium">{{
          currentLabel
        }}</span>
        <ChevronDown class="size-3.5 shrink-0 opacity-70" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-48">
      <DropdownMenuRadioGroup
        :model-value="locale"
        @update:model-value="(v) => setLocale(v as AppLocale)"
      >
        <DropdownMenuRadioItem value="pt-BR" class="gap-2">
          <span class="text-base leading-none" aria-hidden="true"
            >&#x1F1E7;&#x1F1F7;</span
          >
          <span>{{ t("locale.namePt") }}</span>
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="en" class="gap-2">
          <span class="text-base leading-none" aria-hidden="true"
            >&#x1F1FA;&#x1F1F8;</span
          >
          <span>{{ t("locale.nameEn") }}</span>
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
