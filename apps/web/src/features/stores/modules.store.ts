import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app.store'

export function useModulesStore() {
  const appStore = useAppStore()
  const { selectedModuleId } = storeToRefs(appStore)

  const hasSelection = computed(() => selectedModuleId.value !== null)

  return {
    selectedModuleId,
    hasSelection,
    setSelectedModule: appStore.setSelectedModule,
  }
}
