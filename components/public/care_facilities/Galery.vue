<template>
  <div v-if="showingGalery">
    <div class="curtain" />
    <div class="img-galery">
      <img class="close is-clickable" src="~/assets/icons/icon-times.svg" height="20"  @click="emitClose()" />
      <v-carousel hide-delimiters progress="red" show-arrows="hover">
        <v-carousel-item
          v-for="(image, index) in careFacility.sanitized_images"
          :key="index"
          :src="image?.url"
          cover
        />
      </v-carousel>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  emits: ['close'],
  props: {
    careFacility: {
      type: Object,
      required: true
    },
    showingGalery: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
  
    const emitClose = () => {
      emit('close')
    }
   
    return {
      emitClose
    }
  },
})
</script>

<style lang="sass" scoped>

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
  &.is-desktop
    top: 35%
    width: 50vw
  &.is-mobile
    top: 50%
    width: 90vw
</style>