<template>
  <embed class="matomo" src="https://matomo.pocket-rocket.io">
</template>
<script lang="ts" setup>
  definePageMeta({
    layout: "admin",
  });
</script>
<style lang="sass">
.matomo
  height: 100vh
  width: 100%
</style>