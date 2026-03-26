<script setup lang="ts">
import LocaleSwitcher from "@/components/LocaleSwitcher.vue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import CatalogShell from "@/features/catalog/components/CatalogShell.vue";
import { useAdminReportsQuery } from "@/features/admin/composables/use-admin-reports-query";
import { ArrowLeft, LayoutDashboard } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const router = useRouter();
const { t } = useI18n();

const { data, isPending, isError, error, refetch } = useAdminReportsQuery();
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
      <LayoutDashboard class="size-5 text-[#E50914]" />
      <h1
        class="min-w-0 flex-1 text-lg font-semibold tracking-tight text-white"
      >
        {{ t("admin.dashboardTitle") }}
      </h1>
      <LocaleSwitcher />
    </header>

    <div class="flex flex-1 flex-col gap-6 overflow-auto p-4 pb-16 md:p-8">
      <p class="text-sm text-white/60">
        {{ t("admin.dashboardSubtitle") }}
      </p>

      <div
        v-if="isPending"
        class="rounded-xl border border-white/10 bg-white/5 p-8 text-white/70"
      >
        {{ t("admin.loading") }}
      </div>
      <div
        v-else-if="isError"
        class="space-y-3 rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-white"
      >
        <p>{{ t("admin.loadError") }}</p>
        <p class="text-sm opacity-80">{{ String(error) }}</p>
        <Button variant="secondary" @click="() => refetch()">
          {{ t("catalog.retry") }}
        </Button>
      </div>
      <template v-else-if="data">
        <div
          class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Card class="border-white/10 bg-[#1a1a1a] text-white">
            <CardHeader class="pb-2">
              <CardDescription class="text-white/60">
                {{ t("admin.metricUsers") }}
              </CardDescription>
              <CardTitle class="text-3xl text-white">{{
                data.totals.users
              }}</CardTitle>
            </CardHeader>
          </Card>
          <Card class="border-white/10 bg-[#1a1a1a] text-white">
            <CardHeader class="pb-2">
              <CardDescription class="text-white/60">
                {{ t("admin.metricVideos") }}
              </CardDescription>
              <CardTitle class="text-3xl text-white">{{
                data.totals.videos
              }}</CardTitle>
            </CardHeader>
          </Card>
          <Card class="border-white/10 bg-[#1a1a1a] text-white">
            <CardHeader class="pb-2">
              <CardDescription class="text-white/60">
                {{ t("admin.metricComments") }}
              </CardDescription>
              <CardTitle class="text-3xl text-white">{{
                data.totals.comments
              }}</CardTitle>
            </CardHeader>
          </Card>
          <Card class="border-white/10 bg-[#1a1a1a] text-white">
            <CardHeader class="pb-2">
              <CardDescription class="text-white/60">
                {{ t("admin.metricTasks") }}
              </CardDescription>
              <CardTitle class="text-3xl text-white">{{
                data.totals.tasks
              }}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div class="grid gap-4 lg:grid-cols-2">
          <Card class="border-white/10 bg-[#1a1a1a] text-white">
            <CardHeader>
              <CardTitle class="text-lg">{{
                t("admin.tasksByStatus")
              }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2 text-sm">
              <div
                v-for="(n, key) in data.tasksByStatus"
                :key="key"
                class="flex justify-between border-b border-white/5 py-1"
              >
                <span class="text-white/80">{{ key }}</span>
                <span class="font-mono text-white">{{ n }}</span>
              </div>
            </CardContent>
          </Card>
          <Card class="border-white/10 bg-[#1a1a1a] text-white">
            <CardHeader>
              <CardTitle class="text-lg">{{
                t("admin.tasksByCategory")
              }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2 text-sm">
              <div
                v-for="(n, key) in data.tasksByCategory"
                :key="key"
                class="flex justify-between border-b border-white/5 py-1"
              >
                <span class="text-white/80">{{ key }}</span>
                <span class="font-mono text-white">{{ n }}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <Card class="border-white/10 bg-[#1a1a1a] text-white">
            <CardHeader class="pb-2">
              <CardDescription class="text-white/60">
                {{ t("admin.watchlistOpen") }}
              </CardDescription>
              <CardTitle class="text-2xl text-[#E50914]">{{
                data.watchlistOpen
              }}</CardTitle>
            </CardHeader>
            <CardContent class="text-xs text-white/50">
              {{ t("admin.watchlistHint") }}
            </CardContent>
          </Card>
          <Card class="border-white/10 bg-[#1a1a1a] text-white">
            <CardHeader class="pb-2">
              <CardDescription class="text-white/60">
                {{ t("admin.newUsers") }}
              </CardDescription>
              <CardTitle class="text-2xl text-white">{{
                data.newUsersLast7Days
              }}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </template>
    </div>
  </CatalogShell>
</template>
