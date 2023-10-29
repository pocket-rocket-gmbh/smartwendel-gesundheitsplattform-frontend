<template>
  <div class="loading is-dark-grey general-font-size"><slot /><span class="spinner"></span></div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    style: "inline" | "full-screen";
  }>(),
  {
    style: "inline",
  }
);
</script>

<style lang="scss" scoped>
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.loading {
  position: relative;
  display: flex;
  align-items: center;

  .spinner {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-left: 1rem;
    border: 2px solid #ccc;
    border-top-color: #000;
    animation: spinner 0.6s linear infinite;
  }
}
</style>
