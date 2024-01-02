<template>
  <NuxtLayout :class="[appStore.loading ? 'overlay' : '']">
    <NuxtPage />
  </NuxtLayout>
  <LoadingSpinner class="text-spinner" v-if="appStore.loading">Die Gesundheitsplattform wird geladen...</LoadingSpinner>
</template>

<script lang="ts" setup>
import { useAppStore } from "./store/app";

const appStore = useAppStore();
</script>
<style lang="scss">
@import "@/assets/sass/main.sass";

@include md {
  body {
    font-size: 20px;
  }
}

.text-spinner {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  opacity: 1 !important;
}

.spinner {
  border-top-color: #8ab61d !important;
}
.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  opacity: 0;
}
</style>
