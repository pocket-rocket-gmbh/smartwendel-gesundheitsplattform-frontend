import { defineNuxtPlugin } from "#app";
import SnackbarVue from "~/components/Snackbar.vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("ClientSnackbar", SnackbarVue);
});
