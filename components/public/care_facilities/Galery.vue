<template>
  <div v-if="showingGalery">
    <div class="curtain" />
    <div class="img-galery">
      <img class="close is-clickable" src="~/assets/icons/icon-times.svg" height="20" @click="emitClose()" />
      <v-carousel hide-delimiters progress="primary" show-arrows="hover">
        <v-carousel-item v-for="(image, index) in careFacility.sanitized_images" :key="index" :src="image?.url" cover />
      </v-carousel>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["close"]);
const props = defineProps({
  careFacility: {
    type: Object,
    required: true,
  },
  showingGalery: {
    type: Boolean,
    required: true,
  },
});

const emitClose = () => {
  emit("close");
};
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main"

.img-galery
  background: white
  color: red
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 1)
  position: fixed
  left: 50%
  transform: translate(-50%, -50%)
  place-items: center
  z-index: 100000
  border-radius: 20px
  overflow: hidden
  min-height: 30vh
  width: 50vw
  top: 50%

  @include md
    top: 50%
    width: 90vw
</style>
