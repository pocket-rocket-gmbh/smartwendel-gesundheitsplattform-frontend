<template>
  <div>
    <span class="general-font-size is-dark-grey font-weight-bold">Dashboard</span>
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
