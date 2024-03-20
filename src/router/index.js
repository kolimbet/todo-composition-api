// import store from "@/store";
import { createRouter, createWebHistory } from "vue-router";
import {
  getInitiated,
  getAuthorized,
  actionInitApp,
} from "@/composables/storeAuth";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/components/task/TaskList.vue"),
    meta: {
      requiresAuthorization: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/components/auth/LoginPage.vue"),
    meta: {
      requiresAuthorization: false,
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/components/auth/RegisterPage.vue"),
    meta: {
      requiresAuthorization: false,
    },
  },

  {
    path: "/account/:section",
    name: "account_section",
    component: () => import("@/components/account/UserAccount.vue"),
    meta: {
      requiresAuthorization: true,
    },
  },
  {
    path: "/account",
    name: "account",
    component: () => import("@/components/account/UserAccount.vue"),
    meta: {
      requiresAuthorization: true,
    },
  },
  {
    path: "/:pathMatch(.*)",
    name: "not_found",
    component: () => import("@/components/PageNotFound.vue"),
    meta: {
      requiresAuthorization: false,
    },
  },
];

const router = createRouter({
  base: "/",
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log("Routing to " + to.fullPath);

  if (getInitiated.value) {
    routing(to, next);
  } else {
    actionInitApp().then(() => {
      routing(to, next);
    });
  }
});

function routing(to, next) {
  // console.log(`start routing(${to.fullPath})`);
  if (to.meta.requiresAuthorization) {
    // console.log("Сhecking Autorized", getAuthorized.value);
    if (!getAuthorized.value) {
      // console.log("Router requiresAuthorization check redirect to: /login");
      next({ name: "login" });
    } else next();
  } else {
    next();
  }
}

export default router;
