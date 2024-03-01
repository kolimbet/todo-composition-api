<template>
  <div ref="refImageBlock" class="position-relative">
    <!-- Request Error -->
    <ErrorSingle
      :is-error="errorTrigger"
      :error-object="errorObject"
      :reload-trigger="triggerForReloadingErrors"
      class="position-absolute z-2 top-n8"
      :class="[
        errorLeftPositionClass,
        errorRightPositionClass,
        errorWidthClass,
      ]"
    />

    <div
      @click="clickImage()"
      class="mx-auto w-32 h-32 box-content d-flex justify-content-center align-items-center border p-px"
      :class="[borderColorClass, bgColorClass]"
    >
      <img :src="image.full_url" class="mh-32 mw-32" />
    </div>

    <Transition name="folding-y-50">
      <div
        v-if="isClicked"
        class="border-top border-transparent position-absolute bottom-n3 start-0 end-0"
      >
        <button
          @click="deleteImage()"
          class="py-0 px-1 mx-auto d-flex justify-content-center align-items-center rounded-md border border-secondary border-red-hover border-opacity-75 bg-secondary bg-red-hover rounded-2 fs-sm text-white cursor-pointer"
        >
          <i class="fa fa-times-circle me-1" aria-hidden="true"></i>
          {{ requestProcessing ? "Wait" : "Delete" }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import ErrorSingle from "../inc/ErrorSingle.vue";

import { useDoubleClick } from "@/composables/doubleClick";
import { useRequest } from "@/composables/request";
import {
  defineProps,
  defineEmits,
  ref,
  watch,
  computed,
  onMounted,
  onBeforeUnmount,
} from "vue";
import {
  getAvatarId,
  actionSetAvatar,
  actionDeleteAvatar,
} from "@/composables/storeAuth";
import api from "@/api";

const props = defineProps({
  image: Object,
  clickTrigger: Number,
});

const emit = defineEmits(["setClickTrigger", "delete"]);

const refImageBlock = ref(null);

const isClicked = ref(false);
const blockPosition = ref(null);

const { dkSetActionList, dkAction } = useDoubleClick();
dkSetActionList([setAvatar]);

const {
  requestProcessing,
  triggerForReloadingErrors,
  errorTrigger,
  errorObject,
  setError,
  reloadErrors,
} = useRequest();

const isAvatar = computed(() => getAvatarId.value === props.image.id);

const leftLimitation = computed(() =>
  blockPosition.value ? blockPosition.value.left < 80 : true
);
const rigthLimitation = computed(() =>
  blockPosition.value
    ? window.innerWidth - blockPosition.value.right < 80
    : true
);

const errorLeftPositionClass = computed(() =>
  leftLimitation.value ? "start-n2" : "start-n20"
);
const errorRightPositionClass = computed(() =>
  rigthLimitation.value ? "end-n2" : "end-n20"
);
const errorWidthClass = computed(() => {
  if (!leftLimitation.value && !rigthLimitation.value) return "w-72";
  else if (leftLimitation.value && rigthLimitation.value) return "w-36";
  else return "w-56";
});

const borderColorClass = computed(() =>
  isAvatar.value
    ? isClicked.value
      ? "bg-blue-300 bg-blue-400-hover"
      : "bg-blue-200 bg-blue-300-hover"
    : isClicked.value
    ? "bg-blue-light bg-blue-200-hover"
    : "bg-transparent bg-blue-light-hover"
);

const bgColorClass = computed(() =>
  isAvatar.value
    ? isClicked.value
      ? "border-blue-300 border-blue-500-hover"
      : "border-blue-200 border-blue-400-hover"
    : isClicked.value
    ? "border-blue-light border-blue-300-hover"
    : "border-transparent border-blue-200-hover"
);

function clickImage() {
  emit("setClickTrigger");
  if (!isAvatar.value) dkAction(setAvatar);
}

function setAvatar() {
  if (requestProcessing.value) return;
  requestProcessing.value = true;
  reloadErrors();

  actionSetAvatar(props.image.id)
    .catch((err) => {
      setError(err);
    })
    .finally(() => {
      requestProcessing.value = false;
    });
}

function deleteImage() {
  if (requestProcessing.value) return;
  requestProcessing.value = true;
  reloadErrors();

  requestToDeleteImage()
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

function requestToDeleteImage() {
  return new Promise((resolve, reject) => {
    if (isAvatar.value) {
      actionDeleteAvatar()
        .then(() => {
          api
            .imageDelete(props.image.id)
            .then(() => {
              resolve(true);
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      api
        .imageDelete(props.image.id)
        .then(() => resolve(true))
        .catch((err) => {
          reject(err);
        });
    }
  });
}

function setBlockPosition() {
  if (errorTrigger.value)
    blockPosition.value = refImageBlock.value.getBoundingClientRect();
}

watch(
  () => props.clickTrigger,
  (clikedId) => {
    if (clikedId === props.image.id) isClicked.value = true;
    else {
      isClicked.value = false;
      reloadErrors();
    }
  }
);

watch(errorTrigger, (newValue) => {
  if (newValue) setBlockPosition();
});

onMounted(() => {
  window.addEventListener("resize", setBlockPosition);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", setBlockPosition);
});
</script>
