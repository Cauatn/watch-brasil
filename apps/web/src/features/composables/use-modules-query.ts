import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import {
  fetchModules,
  selectModule,
} from "@/features/services/modules.service";
import { useModulesStore } from "@/features/stores/modules.store";

export function useModulesQuery() {
  return useQuery({
    queryKey: ["modules"],
    queryFn: fetchModules,
    select: (response) => response.data,
  });
}

export function useSelectModuleMutation() {
  const queryClient = useQueryClient();
  const modulesStore = useModulesStore();

  return useMutation({
    mutationFn: selectModule,
    onSuccess: (moduleId) => {
      modulesStore.setSelectedModule(moduleId);
      queryClient.invalidateQueries({ queryKey: ["modules"] });
    },
  });
}
