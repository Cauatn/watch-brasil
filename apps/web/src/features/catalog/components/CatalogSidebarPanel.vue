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
import { useQueryClient } from "@tanstack/vue-query"
import {
  Clapperboard,
  Clock,
  Headphones,
  Home,
  LayoutDashboard,
  ListTodo,
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
const queryClient = useQueryClient()
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
  queryClient.clear()
  void router.push({ name: "Signin" })
}
</script>

<template>
  <SidebarHeader class="border-b border-white/10 px-4 py-5 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
    <RouterLink
      to="/"
      class="flex items-center gap-3 font-semibold tracking-tight text-white group-data-[collapsible=icon]:justify-center"
    >
      <span
        class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#E50914] text-white shadow-lg shadow-red-900/40 group-data-[collapsible=icon]:size-8"
      >
        <Clapperboard class="size-5 group-data-[collapsible=icon]:size-4" />
      </span>
      <span class="text-lg leading-none group-data-[collapsible=icon]:hidden">{{ t("brand.title") }}</span>
    </RouterLink>
  </SidebarHeader>

  <SidebarContent class="px-2 py-4 group-data-[collapsible=icon]:px-0">
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
              :tooltip="t('sidebar.adminDashboard')"
              :is-active="route.path === '/admin/dashboard'"
              class="text-sidebar-foreground hover:bg-white/10 data-[active=true]:bg-white/15"
            >
              <RouterLink to="/admin/dashboard">
                <LayoutDashboard />
                <span>{{ t("sidebar.adminDashboard") }}</span>
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
              as-child
              :tooltip="t('sidebar.watchlist')"
              :is-active="route.path === '/tasks'"
              class="text-sidebar-foreground hover:bg-white/10 data-[active=true]:bg-white/15"
            >
              <RouterLink to="/tasks">
                <ListTodo />
                <span>{{ t("sidebar.watchlist") }}</span>
              </RouterLink>
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

  <SidebarFooter class="mt-auto shrink-0 border-t border-white/10 p-3 group-data-[collapsible=icon]:p-2">
    <DropdownMenu>
      <DropdownMenuTrigger
        class="flex w-full items-center gap-3 rounded-xl bg-white/5 p-2 text-left hover:bg-white/10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0"
      >
        <Avatar class="size-10 shrink-0 border border-white/10 group-data-[collapsible=icon]:size-8">
          <AvatarFallback class="bg-white/10 text-xs text-white">
            {{ initials }}
          </AvatarFallback>
        </Avatar>
        <div class="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
          <p class="truncate text-sm font-medium text-white">
            {{ authStore.user?.name ?? t("sidebar.user") }}
          </p>
          <p class="truncate text-xs text-white/50">
            {{ authStore.user?.email }}
          </p>
        </div>
        <MoreVertical class="size-4 shrink-0 text-white/70 group-data-[collapsible=icon]:hidden" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-44">
        <DropdownMenuItem @click="logout">
          <LogOut class="mr-2 size-4" />
          {{ t("sidebar.logout") }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarFooter>
</template>
