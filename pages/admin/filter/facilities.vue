<template>
  <AdminFilterPage :filter-kind="'facility'" name="Einrichtungsfilter" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
});
</script>

<style lang="sass">
@import "@/assets/sass/main.sass"
</style>
