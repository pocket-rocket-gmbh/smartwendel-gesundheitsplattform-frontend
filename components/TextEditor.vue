<template>
  <ClientOnly>
    <QuillEditor
      v-model:content="text"
      class="ql-main-editor"
      :style="{ height: height || '200px' }"
      :options="textOptions"
      :placeholder="textOptions.placeholder"
      contentType="html"
      toolbar="minimal"
    />
  </ClientOnly>
</template>
<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  height?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const textOptions = ref({
  debug: false,
  placeholder: "Beschreibung",
  theme: "snow",
  contentType: "html",
  toolbar: "essential",
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
</style>
