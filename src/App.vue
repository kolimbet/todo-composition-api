<template>
  <div>
    <TopNavigation />

    <RouterView v-slot="{ Component }">
      <Transition
        name="slide-left"
        mode="out-in"
        class="container-md mw-xl-5xl my-3 py-3 px-2 px-md-0 min-vh-50 border border-2 border-start-0 border-end-0 border-blue"
      >
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup>
import TopNavigation from "@/components/inc/TopNavigation.vue";
import { onMounted } from "vue";
import store from "./store";

onMounted(() => {
  store.dispatch("startInit");
});
</script>

<style>
#app {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
