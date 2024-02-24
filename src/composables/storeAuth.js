import { computed, ref } from "vue";
import api from "@/api";
import router from "@/router";

// State
const startUrl = ref("/");
const initiated = ref(false);
const authorized = ref(false);
const user = ref(null);

// Getters
export const getStartUrl = computed(() => startUrl.value);
export const getInitiated = computed(() => initiated.value);
export const getAuthorized = computed(() => authorized.value);
export const getAvatarUrl = computed(() =>
  user.value?.avatar ? user.value.avatar.full_url : "/images/default_avatar.png"
);
export const getAvatarId = computed(() => user.value.avatar_id);
export const getUserName = computed(() => user.value?.name ?? "...");

// Setters
const setAuthData = (userData = null) => {
  if (userData === null) {
    user.value = null;
    authorized.value = false;
  } else {
    user.value = userData;
    authorized.value = true;
  }
};
const setEndOfInitialization = () => {
  initiated.value = true;
};
export const setStartURL = (url) => {
  startUrl.value = url;
};

// Actions
export const actionStartInit = () =>
  new Promise((resolve) => {
    setStartURL(new URL(window.location));
    setTimeout(() => {
      actionStartAuth().then(() => {
        setEndOfInitialization();
        if (startUrl.value.pathname != "/loading")
          router.push(startUrl.value.pathname + startUrl.value.search);
        else router.push("/");
        resolve(true);
      });
    }, 2000);
  });

const actionStartAuth = () =>
  new Promise((resolve) => {
    api
      .checkAuth()
      .then((userData) => {
        // console.log("storeAuth->startAuth", userData);
        setAuthData(userData);
        resolve(userData);
      })
      .catch((err) => {
        setAuthData();
        resolve(err);
      });
  });

export const actionLogin = (auth) =>
  new Promise((resolve, reject) => {
    // console.log(auth);
    api
      .login(auth)
      .then((userData) => {
        setAuthData(userData);
        resolve(userData);
      })
      .catch((err) => {
        setAuthData();
        reject(err);
      });
  });

export const actionLogout = () =>
  new Promise((resolve, reject) => {
    if (!authorized.value) reject("You are not auth");
    else {
      api
        .logout()
        .then(() => {
          setAuthData();
          resolve(true);
        })
        .catch((err) => {
          console.log("storeAuth->actionLogout error:", err);
          reject(err);
        });
    }
  });
