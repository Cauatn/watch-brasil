<script lang="ts">
export const description = "A simple login form.";
</script>

<script setup lang="ts">
import LocaleSwitcher from "@/components/LocaleSwitcher.vue";
import { useI18n } from "vue-i18n";
import LoginForm from "../components/LoginForm.vue";

const { locale } = useI18n();
</script>

<template>
  <div class="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <div
      class="absolute right-4 top-4 z-10 flex items-center gap-2 md:right-8 md:top-6"
    >
      <span
        v-if="locale === 'pt-BR'"
        class="text-sm text-muted-foreground"
      >Porgutes</span>
      <LocaleSwitcher tone="muted" />
    </div>
    <div class="w-full max-w-sm">
      <LoginForm />
    </div>
  </div>
</template>
