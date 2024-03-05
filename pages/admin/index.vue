<template>
  <div>
    <span class="general-font-size is-secondary-color font-weight-bold"
      >Admin-Bereich</span
    >
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "AdminIndex",
  setup() {
    definePageMeta({
      layout: "admin",
    });
  },
});
</script>
