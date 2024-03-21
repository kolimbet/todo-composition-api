<template>
  <div>
    <h2 class="text-center mb-0-75rem">User account</h2>
    <div
      class="mb-0-75rem p-1 d-flex flex-wrap justify-content-center gap-0-75rem bg-blue"
    >
      <template v-for="link in navLinks" :key="link.name">
        <RouterLink :to="{ name: link.name }" class="account-link">
          {{ link.title }}
        </RouterLink>
      </template>
    </div>

    <RouterView v-slot="{ Component }">
      <Transition name="slide-left" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup>
const navLinks = [
  {
    title: "Home",
    name: "account",
  },
  {
    title: "Avatar",
    name: "account_avatar",
  },
  {
    title: "Password",
    name: "account_password",
  },
];
</script>
