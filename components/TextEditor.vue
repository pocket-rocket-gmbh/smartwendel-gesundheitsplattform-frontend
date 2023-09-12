<template>
  <ClientOnly>
    <QuillEditor
      v-model:content="text"
      ref="ql-editor"
      class="ql-blank"
      :style="{ height: height || '200px' }"
      :options="textOptions"
      :placeholder="textOptions.placeholder"
      contentType="html"
    />
  </ClientOnly>
</template>
<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  height?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const formats = ref([
  "background",
  "code",
  "italic",
  "size",
  "script",
  "header",
  "indent",
  "list",
  "align",
  "direction",
  //'link',
  //'strike',
  // 'underline',
  // 'blockquote',
  //'bold',
  //'color',
  //'font',
  //'code-block',
  //'formula'
  // 'image'
  // 'video'
]);

const textOptions = ref({
  debug: false,
  theme: "snow",
  contentType: "html",
  required: true,
  formats: formats,
  placeholder: "Text eingeben",
});

const text = computed({
  get() {
    return props.modelValue;
  },
  set(updatedValue) {
    emit("update:modelValue", updatedValue);
  },
});
</script>
<style lang="scss">
.ql-main-editor {
  .ql-editor p,
  .ql-editor ol,
  .ql-editor ul {
    font-size: 16px;
  }
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "Überschrift 1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "Überschrift 2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "Überschrift 3";
}

.v-tooltip > .v-overlay__content {
  font-size: 20px !important;
}

.ql-clean {
  display: none !important;
}

.ql-snow .ql-tooltip {
  z-index: 9999 !important;
}
.ql-snow .ql-tooltip::before {
  content: "Link hinzufügen" !important;
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  content: "Speichern" !important;
}
</style>
