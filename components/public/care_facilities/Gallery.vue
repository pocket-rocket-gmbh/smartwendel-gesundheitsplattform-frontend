<template>
  <div v-if="showingGallery">
    <div class="curtain" />
    <div class="img-gallery">
      <div class="close-btn">
        <v-icon class="close" @click="emitClose()">mdi-close</v-icon>
      </div>
      <v-carousel hide-delimiters show-arrows="hover">
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
  showingGallery: {
    type: Boolean,
    required: true,
  },
});

const emitClose = () => {
  emit("close");
};

onMounted(() => {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      emitClose();
    }
  });
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main"

.img-gallery
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

.close
  padding: 20px
  background: $primary-color
  color: white
  z-index: 999
  border-radius: 50%
  border: $primary-color 3px solid
</style>
