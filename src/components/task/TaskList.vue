<template>
  <div>
    <div
      class="ms-2 mb-1 float-end cursor-pointer link-blue"
      title="Update tasks"
    >
      <i class="fa fa-refresh fs-4" aria-hidden="true"></i>
    </div>

    <h2 class="text-center">Your task List</h2>

    <TaskFilter
      v-model:filter="taskFilter"
      v-model:order="taskOrder"
      v-model:limit-on-page="taskLimitOnPage"
    />

    <div
      v-if="filteredTasks.length"
      class="mt-0 row row-cols-1 row-cols-lg-2 gx-0-75rem gy-0-75rem"
    >
      Task List
    </div>
    <div
      v-else-if="taskList.length"
      class="mb-2 text-center fs-5 text-secondary"
    >
      No tasks satisfying the conditions were found
    </div>
    <div v-else class="mb-2 text-center fs-5 text-secondary">No tasks</div>
  </div>
</template>

<script setup>
import TaskFilter from "./TaskFilter.vue";

// import { useRequest } from "@/composables/request";
import { ref } from "vue";

const taskList = ref([]);
const filteredTasks = ref([]);

const taskFilter = ref("all");
const taskOrder = ref("new");
const taskLimitOnPage = ref(20);

// const {
//   requestProcessing,
//   triggerForReloadingErrors,
//   errorTrigger,
//   errorObject,
//   setError,
//   reloadErrors,
// } = useRequest();
</script>
