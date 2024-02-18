<template>
  <div class="navbar navbar-expand navbar-dark top-nav-bg-gradient">
    <div class="container-fluid justify-content-between">
      <div class="h-8 d-flex">
        <RouterLink
          to="/"
          class="d-flex align-items-center text-decoration-none text-white opacity-75-hover"
          title="Home Page"
        >
          <img
            src="/images/logo.png"
            alt="Главная"
            class="d-inline-block h-8 w-8"
          />
          <span class="px-2 fw-bold fs-5">To Do</span>
        </RouterLink>
      </div>

      <AuthElement />
    </div>
  </div>
</template>

<script setup>
import AuthElement from "../auth/AuthElement.vue";
</script>
