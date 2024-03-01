<template>
  <Transition name="folding-y-300">
    <div
      v-if="props.isOpen"
      class="py-0-75rem mb-0-75rem border border-2 border-start-0 border-end-0 border-green"
    >
      <!-- Request Error -->
      <ErrorSingle
        :is-error="errorTrigger"
        :error-object="errorObject"
        :reload-trigger="triggerForReloadingErrors"
        class="mb-2"
      />

      <div class="mb-2">
        <label for="form-image" class="d-block fs-sm text-secondary"
          >Image</label
        >
        <input
          @change="previewImage()"
          id="form-image"
          ref="refImageInput"
          type="file"
          class="form-file-input"
        />

        <ErrorList
          :error-list="v$.form.image.$errors"
          :reload-trigger="triggerForReloadingErrors"
        />
      </div>

      <div class="text-center">
        <button
          @click="storeImage()"
          type="button"
          class="btn lh-1 btn-green px-3 py-2"
        >
          <i class="fa fa-floppy-o me-2" aria-hidden="true"></i>
          <span>{{ requestProcessing ? "Please wait" : "Store image" }}</span>
        </button>
      </div>
    </div>
  </Transition>
  <div></div>
</template>

<script setup>
import ErrorSingle from "../inc/ErrorSingle.vue";
import ErrorList from "../inc/ErrorList.vue";

import { defineProps, defineEmits, ref, computed, watch, nextTick } from "vue";
import { validateImageToAvatar } from "@/validators";
import { helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import api from "@/api";
import { useRequest } from "@/composables/request";

const props = defineProps({
  isOpen: Boolean,
});
const emit = defineEmits(["close", "addImage"]);

const refImageInput = ref(null);

const form = ref({ image: "" });
const requestToClearForm = ref(false);

const {
  requestProcessing,
  triggerForReloadingErrors,
  errorTrigger,
  errorObject,
  setError,
  reloadErrors,
} = useRequest();

const imageAddRules = computed(() => ({
  form: {
    image: {
      checkImage: helpers.withMessage(
        ({ $response }) => $response?.message || "Invalid Data",
        validateImageToAvatar
      ),
    },
  },
}));
const v$ = useVuelidate(
  imageAddRules,
  { form },
  {
    $lazy: true,
  }
);

function previewImage() {
  form.value.image = refImageInput.value.files[0];
}

function storeImage() {
  if (requestProcessing.value) return;
  requestProcessing.value = true;
  reloadErrors();

  v$.value.$validate().then(() => {
    // console.log(v$.value);
    if (v$.value.$invalid) {
      requestProcessing.value = false;
    } else {
      let formData = new FormData();
      formData.append("image", form.value.image);
      formData.append("image_name", form.value.image.name);

      api
        .imageStore(formData)
        .then((newImage) => {
          emit("addImage", newImage);
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
  reloadErrors();
  form.value.image = "";
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
      nextTick(() => {
        refImageInput.value.focus();
      });
  }
);

watch(requestProcessing, (newValue) => {
  if (newValue === false && requestToClearForm.value) {
    clearForm();
    requestToClearForm.value = false;
  }
});
</script>
