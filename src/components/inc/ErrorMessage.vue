<template>
  <div
    class="mt-1 ps-3 pe-1 py-1 d-flex align-items-center justify-content-between rounded-2 border border-red border-opacity-50 bg-red-light text-red-dark"
  >
    <span>{{ props.error.$message }}</span>
    <span @click="emit('close')" class="px-2 py-1 cursor-pointer">
      <svg
        class="h-5 w-5 fill-current text-red text-red-dark-hover"
        role="button"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <title>Close</title>
        <path
          d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
        />
      </svg>
    </span>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  error: Object,
});

const emit = defineEmits(["close"]);
</script>
