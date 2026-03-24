import { VueQueryPlugin } from '@tanstack/vue-query'
import type { App as VueApp } from 'vue'
import { createPinia } from 'pinia'
import { queryClient } from '@/core/providers/query-client'
import { router } from '@/core/router'

export function registerPlugins(app: VueApp) {
  const pinia = createPinia()
  app.use(pinia)
  app.use(router)
  app.use(VueQueryPlugin, { queryClient })
}
