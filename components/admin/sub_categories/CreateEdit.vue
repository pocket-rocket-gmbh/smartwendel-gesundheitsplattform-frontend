<template>
  <CreateEdit v-slot="slotProps" :size="800" :height="600">
    <TextEditor v-model="slotProps.item.description" />
  </CreateEdit>
</template>
<script lang="ts" setup></script>
<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
</style>
