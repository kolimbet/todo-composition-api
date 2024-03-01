<template>
  <div class="position-relative">
    <IconUpdate
      @click="requestTaskCounter()"
      class="position-absolute end-1 top-0"
    />

    <h3 class="text-center">User Home</h3>
    <div class="min-vh-50">
      <div
        class="pb-0-75rem mb-0-75rem border border-2 border-blue border-top-0 border-start-0 border-end-0 text-center"
      >
        <img
          :src="getAvatarUrl"
          alt="Текущий аватар"
          class="w-32 mx-auto mb-1"
        />
        <div>
          <span class="fw-bold fs-5" title="Your login">{{ getUserName }}</span>
        </div>
      </div>
      <div class="text-center">
        <div class="mb-2 text-secondary">Your tasks:</div>

        <!-- Request Error -->
        <ErrorSingle
          :is-error="errorTrigger"
          :error-object="errorObject"
          :reload-trigger="triggerForReloadingErrors"
          class="mb-4"
        />

        <div class="d-flex flex-wrap justify-content-center gap-4">
          <div class="text-blue">
            <span class="me-1">active:</span
            ><span class="fw-bold">{{ taskCounter.active }}</span>
          </div>
          <div class="text-green">
            <span class="me-1">completed:</span
            ><span class="fw-bold">{{ taskCounter.completed }}</span>
          </div>
          <div class="text-secondary">
            <span class="me-1">total:</span
            ><span class="fw-bold">{{ taskCounter.total }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconUpdate from "../inc/IconUpdate.vue";
import ErrorSingle from "../inc/ErrorSingle.vue";

import { onMounted, ref } from "vue";
import { getAvatarUrl, getUserName } from "@/composables/storeAuth";
import { useRequest } from "@/composables/request";
import api from "@/api";

const {
  requestProcessing,
  triggerForReloadingErrors,
  errorTrigger,
  errorObject,
  setError,
  reloadErrors,
} = useRequest();

const taskCounter = ref({
  active: 0,
  completed: 0,
  total: 0,
});

function requestTaskCounter() {
  if (requestProcessing.value) return;
  requestProcessing.value = true;
  reloadErrors();
  api
    .taskCounter()
    .then((counter) => {
      taskCounter.value = counter;
    })
    .catch((err) => {
      setError(err);
    })
    .finally(() => {
      requestProcessing.value = false;
    });
}

onMounted(() => {
  requestTaskCounter();
});
</script>
