import type { UserRole } from "@/features/auth/types/auth";
import AddVideoPage from "@/features/catalog/pages/AddVideoPage.vue";
import CatalogPage from "@/features/catalog/pages/CatalogPage.vue";
import SignInPage from "@/features/auth/pages/SignInPage.vue";
import { useAuthStore } from "@/stores/auth.store";
import { createRouter, createWebHistory } from "vue-router";
import SignUpPage from "@/features/auth/pages/SignUpPage.vue";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiredRole?: UserRole;
  }
}

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
      meta: { requiresAuth: true, requiredRole: "admin" },
    },
    {
      path: "/signin",
      name: "Signin",
      component: SignInPage,
      meta: { requiresAuth: false },
    },
    {
      path: "/signup",
      name: "Signup",
      component: SignUpPage,
      meta: { requiresAuth: false },
    },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (!auth.ready) return true;

  if (to.meta.requiresAuth && !auth.isAuthenticated)
    return { name: "Signin", query: { redirect: to.fullPath } };

  if (to.meta.requiredRole && auth.user?.role !== to.meta.requiredRole)
    return { path: "/" };

  if (to.name === "Signin" && auth.isAuthenticated) return { path: "/" };

  return true;
});
