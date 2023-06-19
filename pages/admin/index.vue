<template>
  <div>
    <h2>Admin-Bereich</h2>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'AdminIndex',
  setup() {

    definePageMeta({
      layout: "admin",
    })
  }
})
</script>