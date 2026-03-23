<script setup lang="ts">
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import {
  useModulesQuery,
  useSelectModuleMutation,
} from "@/features/composables/use-modules-query";
import { useHelloQuery } from "@/features/composables/use-hello-query";
import { useModulesStore } from "@/features/stores/modules.store";

const modulesQuery = useModulesQuery();
const selectModuleMutation = useSelectModuleMutation();
const helloQuery = useHelloQuery();
const modulesStore = useModulesStore();

const modules = computed(() => modulesQuery.data.value ?? []);

function handleSelect(moduleId: string) {
  selectModuleMutation.mutate(moduleId);
}
</script>

<template>
  <section class="space-y-4">
    <header class="space-y-1">
      <h2 class="text-xl font-medium">Modules</h2>
      <p class="text-sm text-muted-foreground">
        Exemplo de feature com services, composables e store.
      </p>
      <p class="text-sm font-medium">
        {{ helloQuery.data.value?.message ?? "Conectando no Fastify..." }}
      </p>
    </header>

    <p v-if="modulesQuery.isLoading.value" class="text-sm">
      Carregando modulos...
    </p>
    <p v-else-if="modulesQuery.isError.value" class="text-sm text-red-500">
      Falha ao carregar modulos.
    </p>

    <ul v-else class="grid gap-3">
      <li
        v-for="moduleItem in modules"
        :key="moduleItem.id"
        class="flex items-center justify-between rounded-lg border p-4"
      >
        <div class="space-y-1">
          <p class="font-medium">{{ moduleItem.name }}</p>
          <p class="text-sm text-muted-foreground">
            {{ moduleItem.description }}
          </p>
        </div>

        <Button
          :variant="
            modulesStore.selectedModuleId.value === moduleItem.id
              ? 'default'
              : 'outline'
          "
          :disabled="selectModuleMutation.isPending.value"
          @click="handleSelect(moduleItem.id)"
        >
          {{
            modulesStore.selectedModuleId.value === moduleItem.id
              ? "Selecionado"
              : "Selecionar"
          }}
        </Button>
      </li>
    </ul>
  </section>
</template>
