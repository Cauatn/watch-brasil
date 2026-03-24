import { createRouter, createWebHistory } from "vue-router";
import ModulesPage from "@/features/pages/ModulesPage.vue";
import SignInPage from "@/features/auth/pages/SignInPage.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "modules",
      component: ModulesPage,
    },
    {
      path: "/signin",
      name: "Signin",
      component: SignInPage,
    },
  ],
});
