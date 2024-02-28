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
      requiresAuth: true,
    },
  },
  {
    path: "/account",
    name: "account",
    component: () => import("@/components/account/UserAccount.vue"),
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
  // console.log("Routing to " + to.fullPath);
  if (to.meta.initFinished) {
    // console.log("Checking the end of initialization");
    if (!getInitiated.value) next("/loading");
    else {
      if (to.meta.requiresAuth) {
        // console.log("Сhecking Autorized", getAuthorized.value);
        if (!getAuthorized.value) next("/login");
        else next();
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;
