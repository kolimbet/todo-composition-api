<template>
  <div>
    <h2 class="text-center">Page not found</h2>
    <div class="min-h-50vh pt-3">
      <div class="alert alert-danger text-center">
        Sorry, the page
        <a :href="route.fullPath">{{ route.fullPath }}</a>
        could not be found.
      </div>
      <p class="text-center">
        <RouterLink :to="{ name: 'home' }" title="Home Page"
          >Go back to the home page</RouterLink
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>
