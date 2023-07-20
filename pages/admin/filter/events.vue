<template>
  <AdminFilterPage :filter-kind="'event'" name="Veranstaltungs und Kursfilter" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
});
</script>

<style lang="sass">
@import "@/assets/sass/main.sass"
</style>
