import { ref } from "vue";

export function useDoubleClick() {
  const dkActionList = ref([]);
  const dkLastClick = ref({});
  const dkMaxInterval = ref(1000);

  const dkSetMaxInterval = (interval) => {
    if (+interval > 100) dkMaxInterval.value = +interval;
    else
      console.log("Error setting useDoubleClick->dkMaxInterval: " + interval);
  };

  const dkSetActionList = (list) => {
    if (list instanceof Array && list.length) {
      dkActionList.value = list;
      dkLastClick.value = {};
      list.forEach((action) => {
        dkLastClick[action] = null;
      });
    } else
      console.log(
        "Error setting useDoubleClick->dkActionList. Action list must be Array"
      );
  };

  const dkAction = (action) => {
    if (!dkActionList.value.includes(action)) {
      console.log(`doubleClickAction: unknown action '${action}'`);
      return;
    }

    const clickTime = new Date();

    if (
      dkLastClick.value[action] &&
      clickTime - dkLastClick.value[action] < dkMaxInterval.value
    ) {
      dkLastClick.value[action] = null;
      action();
    } else {
      dkLastClick.value[action] = clickTime;
    }
  };

  return { dkSetMaxInterval, dkSetActionList, dkAction };
}
