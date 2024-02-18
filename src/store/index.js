import api from "@/api";
import router from "@/router";
import { createStore } from "vuex";

export default createStore({
  state: {
    authenticated: false,
    user: null,
    initial: false,
    startUrl: "/",
  },
  getters: {
    avatarUrl(state) {
      if (state.user?.avatar) return state.user.avatar.full_url;
      return "/images/default_avatar.png";
    },
    avatarId(state) {
      return state.user.avatar_id;
    },
  },
  mutations: {
    updateAuthenticated(state, userData = null) {
      if (userData === null) {
        state.user = null;
        state.authenticated = false;
      } else {
        state.user = userData;
        state.authenticated = true;
      }
    },
    completeStartingInitialization(state) {
      state.initial = true;
    },
    setStartURL(state, value) {
      state.startUrl = value;
    },
  },
  actions: {
    startInit({ state, commit, dispatch }) {
      return new Promise((resolve) => {
        commit("setStartURL", new URL(window.location));
        setTimeout(() => {
          dispatch("startAuth").then(() => {
            commit("completeStartingInitialization");
            if (state.startUrl.pathname != "/loading")
              router.push(state.startUrl.pathname + state.startUrl.search);
            else router.push("/");
            resolve(true);
          });
        }, 2000);
      });
    },
    startAuth({ commit }) {
      return new Promise((resolve) => {
        api
          .checkAuth()
          .then((userData) => {
            // console.log("storage->index->startAuth", userData);
            commit("updateAuthenticated", userData);
            resolve(userData);
          })
          .catch((err) => {
            commit("updateAuthenticated");
            resolve(err);
          });
      });
    },
    login({ commit }, auth) {
      return new Promise((resolve, reject) => {
        // console.log(auth);
        api
          .login(auth)
          .then((userData) => {
            commit("updateAuthenticated", userData);
            resolve(userData);
          })
          .catch((err) => {
            commit("updateAuthenticated");
            reject(err);
          });
      });
    },
    logout({ state, commit }) {
      return new Promise((resolve, reject) => {
        if (!state.authenticated) reject("You are not auth");
        else {
          api
            .logout()
            .then(() => {
              commit("updateAuthenticated");
              resolve(true);
            })
            .catch((err) => {
              console.log("api->logout error:", err);
              reject(err);
            });
        }
      });
    },
  },
  modules: {},
});
