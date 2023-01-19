<template>
  <div :class="['image-area', { 'has-logo' : careFacility.logo_url }]" v-if="careFacility.sanitized_images">
    <v-row>
      <v-col md="8">
        <img class="image left" v-if="careFacility.sanitized_images[0]" :src="careFacility.sanitized_images[0].url" />
      </v-col>
      <v-col md="4">
        <v-row><v-col><img class="image right-top" v-if="careFacility.sanitized_images[1]" :src="careFacility.sanitized_images[1].url" /></v-col></v-row>
        <v-row><v-col><img class="image right-bottom" v-if="careFacility.sanitized_images[2]" :src="careFacility.sanitized_images[2].url" /></v-col></v-row>
      </v-col>
    </v-row>
    <div class="logo" v-if="careFacility.logo_url">
      <img :src="careFacility.logo_url" />
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    careFacility: {
      type: Object,
      required: true
    }
  }
})
</script>

<style lang="sass" scoped>
.image
  max-width: 100%
  &.left
    border-top-left-radius: 20px
    border-bottom-left-radius: 20px
  &.right-top
    border-top-right-radius: 20px
  &.right-bottom
    border-bottom-right-radius: 20px

.image-area
  position: relative
  &.has-logo
    margin-bottom: 70px
  .logo img
    max-width: 300px
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
    border-radius: 20px
    position: absolute
    left: 40px
    bottom: -40px
</style>