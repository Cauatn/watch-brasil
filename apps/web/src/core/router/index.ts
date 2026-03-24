import AddVideoPage from "@/features/catalog/pages/AddVideoPage.vue";
import CatalogPage from "@/features/catalog/pages/CatalogPage.vue";
import SignInPage from "@/features/auth/pages/SignInPage.vue";
import { useAuthStore } from "@/stores/auth.store";
import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "catalog",
      component: CatalogPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/catalog/add",
      name: "catalog-add",
      component: AddVideoPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/signin",
      name: "Signin",
      component: SignInPage,
      meta: { requiresAuth: false },
    },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (!auth.ready) return true;
  if (to.meta.requiresAuth && !auth.isAuthenticated)
    return { name: "Signin", query: { redirect: to.fullPath } };
  if (to.name === "Signin" && auth.isAuthenticated) return { path: "/" };
  return true;
});
