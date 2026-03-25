<script setup lang="ts">
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/auth.store"
import {
  Clapperboard,
  Clock,
  Headphones,
  Heart,
  Home,
  LogOut,
  MoreVertical,
  PlusCircle,
  Settings,
} from "lucide-vue-next"
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const initials = computed(() => {
  const n = authStore.user?.name?.trim()
  if (!n)
    return "?"
  const parts = n.split(/\s+/)
  if (parts.length >= 2)
    return (parts[0]![0]! + parts[1]![0]!).toUpperCase()
  return n.slice(0, 2).toUpperCase()
})

function logout() {
  authStore.logout()
  void router.push({ name: "Signin" })
}
</script>

<template>
  <SidebarHeader class="border-b border-white/10 px-4 py-5">
    <RouterLink
      to="/"
      class="flex items-center gap-3 font-semibold tracking-tight text-white"
    >
      <span
        class="flex size-10 items-center justify-center rounded-lg bg-[#E50914] text-white shadow-lg shadow-red-900/40"
      >
        <Clapperboard class="size-5" />
      </span>
      <span class="text-lg leading-none">{{ t("brand.title") }}</span>
    </RouterLink>
  </SidebarHeader>

  <SidebarContent class="px-2 py-4">
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              as-child
              :tooltip="t('sidebar.home')"
              :is-active="route.path === '/'"
              class="text-sidebar-foreground hover:bg-white/10 data-[active=true]:bg-white/15"
            >
              <RouterLink to="/">
                <Home />
                <span>{{ t("sidebar.home") }}</span>
              </RouterLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem v-if="authStore.isAdmin">
            <SidebarMenuButton
              as-child
              :tooltip="t('sidebar.addMovie')"
              :is-active="route.path === '/catalog/add'"
              class="text-sidebar-foreground hover:bg-white/10 data-[active=true]:bg-white/15"
            >
              <RouterLink to="/catalog/add">
                <PlusCircle />
                <span>{{ t("sidebar.addMovie") }}</span>
              </RouterLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              disabled
              class="opacity-50"
              :tooltip="t('sidebar.comingSoon')"
            >
              <Heart />
              <span>{{ t("sidebar.watchlist") }}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              disabled
              class="opacity-50"
              :tooltip="t('sidebar.comingSoon')"
            >
              <Clock />
              <span>{{ t("sidebar.history") }}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              disabled
              class="opacity-50"
              :tooltip="t('sidebar.comingSoon')"
            >
              <Headphones />
              <span>{{ t("sidebar.support") }}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              disabled
              class="opacity-50"
              :tooltip="t('sidebar.comingSoon')"
            >
              <Settings />
              <span>{{ t("sidebar.settings") }}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>

  <SidebarFooter class="border-t border-white/10 p-3">
    <div class="flex items-center gap-3 rounded-xl bg-white/5 p-2">
      <Avatar class="size-10 border border-white/10">
        <AvatarFallback class="bg-white/10 text-xs text-white">
          {{ initials }}
        </AvatarFallback>
      </Avatar>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium text-white">
          {{ authStore.user?.name ?? t("sidebar.user") }}
        </p>
        <p class="truncate text-xs text-white/50">
          {{ authStore.user?.email }}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger
          class="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white"
        >
          <MoreVertical class="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-44">
          <DropdownMenuItem @click="logout">
            <LogOut class="mr-2 size-4" />
            {{ t("sidebar.logout") }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </SidebarFooter>
</template>
