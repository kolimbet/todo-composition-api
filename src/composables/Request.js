import { ref } from "vue";

export function useRequest() {
  const requestProcessing = ref(false);
  const triggerForReloadingErrors = ref(false);
  const errorTrigger = ref(false);
  const errorObject = ref({
    $message: "",
  });

  const reloadingMessages = () => {
    triggerForReloadingErrors.value = !triggerForReloadingErrors.value;
  };

  const reloadErrors = () => {
    reloadingMessages();
    errorTrigger.value = false;
  };

  return {
    requestProcessing,
    triggerForReloadingErrors,
    errorTrigger,
    errorObject,
    reloadErrors,
  };
}
