<script setup lang="ts">
import LocaleSwitcher from "@/components/LocaleSwitcher.vue";
import SignUpForm from "@/features/auth/components/SignUpForm.vue";
</script>

<template>
  <div class="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <div class="absolute right-4 top-4 z-10 md:right-8 md:top-6">
      <LocaleSwitcher tone="muted" />
    </div>
    <div class="w-full max-w-sm">
      <SignUpForm />
    </div>
  </div>
</template>
