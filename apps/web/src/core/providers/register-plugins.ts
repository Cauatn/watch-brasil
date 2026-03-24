import { VueQueryPlugin } from "@tanstack/vue-query";
import type { App as VueApp } from "vue";
import { createPinia } from "pinia";
import { queryClient } from "@/core/providers/query-client";
import { router } from "@/core/router";
import { i18n } from "@/core/i18n";

export function registerPlugins(app: VueApp) {
  const pinia = createPinia();
  app.use(pinia);
  app.use(i18n);
  app.use(router);
  app.use(VueQueryPlugin, { queryClient });
}
