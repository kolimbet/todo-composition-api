<template>
  <div class="d-flex align-items-center">
    <Transition name="fade" mode="out-in">
      <div
        v-if="getAuthorized"
        class="rounded-pill h-8 d-flex flex-wrap justify-content-center align-items-center bg-blue-light"
      >
        <RouterLink
          :to="{ name: 'account' }"
          class="d-flex align-items-center w-max text-dark text-secondary-hover text-decoration-none fw-bold"
          title="User Page"
        >
          <img
            :src="getAvatarUrl"
            class="d-block h-8 w-8 rounded-pill object-fit-contain"
          />
          <span class="d-flex align-items-center px-2 py-1 fs-sm">{{
            getUserName
          }}</span>
        </RouterLink>
        <div
          @click="logout()"
          class="d-flex align-items-center ms-0 bg-transparent text-dark text-secondary-hover cursor-pointer"
          title="logout"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="times"
            class="mx-2 w-3"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 352 512"
          >
            <path
              fill="currentColor"
              d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
            ></path>
          </svg>
        </div>
      </div>
      <RouterLink
        v-else
        :to="{ name: 'login' }"
        class="rounded border border-light bg-transparent px-3 py-1 text-white text-decoration-none opacity-75-hover"
        >Sign In</RouterLink
      >
    </Transition>
  </div>
</template>

<script setup>
import { parseErrorObject } from "@/lib/errors";
import {
  getAuthorized,
  getAvatarUrl,
  getUserName,
  actionLogout,
} from "@/composables/storeAuth";
import { nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

function logout() {
  actionLogout()
    .then(() => {
      nextTick(() => {
        router.go(route.path);
      });
    })
    .catch((err) => {
      console.log("Error: " + parseErrorObject(err));
    });
}
</script>
