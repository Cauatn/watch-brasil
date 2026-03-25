import { VueQueryPlugin } from "@tanstack/vue-query";
import type { App as VueApp } from "vue";
import { createPinia } from "pinia";
import { queryClient } from "@/providers/query-client";
import { router } from "@/router";
import { i18n } from "i18n";

export function registerPlugins(app: VueApp) {
  const pinia = createPinia();
  app.use(pinia);
  app.use(i18n);
  app.use(router);
  app.use(VueQueryPlugin, { queryClient });
}
