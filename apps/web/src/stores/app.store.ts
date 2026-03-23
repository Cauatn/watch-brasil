import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    selectedModuleId: null as string | null,
  }),
  actions: {
    setSelectedModule(moduleId: string) {
      this.selectedModuleId = moduleId
    },
  },
})
