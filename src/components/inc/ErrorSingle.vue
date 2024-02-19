<template>
  <Transition name="slide-left">
    <ErrorMessage
      v-if="props.isError && !isHidden"
      :error="props.errorObject"
      @close="close()"
    />
  </Transition>
</template>

<script setup>
import { defineProps, ref, watch } from "vue";
import ErrorMessage from "./ErrorMessage.vue";

const props = defineProps({
  isError: Boolean,
  errorObject: Object,
  reloadTrigger: Boolean,
});

const isHidden = ref(false);

function close() {
  isHidden.value = true;
}

watch(
  () => props.reloadTrigger,
  () => {
    isHidden.value = false;
  }
);
</script>
