<template>
  <div>Todo</div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'Snackbar',
  setup() {
    const show = ref(false)
    return {
      show
    }
  }
})
</script>