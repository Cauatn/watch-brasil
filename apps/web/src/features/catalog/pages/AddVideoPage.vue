<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ArrowLeft } from "lucide-vue-next"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import AddVideoForm from "../components/AddVideoForm.vue"
import CatalogShell from "../components/CatalogShell.vue"
import LocaleSwitcher from "../components/LocaleSwitcher.vue"

const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <CatalogShell>
    <header
      class="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-[#121212]/95 px-4 backdrop-blur-md md:px-6"
    >
      <SidebarTrigger class="text-white" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="text-white/80 hover:bg-white/10 hover:text-white"
        @click="router.push('/')"
      >
        <ArrowLeft class="size-5" />
      </Button>
      <h1 class="min-w-0 flex-1 text-lg font-semibold tracking-tight text-white">
        {{ t("addVideo.pageTitle") }}
      </h1>
      <LocaleSwitcher />
    </header>
    <div class="flex flex-1 flex-col overflow-auto p-4 pb-16 md:p-8">
      <AddVideoForm />
    </div>
  </CatalogShell>
</template>
