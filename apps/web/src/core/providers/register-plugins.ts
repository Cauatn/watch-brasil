import { VueQueryPlugin } from '@tanstack/vue-query'
import type { App as VueApp } from 'vue'
import { createPinia } from 'pinia'
import { queryClient } from '@/core/providers/query-client'
import { router } from '@/core/router'
import { useAuthStore } from '@/stores/auth.store'

export function registerPlugins(app: VueApp) {
  const pinia = createPinia()
  app.use(pinia)
  useAuthStore().hydrate()
  app.use(router)
  app.use(VueQueryPlugin, { queryClient })
}
