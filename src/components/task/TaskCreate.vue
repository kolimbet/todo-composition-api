<template>
  <Transition name="folding-y-300">
    <div
      v-if="props.isOpen"
      class="mb-0-75rem py-2 border border-start-0 border-end-0 border-2 border-green"
    >
      <!-- Request Error -->
      <ErrorSingle
        :is-error="errorTrigger"
        :error-object="errorObject"
        :reload-trigger="triggerForReloadingErrors"
        class="mb-2"
      />

      <div class="mb-2">
        <label for="add-form-title" class="fs-sm text-secondary">Email</label>
        <textarea
          v-model.trim="form.title"
          id="add-form-title"
          rows="3"
          name="title"
          class="form-control"
        ></textarea>

        <ErrorList
          :error-list="v$.form.title.$errors"
          :reload-trigger="triggerForReloadingErrors"
        />
      </div>

      <div class="d-flex justify-content-between align-items-center">
        <!-- is_completed -->
        <div class="form-check">
          <input
            v-model="form.is_completed"
            id="add-form-is-completed"
            type="checkbox"
            class="form-check-input"
            title="is completed"
          />
          <label for="add-form-is-completed" class="form-check-label"
            >is completed</label
          >
        </div>
        <!-- Submit button -->
        <ButtonPill
          @click="addTask()"
          :text="'Add'"
          :title="'Add Task'"
          class="btn-green"
        >
          <i class="fa fa-floppy-o me-2" aria-hidden="true"></i>
        </ButtonPill>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import ButtonPill from "../inc/ButtonPill.vue";
import ErrorSingle from "../inc/ErrorSingle.vue";
import ErrorList from "../inc/ErrorList.vue";

import { ref, defineEmits, defineProps, watch, computed } from "vue";
import { useRequest } from "@/composables/request";
import api from "@/api";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["close", "add"]);

const form = ref({
  title: "",
  is_completed: false,
});
const requestToClearForm = ref(false);
const animationTransition = 500;

const {
  requestProcessing,
  triggerForReloadingErrors,
  errorTrigger,
  errorObject,
  setError,
  reloadErrors,
} = useRequest();

const taskRules = computed(() => ({
  form: {
    title: { required, minLength: minLength(3), maxLength: maxLength(255) },
    is_completed: { required },
  },
}));

const v$ = useVuelidate(
  taskRules,
  { form },
  {
    $lazy: true,
  }
);

function addTask() {
  if (requestProcessing.value) return;
  requestProcessing.value = true;
  reloadErrors();

  v$.value.$validate().then(() => {
    if (v$.value.$invalid) {
      requestProcessing.value = false;
    } else {
      api
        .taskCreate(form.value)
        .then((newTask) => {
          emit("add", newTask);
          emit("close");
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          requestProcessing.value = false;
        });
    }
  });
}

function clearForm() {
  form.value.title = "";
  form.value.is_completed = false;
  reloadErrors();
  v$.value.$reset();
}
function attemptToClearForm() {
  if (requestProcessing.value) requestToClearForm.value = true;
  else clearForm();
}

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue === false) attemptToClearForm();
    else
      setTimeout(() => {
        document.querySelector("#add-form-title").focus();
      }, animationTransition);
  }
);

watch(requestProcessing, (newValue) => {
  if (newValue === false && requestToClearForm.value) {
    clearForm();
    requestToClearForm.value = false;
  }
});
</script>
