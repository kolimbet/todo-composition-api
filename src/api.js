import axios from "axios";
import { parseApiError } from "@/lib/errors.js";
import { BACKEND_DOMAIN } from "./config";

axios.defaults.baseURL = BACKEND_DOMAIN;
axios.defaults.headers.common["Accept"] = "application/json";

const sourceUrls = {
  login: "/api/login",
  logout: "/api/logout",
  user: "/api/user",
  register: "/api/register",
  nameIsFree: "/api/name-is-free",
  emailIsFree: "/api/email-is-free",
  checkUserPassword: "/api/user/check-password",
  updateUserPassword: "/api/user/update-password",
  userAvatar: "/api/user/avatar",
  images: "/api/images",
  tasks: "/api/tasks",
};

let token = localStorage.getItem("token") ?? null;

const api = {
  login: (auth) =>
    new Promise((resolve, reject) => {
      // console.log("api->login", auth);
      axios
        .post(sourceUrls.login, auth)
        .then(({ data }) => {
          if (!data.access_token) {
            reject("ERROR: auth token wasn't received");
          }
          if (!data.user) {
            reject("ERROR: user data wasn't received");
          }

          token = "Bearer " + data.access_token;
          localStorage.setItem("token", token);
          axios.defaults.headers.common["Authorization"] = token;
          resolve(data.user);
        })
        .catch((err) => {
          reject(parseApiError(err));
        });
    }),
  logout: () =>
    new Promise((resolve, reject) => {
      // console.log("api->logout");
      axios
        .get(sourceUrls.logout)
        .then(() => {
          // console.log("api->logout completed successfully");
          token = null;
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
          resolve(true);
        })
        .catch((err) => {
          reject(parseApiError(err));
        });
    }),
  checkAuth: () =>
    new Promise((resolve, reject) => {
      if (!token) {
        reject("no auth Token");
      }

      // console.log("token is:", token);
      axios.defaults.headers.common["Authorization"] = token;

      axios
        .get(sourceUrls.user)
        .then(({ data }) => {
          // console.log("api->checkAuth", data);
          resolve(data);
        })
        .catch((err) => {
          token = null;
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
          reject("ERROR: " + parseApiError(err));
        });
    }),
  register: (regData) =>
    new Promise((resolve, reject) => {
      axios
        .post(sourceUrls.register, regData)
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject("ERROR: " + parseApiError(err));
        });
    }),
  nameIsFree: (name) =>
    new Promise((resolve, reject) => {
      axios
        .post(sourceUrls.nameIsFree, { name })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(parseApiError(err));
        });
    }),
  emailIsFree: (email) =>
    new Promise((resolve, reject) => {
      axios
        .post(sourceUrls.emailIsFree, { email })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(parseApiError(err));
        });
    }),
  checkUserPassword: (password) =>
    new Promise((resolve, reject) => {
      axios
        .post(sourceUrls.checkUserPassword, { password: password })
        .then(({ data }) => {
          // console.log("api->checkPassword completed successfully", data);
          resolve(data);
        })
        .catch((err) => {
          // console.log("ERROR: checkPassword request error - ", err);
          reject(parseApiError(err));
        });
    }),
  updateUserPassword: (form) =>
    new Promise((resolve, reject) => {
      axios
        .post(sourceUrls.updateUserPassword, form)
        .then(({ data }) => {
          // console.log("api->updateUserPassword completed successfully", data);
          resolve(data);
        })
        .catch((err) => {
          // console.log("ERROR: updateUserPassword request error - ", err);
          reject(parseApiError(err));
        });
    }),
  /* ------------------------ Avatar ------------------------ */
  setUserAvatar: (imageId) =>
    new Promise((resolve, reject) => {
      // reject("api->setUserAvatar test stopper");
      axios
        .post(sourceUrls.userAvatar, { id: imageId })
        .then(({ data }) => {
          // console.log("api->setUserAvatar completed successfully", data);
          resolve(data);
        })
        .catch((err) => {
          let message = parseApiError(err);
          // console.log("ERROR: setUserAvatar request error - " + message);
          reject(message);
        });
    }),
  deleteUserAvatar: () =>
    new Promise((resolve, reject) => {
      // reject("api->deleteUserAvatar test stopper");
      axios
        .delete(sourceUrls.userAvatar)
        .then(({ data }) => {
          // console.log("api->deleteUserAvatar completed successfully", data);
          resolve(data);
        })
        .catch((err) => {
          let message = parseApiError(err);
          // console.log("ERROR: deleteUserAvatar request error - " + message);
          reject(message);
        });
    }),
  /* ------------------------- Images ------------------------ */
  imageList: () =>
    new Promise((resolve, reject) => {
      // reject("api->imageList test stopper");
      axios
        .get(sourceUrls.images)
        .then(({ data }) => {
          // console.log("api->imageList completed successfully", data);
          resolve(data);
        })
        .catch((err) => {
          let message = parseApiError(err);
          // console.log("ERROR: imageList request error - " + message);
          reject(message);
        });
    }),
  imageStore: (image) =>
    new Promise((resolve, reject) => {
      // reject("api->imageStore test stopper");
      axios
        .post(sourceUrls.images, image, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(({ data }) => {
          // console.log("api->imageStore completed successfully", data);
          resolve(data);
        })
        .catch((err) => {
          let message = parseApiError(err);
          // console.log("ERROR: imageStore request error - " + message);
          reject(message);
        });
    }),
  imageDelete: (imageId) =>
    new Promise((resolve, reject) => {
      // reject("api->imageDelete test stopper");
      axios
        .delete(sourceUrls.images + `/${imageId}`)
        .then((/* { data } */) => {
          // console.log("api->imageDelete completed successfully", data);
          resolve(true);
        })
        .catch((err) => {
          let message = parseApiError(err);
          // console.log("ERROR: imageDelete request error - " + message);
          reject(message);
        });
    }),
  /* -------------------------- Tasks -------------------------------- */
  taskList: () =>
    new Promise((resolve, reject) => {
      axios
        .get(sourceUrls.tasks)
        .then(({ data }) => {
          // console.log("api->taskList completed successfuly" /*, data */);
          resolve(data);
        })
        .catch((err) => {
          let message = parseApiError(err);
          // console.log("ERROR: taskList request error - " + message);
          reject(message);
        });
    }),
  taskDelete: (id) =>
    new Promise((resolve, reject) => {
      axios
        .delete(sourceUrls.tasks + "/" + id)
        .then(() => {
          // console.log("api->taskDelete completed successfully");
          resolve(true);
        })
        .catch((err) => {
          let message = parseApiError(err);
          // console.log("ERROR: taskDelete request error - " + message);
          reject(message);
        });
    }),
  taskComplete: (id, status) =>
    new Promise((resolve, reject) => {
      axios
        .post(sourceUrls.tasks + `/${id}/completing`, {
          is_completed: status,
        })
        .then(({ data }) => {
          // console.log("api->taskComplete completed successfully");
          resolve(data);
        })
        .catch((err) => {
          let message = parseApiError(err);
          // console.log("ERROR: taskComplete request error - " + message);
          reject(message);
        });
    }),
  taskTitle: (id, title) =>
    new Promise((resolve, reject) => {
      axios
        .post(sourceUrls.tasks + `/${id}/updating-title`, { title: title })
        .then(({ data }) => {
          // console.log("api->taskTitle completed successfully");
          resolve(data);
        })
        .catch((err) => {
          let message = parseApiError(err);
          // console.log("ERROR: taskTitle request error - " + message);
          reject(message);
        });
    }),
  taskCreate: (newTask) =>
    new Promise((resolve, reject) => {
      axios
        .post(sourceUrls.tasks, newTask)
        .then(({ data }) => {
          // console.log("api->taskCreate completed successfully", data);
          resolve(data);
        })
        .catch((err) => {
          let message = parseApiError(err);
          // console.log("ERROR: taskCreate request error - " + message);
          reject(message);
        });
    }),
  taskCounter: () =>
    new Promise((resolve, reject) => {
      // setTimeout(() => {
      axios
        .get(sourceUrls.tasks + "/counter")
        .then(({ data }) => {
          // console.log("api->taskCounter completed successfuly", data);
          resolve(data);
        })
        .catch((err) => {
          let message = parseApiError(err);
          // console.log("ERROR: taskCounter request error - " + message);
          reject(message);
        });
      // }, 1000);
    }),
};

export default api;
