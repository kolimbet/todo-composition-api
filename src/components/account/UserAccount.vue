<template>
  <div>
    <h2 class="text-center mb-0-75rem">User account</h2>
    <div
      class="mb-0-75rem p-1 d-flex flex-wrap justify-content-center gap-0-75rem bg-blue text-white text-opacity-90"
    >
      <template v-for="comp in tabComponents" :key="comp.alias">
        <RouterLink
          :to="{ name: 'account_section', params: { section: comp.alias } }"
          class="px-0-75rem py-1 rounded-2 cursor-pointer text-nowrap link-white text-decoration-none"
          :class="[buttonClasses(comp)]"
        >
          {{ comp.title }}
        </RouterLink>
      </template>
    </div>
    <Transition name="slide-left" mode="out-in">
      <component :is="currentTabComponent" />
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import AccountHome from "./AccountHome.vue";
import AccountAvatar from "./AccountAvatar.vue";
import AccountPassword from "./AccountPassword.vue";

const tabComponents = [
  {
    title: "Home",
    alias: "home",
    name: AccountHome,
  },
  {
    title: "Avatar",
    alias: "avatar",
    component: AccountAvatar,
  },
  {
    title: "Password",
    alias: "change-password",
    component: AccountPassword,
  },
];

const currentTabAlias = ref("home");
const currentTabComponent = computed(() => {
  return (
    tabComponents.find((elt) => elt.alias == currentTabAlias.value).component ??
    AccountHome
  );
});

const route = useRoute();

function selectComponent(componentAlias) {
  // console.log(route);
  let component = tabComponents.find((elt) => elt.alias === componentAlias);
  if (component !== undefined) currentTabAlias.value = component.alias;
}

function buttonClasses(testedComponent) {
  if (testedComponent.alias == currentTabAlias.value) return "bg-blue-dark";
  else return "";
}

watch(
  () => route.params,
  (newParams) => {
    selectComponent(newParams?.section ?? "home");
  }
);

onMounted(() => {
  selectComponent(route.params?.section ?? "home");
});
</script>
