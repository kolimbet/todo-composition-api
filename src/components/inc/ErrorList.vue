<template>
  <TransitionGroup name="slide-left">
    <ErrorMessage
      v-for="err in filteredErrors"
      :key="err.$uid"
      :error="err"
      @close="close(err.$uid)"
    />
  </TransitionGroup>
</template>

<script setup>
import { computed, defineProps, ref, watch } from "vue";
import ErrorMessage from "./ErrorMessage.vue";

const props = defineProps({
  errorList: Array,
  reloadTrigger: Boolean,
});

const areHidden = ref([]);

const filteredErrors = computed(() =>
  props.errorList.filter((err) => !areHidden.value.includes(err.$uid))
);

watch(
  () => props.reloadTrigger,
  () => {
    areHidden.value = [];
  }
);

function close(uid) {
  areHidden.value.push(uid);
}
</script>
