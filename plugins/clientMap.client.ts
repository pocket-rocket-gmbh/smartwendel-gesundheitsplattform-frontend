import { defineNuxtPlugin } from "#app";

import MapWidgetVue from "~/components/MapWidget.vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("ClientMap", MapWidgetVue);
});
