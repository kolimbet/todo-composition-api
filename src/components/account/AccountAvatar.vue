<template>
  <div>
    <h3 class="text-center">User avatar</h3>
    <div class="min-vh-50">
      <div
        class="pb-0-75rem mb-0-75rem border border-2 border-blue border-top-0 border-start-0 border-end-0 text-center"
      >
        <img
          :src="getAvatarUrl"
          alt="Current avatar"
          class="w-32 mx-auto mb-1"
        />
        <div class="text-center">
          <template v-if="getAvatarId">
            <button
              @click="deleteAvatar()"
              type="submit"
              class="w-32 p-px mt-px mx-auto d-flex justify-content-center align-items-center rounded-md border border-secondary border-red-hover border-opacity-75 bg-secondary bg-red-hover rounded-2 text-white cursor-pointer"
            >
              <i class="fa fa-times-circle me-1" aria-hidden="true"></i>
              {{ requestProcessing ? "Wait..." : "Delete" }}
            </button>
          </template>
          <template v-else>
            <span
              >The avatar is not installed.<br />
              Double-click on any of the uploaded images to select it.</span
            >
          </template>
        </div>
      </div>

      <div class="mb-2 clearfix">
        <IconUpdate @click="requestImages()" class="float-start p-1 me-2" />

        <div class="float-end">
          <Transition name="fade" mode="out-in">
            <ButtonPill
              v-if="addFormIsOpen"
              @click="toggleAddForm()"
              :text="'Close'"
              :title="'Close the add form'"
              class="btn-red"
            >
              <i class="fa fa-times-circle me-1" aria-hidden="true"></i>
            </ButtonPill>
            <ButtonPill
              v-else
              @click="toggleAddForm()"
              :text="'Add'"
              :title="'Open the add form'"
              class="btn-green"
            >
              <i class="fa fa-plus-circle me-1" aria-hidden="true"></i>
            </ButtonPill>
          </Transition>
        </div>
      </div>

      <ImageAdd
        :is-open="addFormIsOpen"
        @close="closeAddForm()"
        @add-image="addImageToList($event)"
      />

      <!-- Request Error -->
      <ErrorSingle
        :is-error="errorTrigger"
        :error-object="errorObject"
        :reload-trigger="triggerForReloadingErrors"
        class="mb-4"
      />

      <template v-if="imageList.length">
        <div class="d-flex flex-wrap gap-0-75rem justify-content-center">
          <TransitionGroup name="list-folding-y-150">
            <ImageItem
              v-for="image in imageList"
              :key="image.id"
              :image="image"
              :clickTrigger="clickImageTrigger"
              @set-click-trigger="setClickImageTrigger(image.id)"
              @delete="deleteImageFromList(image.id)"
            />
          </TransitionGroup>
        </div>
      </template>
      <template v-else>
        <div class="mb-2 text-center">
          Images not found. Click on the Add button to open the upload form.
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import ErrorSingle from "../inc/ErrorSingle.vue";
import IconUpdate from "../inc/IconUpdate.vue";
import ImageAdd from "../image/ImageAdd.vue";
import ButtonPill from "../inc/ButtonPill.vue";
import ImageItem from "../image/ImageItem.vue";

import {
  getAvatarId,
  getAvatarUrl,
  actionDeleteAvatar,
} from "@/composables/storeAuth";
import { useRequest } from "@/composables/request";
import { onMounted, ref } from "vue";
import api from "@/api";

const imageList = ref([]);
const addFormIsOpen = ref(false);
const clickImageTrigger = ref(0);

const {
  requestProcessing,
  triggerForReloadingErrors,
  errorTrigger,
  errorObject,
  setError,
  reloadErrors,
} = useRequest();

function requestImages() {
  if (requestProcessing.value) return;
  requestProcessing.value = true;
  reloadErrors();

  api
    .imageList()
    .then((images) => {
      imageList.value = images;
    })
    .catch((err) => {
      setError(err);
    })
    .finally(() => {
      requestProcessing.value = false;
    });
}

onMounted(() => {
  requestImages();
});

function deleteImageFromList(imageId) {
  imageList.value.splice(
    imageList.value.findIndex((img) => img.id === imageId),
    1
  );
}

function addImageToList(newImage) {
  imageList.value.push(newImage);
}

function setClickImageTrigger(imageId) {
  clickImageTrigger.value = imageId;
}

function toggleAddForm() {
  addFormIsOpen.value = !addFormIsOpen.value;
}

function closeAddForm() {
  addFormIsOpen.value = false;
}

function deleteAvatar() {
  if (requestProcessing.value) return;
  requestProcessing.value = true;
  reloadErrors();

  actionDeleteAvatar()
    .catch((err) => {
      setError(err);
    })
    .finally(() => {
      requestProcessing.value = false;
    });
}
</script>
