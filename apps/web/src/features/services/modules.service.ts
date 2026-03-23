import { getJson } from "@/shared/api/http";
import { modulesResponseSchema } from "@/features/types/module";

export function fetchModules() {
  return getJson("/mock/modules.json").then((payload) =>
    modulesResponseSchema.parse(payload),
  );
}

export function selectModule(moduleId: string) {
  return Promise.resolve(moduleId);
}
