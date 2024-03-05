<template>
  <div class="clearfix mb-3">
    <div class="float-start d-flex gap-0-75rem">
      <div>
        <label for="filter-order" class="fs-sm text-secondary">Order:</label>
        <select
          v-model="order"
          id="filter-order"
          class="form-select form-select-sm"
        >
          <option v-for="oValue in orderValues" :key="oValue" :value="oValue">
            {{ orderText[oValue] }}
          </option>
        </select>
      </div>
      <div>
        <label for="filter-filter" class="fs-sm text-secondary">Filter:</label>
        <select
          v-model="filter"
          id="filter-filter"
          class="form-select form-select-sm"
        >
          <option v-for="fValue in filterValues" :key="fValue" :value="fValue">
            {{ filterText[fValue] }}
          </option>
        </select>
      </div>
    </div>
    <div class="float-end">
      <label for="filter-limitOnPage" class="fs-sm text-secondary"
        >On page:</label
      >
      <select
        v-model="limitOnPage"
        id="filter-limitOnPage"
        class="form-select form-select-sm"
      >
        <option
          v-for="lValue in limitOnPageValues"
          :key="lValue"
          :value="lValue"
        >
          {{ lValue }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { defineModel, onMounted, watch } from "vue";

const filter = defineModel("filter");
const order = defineModel("order");
const limitOnPage = defineModel("limitOnPage");

const filterValues = ["all", "active", "completed"];
const filterText = {
  all: "All",
  active: "Active",
  completed: "Completed",
};
const orderValues = ["new", "old"];
const orderText = {
  new: "First new",
  old: "First old",
};
const limitOnPageValues = [10, 20, 30, 40, 50];

function initFilters() {
  const fValue = localStorage.getItem("taskFilter");
  filter.value = fValue && filterValues.includes(fValue) ? fValue : "all";

  const oValue = localStorage.getItem("taskOrder");
  order.value = oValue && orderValues.includes(oValue) ? oValue : "new";

  const lValue = +localStorage.getItem("taskLimitOnPage");
  limitOnPage.value =
    lValue && limitOnPageValues.includes(lValue) ? lValue : 20;
}

onMounted(() => {
  initFilters();
});

watch(filter, (newValue, oldValue) => {
  if (filterValues.includes(newValue)) {
    localStorage.setItem("taskFilter", newValue);
  } else filter.value = oldValue ?? "all";
});

watch(order, (newValue, oldValue) => {
  if (orderValues.includes(newValue)) {
    localStorage.setItem("taskOrder", newValue);
  } else order.value = oldValue ?? "new";
});

watch(limitOnPage, (newValue, oldValue) => {
  if (limitOnPageValues.includes(newValue)) {
    localStorage.setItem("taskLimitOnPage", newValue);
  } else limitOnPage.value = oldValue ?? 20;
});
</script>
