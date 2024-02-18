import store from "@/store";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/loading",
    name: "loading",
    component: () => import("@/components/LoadingComponent.vue"),
    meta: {
      initFinished: false,
      requiresAuth: false,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/components/auth/LoginPage.vue"),
    meta: {
      initFinished: true,
      requiresAuth: false,
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/components/auth/RegisterPage.vue"),
    meta: {
      initFinished: true,
      requiresAuth: false,
    },
  },
  {
    path: "/",
    name: "home",
    component: () => import("@/components/task/TaskList.vue"),
    meta: {
      initFinished: true,
      requiresAuth: true,
    },
  },
  {
    path: "/user",
    name: "user",
    component: () => import("@/components/user/UserPage.vue"),
    meta: {
      initFinished: true,
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  base: "/",
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.initFinished)) {
    if (!store.state.initial) next("/loading");
    else {
      if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (store.state.authenticated) next();
        else next("/login");
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;
