<template>
  <div class="col">
    <div
      class="h-percent-100 px-2 py-2 rounded rounded-2 border border border-1 d-flex align-items-center"
      :class="[cardBorderColorClass]"
    >
      <div class="w-percent-100">
        <!-- Request Error -->
        <ErrorSingle
          :is-error="errorTrigger"
          :error-object="errorObject"
          :reload-trigger="triggerForReloadingErrors"
          class="mb-2"
        />

        <div class="d-flex align-items-center gap-0-75rem">
          <div
            @click="dkAction(completing)"
            class="h-8 w-7 cursor-pointer"
            :class="[completeButtonColorClass]"
            :title="announceOfCompletion"
          >
            <i class="fa fa-check-circle-o fa-2x"></i>
          </div>

          <Transition name="folding-y-100" mode="out-in">
            <div v-if="editingTitleTrigger" class="flex-grow-1">
              <textarea
                ref="refEditingTitle"
                v-model.trim="form.title"
                @keydown.enter="editingTitleEnd()"
                @keydown.esc="editingTitleCancel()"
                rows="3"
                class="form-control w-percent-100 mb-2"
              ></textarea>

              <ErrorList
                :error-list="v$.form.title.$errors"
                :reload-trigger="triggerForReloadingErrors"
              />

              <div
                class="mt-2 d-flex justify-content-center align-items-center gap-0-75rem"
              >
                <ButtonPill
                  @click="editingTitleEnd()"
                  :text="'Save'"
                  :title="'Update Title'"
                  class="btn-green"
                >
                  <i class="fa fa-floppy-o me-2" aria-hidden="true"></i>
                </ButtonPill>
                <ButtonPill
                  @click="editingTitleCancel()"
                  :text="'Close'"
                  :title="'Close form'"
                  class="btn-red"
                >
                  <i class="fa fa-times-circle me-2" aria-hidden="true"></i>
                </ButtonPill>
              </div>
            </div>
            <div v-else @click="dkAction(editingTitle)" class="flex-grow-1">
              {{ props.task.title }}
              <template v-if="props.task.end_date">
                <br />end: {{ props.task.end_date }}
              </template>
            </div>
          </Transition>

          <div
            @click="dkAction(deleting)"
            class="w-5 text-secondary text-red-dark-hover cursor-pointer"
          >
            <i class="fa fa-trash-o fs-4 lh-1"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ErrorSingle from "../inc/ErrorSingle.vue";
import ErrorList from "../inc/ErrorList.vue";
import ButtonPill from "../inc/ButtonPill.vue";

import { computed, ref, defineProps, defineEmits } from "vue";
import { useDoubleClick } from "@/composables/doubleClick";
import { useRequest } from "@/composables/request";
import api from "@/api";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

const refEditingTitle = ref(null);

const props = defineProps({
  task: Object,
});

const emit = defineEmits(["delete", "update"]);

const form = ref({
  title: "",
});
const editingTitleTrigger = ref(false);
const editingTransition = 1000;

const { dkSetActionList, dkAction } = useDoubleClick();
dkSetActionList([deleting, completing, editingTitle]);

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
  },
}));

const v$ = useVuelidate(
  taskRules,
  { form },
  {
    $lazy: true,
  }
);

const cardBorderColorClass = computed(() =>
  props.task.is_completed ? "border-green" : "border-blue"
);
const completeButtonColorClass = computed(() =>
  props.task.is_completed
    ? "text-green text-green-dark-hover"
    : "text-blue text-blue-dark-hover"
);
const endTimeString = computed(() => {
  if (props.task.is_completed)
    return new Date(props.task.end_date).toLocaleString("ru", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  else return "";
});
const announceOfCompletion = computed(() =>
  props.task.is_completed
    ? "Completed (double click) " + endTimeString.value
    : "Complete the task (double click)"
);

function deleting() {
  if (requestProcessing.value) return;
  requestProcessing.value = true;
  reloadErrors();

  api
    .taskDelete(props.task.id)
    .then(() => {
      emit("delete");
    })
    .catch((err) => {
      setError(err);
    })
    .finally(() => {
      requestProcessing.value = false;
    });
}
function completing() {
  if (requestProcessing.value) return;
  requestProcessing.value = true;
  reloadErrors();

  api
    .taskComplete(props.task.id, !props.task.is_completed)
    .then((changedTask) => {
      emit("update", changedTask);
    })
    .catch((err) => {
      setError(err);
    })
    .finally(() => {
      requestProcessing.value = false;
    });
}
function editingTitle() {
  if (editingTitleTrigger.value) return;
  uploadDataToForm();
  reloadErrors();
  editingTitleTrigger.value = true;
  setTimeout(() => {
    refEditingTitle.value.focus();
  }, editingTransition);
}
function editingTitleEnd() {
  if (requestProcessing.value) return;

  if (props.task.title !== form.value.title) {
    requestProcessing.value = true;
    reloadErrors();

    v$.value.$validate().then(() => {
      // console.log(v$.value);
      if (v$.value.$invalid) {
        requestProcessing.value = false;
      } else {
        api
          .taskTitle(props.task.id, form.value.title)
          .then((changedTask) => {
            emit("update", changedTask);
            editingTitleTrigger.value = false;
          })
          .catch((err) => {
            setError(err);
          })
          .finally(() => {
            requestProcessing.value = false;
            v$.value.$reset();
          });
      }
    });
  } else {
    editingTitleTrigger.value = false;
  }
}
function editingTitleCancel() {
  reloadErrors();
  v$.value.$reset();
  editingTitleTrigger.value = false;
}
function uploadDataToForm() {
  form.value.title = props.task.title;
}
</script>
