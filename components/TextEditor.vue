<template>
  <ClientOnly>
    <QuillEditor
      class="ql-main-editor"
      :value="modelValue"
      :content="modelValue"
      :style="{ height: height || '200px' }"
      :options="textOptions"
      @input="emitSetInput"
      :placeholder="textOptions.placeholder"
      contentType="html"
      toolbar="minimal"
    />
  </ClientOnly>
</template>
<script lang="ts">
export default defineComponent({
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      required: true,
      type: String,
    },
    height: {
      required: false,
      type: String,
    },
  },
  setup(props, { emit }) {
    const textOptions = ref({
      debug: false,
      placeholder: "Beschreibung",
      theme: "snow",
      contentType: "html",
      toolbar: "essential",
    });

    const emitSetInput = (val: any) => {
      emit("update:modelValue", val.target.innerHTML);
    };

    return {
      textOptions,
      emitSetInput,
    };
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
