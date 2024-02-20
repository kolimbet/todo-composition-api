import { computed } from "vue";
import { required, email } from "@vuelidate/validators";

export const loginRules = computed(() => ({
  form: {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
  },
}));
