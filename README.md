# Frontend to ToDo SPA

To Do list SPA on VueJS 3 with Composition API

> Frontend for https://github.com/kolimbet/todo-spa-back

The application requires authorization. You can register a new user or use a pre-installed profile (login: admin@mail.ru ; password: 123456) who has 100 tasks created by default. All forms in the application use validation with Vuelidate.

Pagination and filters are used to display the task list. The following actions are available with tasks: adding new ones, deleting, completing, changing the task description. Most of the actions in the application are performed by double-clicking.

The user's home page with three tabs is also available:

- Home with task counter (active | completed | total)
- User Avatar with the ability to install an avatar from the list of images uploaded by the user. Here you can also download new images and delete already downloaded ones
- Change password where you can change the current user password

## Installation

Clone this repository to your server:

```
git clone https://github.com/kolimbet/todo-composition-api.git todo-app.front
```

Install the necessary NPM packages:

```
npm install
```

Create a configuration file /src/config.js and specify create a BACKEND_DOMAIN constant in it, in which specify the server URL:

```
export const BACKEND_DOMAIN = "http://todo-app.back";
```

I also use Live Sass Compiler. CSS files compiled by this plugin are imported into the project. The sources are in the /src/scss folder.

Compile the project:

```
npm run dev
```
