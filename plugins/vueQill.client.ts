import { defineNuxtPlugin } from "#app";

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import 'quill-paste-smart';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.component('QuillEditor', QuillEditor);
})