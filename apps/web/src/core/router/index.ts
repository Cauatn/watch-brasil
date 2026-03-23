import { createRouter, createWebHistory } from 'vue-router'
import ModulesPage from '@/features/pages/ModulesPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'modules',
      component: ModulesPage,
    },
  ],
})
