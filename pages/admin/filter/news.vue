<template>
  <AdminFilterPage :filter-kind="'news'" name="Beitragsfilter" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
});
</script>

<style lang="sass">
@import "@/assets/sass/main.sass"
</style>
