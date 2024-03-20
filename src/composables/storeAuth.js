import { computed, ref } from "vue";
import api from "@/api";

// State
const initiated = ref(false);
const authorized = ref(false);
const user = ref(null);

// Getters
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

// Actions
export const actionInitApp = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      actionStartAuth()
        .then(() => {
          setEndOfInitialization();
          resolve(true);
        })
        .catch((err) => {
          console.log("actionInitApp() error: " + err);
          setEndOfInitialization();
          resolve(true);
        });
    }, 1000);
  });

const actionStartAuth = () =>
  new Promise((resolve, reject) => {
    api
      .checkAuth()
      .then((userData) => {
        // console.log("storeAuth->startAuth", userData);
        setAuthData(userData);
        resolve(userData);
      })
      .catch((err) => {
        setAuthData();
        reject(err);
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

export const actionSetAvatar = (imageId) =>
  new Promise((resolve, reject) => {
    api
      .setUserAvatar(imageId)
      .then((data) => {
        setAuthData(data);
        resolve(data);
      })
      .catch((err) => {
        console.log("storage->index->setAvatar catch", err);
        reject(err);
      });
  });

export const actionDeleteAvatar = () =>
  new Promise((resolve, reject) => {
    api
      .deleteUserAvatar()
      .then((data) => {
        setAuthData(data);
        resolve(data);
      })
      .catch((err) => {
        console.log("storage->index->deleteAvatar catch", err);
        reject(err);
      });
  });
