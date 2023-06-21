<template>
  <div class="">
    <ClientOnly>
      <QuillEditor
        :value="modelValue"
        :content="modelValue"
        style="height: 200px"
        :options="textOptions"
        @input="emitSetInput"
        :placeholder="textOptions.placeholder"
        contentType="html"
        toolbar="full"
      />
    </ClientOnly>
  </div>
</template>
<script lang="ts">
export default defineComponent({ 
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      required: true,
      type: String
    },
  },
  setup (props, {emit}) {
    const textOptions = ref({
      debug: false,
      placeholder: "Beschreibung",
      theme: 'snow',
      contentType: "html",
      toolbar: "essential"
    })

    const emitSetInput = (val:any) => {
      emit('update:modelValue', val.target.innerHTML)
    }

    return {
      textOptions,
      emitSetInput
    }
  }
})
</script>
<style lang="sass" scoped>

</style>