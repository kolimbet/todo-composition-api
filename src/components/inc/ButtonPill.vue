<template>
  <button
    type="button"
    class="btn lh-1 rounded-pill px-3 py-2"
    :title="props.title"
  >
    <slot></slot>
    <span>{{ props.text }}</span>
  </button>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  text: String,
  title: { type: String, default: "" },
});
</script>
