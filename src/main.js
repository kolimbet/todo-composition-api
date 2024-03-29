import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "@/css/bs5-custom.css";
import "bootstrap";
import "@/css/app.css";

const app = createApp(App);
app.use(router);
window.vm = app.mount("#app");
