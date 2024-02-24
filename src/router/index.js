// import store from "@/store";
import { createRouter, createWebHistory } from "vue-router";
import { getInitiated, getAuthorized } from "@/composables/storeAuth";

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
    path: "/account/:section",
    name: "account_section",
    component: () => import("@/components/account/UserAccount.vue"),
    meta: {
      initFinished: true,
      requiredAuth: true,
    },
  },
  {
    path: "/account",
    name: "account",
    component: () => import("@/components/account/UserAccount.vue"),
    meta: {
      initFinished: true,
      requiredAuth: true,
    },
  },
];

const router = createRouter({
  base: "/",
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // console.log({ from, to });
  if (to.matched.some((record) => record.meta.initFinished)) {
    if (!getInitiated.value) next("/loading");
    else {
      if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (getAuthorized.value) next();
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
