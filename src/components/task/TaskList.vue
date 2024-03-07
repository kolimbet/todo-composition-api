<template>
  <div class="">
    <h2 class="text-center">Your task List</h2>

    <TaskFilter
      v-model:filter="taskFilter"
      v-model:order="taskOrder"
      v-model:limit-on-page="taskLimitOnPage"
    />

    <div class="mb-0-75rem d-flex justify-content-between align-items-center">
      <IconUpdate @click="requestTaskList()" class="ms-0-75rem me-0-75rem" />

      <Transition name="fade" mode="out-in">
        <ButtonPill
          v-if="addFormIsOpen"
          @click="toggleAddForm()"
          :text="'Close'"
          :title="'Close Add form'"
          class="btn-red"
          ><i class="fa fa-times-circle me-1" aria-hidden="true"></i
        ></ButtonPill>
        <ButtonPill
          v-else
          @click="toggleAddForm()"
          :text="'Add'"
          :title="'Open Add form'"
          class="btn-green"
          ><i class="fa fa-plus-circle me-1" aria-hidden="true"></i
        ></ButtonPill>
      </Transition>
    </div>

    <TaskCreate
      :is-open="addFormIsOpen"
      @close="closeAddForm()"
      @add="addTaskToList($event)"
    />

    <ErrorSingle
      :is-error="errorTrigger"
      :error-object="errorObject"
      :reload-trigger="triggerForReloadingErrors"
      class="mb-4"
    />

    <div v-if="sortedTasks.length" class="mt-0">
      <div
        class="mb-0-75rem row row-cols-1 row-cols-lg-2 gx-0-75rem gy-0-75rem"
      >
        <TransitionGroup name="list-folding-y-100">
          <TaskItem
            v-for="task in paginatedTasks"
            :key="task.id"
            :task="task"
            @delete="deleteTaskFromList(task.id)"
            @update="updateTask(task.id, $event)"
          />
        </TransitionGroup>
      </div>

      <PaginationLine
        :page="page"
        :totalPages="totalPages"
        :links="paginationLinks"
        :url="route.path"
        class="text-center"
      />
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
import IconUpdate from "../inc/IconUpdate.vue";
import ErrorSingle from "../inc/ErrorSingle.vue";
import PaginationLine from "../inc/PaginationLine.vue";
import TaskItem from "./TaskItem.vue";
import TaskCreate from "./TaskCreate.vue";
import ButtonPill from "../inc/ButtonPill.vue";

import api from "@/api";
import { useRequest } from "@/composables/request";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const initiated = ref(false);
const taskList = ref([]);

const taskFilter = ref("all");
const taskOrder = ref("new");
const taskLimitOnPage = ref(20);

const page = ref(1);

const addFormIsOpen = ref(false);

const router = useRouter();
const route = useRoute();

const {
  requestProcessing,
  triggerForReloadingErrors,
  errorTrigger,
  errorObject,
  setError,
  reloadErrors,
} = useRequest();

const filteredTasks = computed(() => {
  switch (taskFilter.value) {
    case "active":
      return taskList.value.filter((task) => task.is_completed == false);
    case "completed":
      return taskList.value.filter((task) => task.is_completed == true);
    default:
      return taskList.value;
  }
});

const sortedTasks = computed(() => {
  const tasks = filteredTasks.value.slice();
  if (taskOrder.value === "old")
    return tasks.sort((a, b) => {
      if (a.is_completed > b.is_completed) return 1;
      if (a.is_completed < b.is_completed) return -1;
      if (a.is_completed) {
        if (a.end_date > b.end_date) return 1;
        if (a.end_date < b.end_date) return -1;
        return 0;
      } else {
        if (a.id > b.id) return 1;
        return -1;
      }
    });
  else
    return tasks.sort((a, b) => {
      if (a.is_completed > b.is_completed) return 1;
      if (a.is_completed < b.is_completed) return -1;
      if (a.is_completed) {
        if (a.end_date > b.end_date) return -1;
        if (a.end_date < b.end_date) return 1;
        return 0;
      } else {
        if (a.id > b.id) return -1;
        return 1;
      }
    });
});

const paginatedTasks = computed(() => {
  const start = (page.value - 1) * taskLimitOnPage.value;
  const end = page.value * taskLimitOnPage.value;
  return sortedTasks.value.slice(start, end);
});

const totalPages = computed(() =>
  sortedTasks.value.length
    ? Math.ceil(sortedTasks.value.length / taskLimitOnPage.value)
    : 1
);

const paginationLinks = computed(() => ({
  first: "?page=1",
  prev: "?page=" + (page.value - 1),
  next: "?page=" + (page.value + 1),
  last: "?page=" + totalPages.value,
}));

function requestTaskList() {
  if (requestProcessing.value) return;
  requestProcessing.value = true;
  reloadErrors();

  return api
    .taskList()
    .then((tasks) => {
      // commit("setTaskList", tasks);
      taskList.value = tasks;
    })
    .catch((err) => {
      taskList.value = [];
      setError(err);
    })
    .finally(() => {
      requestProcessing.value = false;
    });
}

function deleteTaskFromList(taskId) {
  taskList.value.splice(
    taskList.value.findIndex((task) => task.id === taskId),
    1
  );
}

function updateTask(taskId, changedTask) {
  taskList.value.splice(
    taskList.value.findIndex((task) => task.id === taskId),
    1,
    changedTask
  );
}

function addTaskToList(newTask) {
  taskList.value.push(newTask);
}

function toggleAddForm() {
  addFormIsOpen.value = !addFormIsOpen.value;
}
function closeAddForm() {
  addFormIsOpen.value = false;
}

function setPage() {
  let newPage = route.query.page ? +route.query.page : 1;
  // console.log("setPage: " + newPage);
  if (newPage > totalPages.value && initiated.value) router.push(route.path);
  else page.value = newPage;
}

watch(
  () => route.query.page,
  () => setPage()
);

watch(totalPages, (newValue) => {
  if (page.value > newValue) router.push(route.path);
});

onMounted(() => {
  setPage();
  requestTaskList().then(() => {
    initiated.value = true;
  });
});
</script>
