<template>
  <div>
    <h3 class="text-center">Change password</h3>
    <div class="d-flex justify-content-center align-items-center min-vh-50">
      <div class="w-percent-100 mw-md">
        <template v-if="changePasswordIsCompleted">
          <div
            class="px-3 py-2 mx-auto mt-4 rounded-2 border border-green border-opacity-50 bg-green-light text-green-dark"
          >
            <div class="mb-4 text-center">
              Password change completed successfully.
            </div>

            <div class="text-center">
              <button
                @click="
                  router.push({
                    name: 'account_section',
                    params: { section: 'home' },
                  })
                "
                title="Go to the registration page"
                class="btn btn-green text-white w-24"
              >
                Ok
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <!-- Request Error -->
          <ErrorSingle
            :is-error="errorTrigger"
            :error-object="errorObject"
            :reload-trigger="triggerForReloadingErrors"
            class="mb-4"
          />

          <div class="mb-4">
            <label for="form-password" class="fs-sm text-secondary"
              >Password</label
            >
            <input
              v-model="form.password"
              id="form-password"
              type="password"
              class="form-control"
              placeholder="Password"
            />

            <ErrorList
              :error-list="v$.form.password.$errors"
              :reload-trigger="triggerForReloadingErrors"
            />
          </div>

          <div class="mb-4">
            <label for="form-new-password" class="fs-sm text-secondary"
              >New password</label
            >
            <input
              v-model="form.new_password"
              id="form-new-password"
              type="password"
              class="form-control"
              placeholder="New password"
            />

            <ErrorList
              :error-list="v$.form.new_password.$errors"
              :reload-trigger="triggerForReloadingErrors"
            />
          </div>

          <div class="mb-4">
            <label for="form-new-password-repeat" class="fs-sm text-secondary"
              >Repeat new password</label
            >
            <input
              v-model="form.new_password_repeat"
              id="form-new-password-repeat"
              type="password"
              class="form-control"
              placeholder="Repeat new password"
            />

            <ErrorList
              :error-list="v$.form.new_password_repeat.$errors"
              :reload-trigger="triggerForReloadingErrors"
            />
          </div>

          <div class="mb-4">
            <button
              @click="changePassword()"
              type="button"
              class="btn btn-blue w-percent-100 position-relative"
            >
              <span
                class="d-flex align-items-center text-light opacity-50 position-absolute top-0 bottom-0 start-0 ps-2"
              >
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              {{ requestProcessing ? "Please wait" : "Update" }}
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useRequest } from "@/composables/request";
import useVuelidate from "@vuelidate/core";
import {
  required,
  minLength,
  maxLength,
  sameAs,
  helpers,
} from "@vuelidate/validators";
import { validatingCurrentPassword, notSameAs } from "@/validators";
import api from "@/api";
import ErrorSingle from "../inc/ErrorSingle.vue";
import ErrorList from "../inc/ErrorList.vue";

const form = ref({
  password: "",
  new_password: "",
  new_password_repeat: "",
});
const changePasswordIsCompleted = ref(false);

const {
  requestProcessing,
  triggerForReloadingErrors,
  errorTrigger,
  errorObject,
  setError,
  reloadErrors,
} = useRequest();

const router = useRouter();

const changePasswordRules = computed(() => ({
  form: {
    password: {
      checkCurrentPassword: helpers.withMessage(
        ({ $response }) => $response?.message || "Invalid Data",
        helpers.withAsync(validatingCurrentPassword)
      ),
    },
    new_password: {
      required,
      minLength: minLength(6),
      maxLength: maxLength(25),
      notCurrentPass: helpers.withMessage(
        () => "The new password must be different from the current one",
        notSameAs(form.value.password)
      ),
    },
    new_password_repeat: {
      required,
      sameAsPassword: helpers.withMessage(
        () => "The value must be equal to the New_password",
        sameAs(form.value.new_password)
      ),
    },
  },
}));
const v$ = useVuelidate(
  changePasswordRules,
  { form },
  {
    $lazy: true,
  }
);

function changePassword() {
  if (requestProcessing.value) return;
  requestProcessing.value = true;
  reloadErrors();

  v$.value.$validate().then(() => {
    // console.log(v$.value);
    if (v$.value.$invalid) {
      requestProcessing.value = false;
    } else {
      api
        .updateUserPassword(form.value)
        .then(() => {
          changePasswordIsCompleted.value = true;
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
</script>
