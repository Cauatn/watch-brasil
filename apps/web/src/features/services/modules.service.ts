import { getJson } from "@/shared/api/http";
import type { ModuleItem } from "@/features/types/module";

interface ModulesResponse {
  data: ModuleItem[];
}

export function fetchModules() {
  return getJson<ModulesResponse>("/mock/modules.json");
}

export function selectModule(moduleId: string) {
  return Promise.resolve(moduleId);
}
