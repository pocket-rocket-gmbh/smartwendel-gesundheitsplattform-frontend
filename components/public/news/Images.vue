<template>
  <div class="mt-15">
    <v-row>
      <v-col class="d-flex flex-wrap align-content-bottom justify-center">
        <img class="image" v-if="careFacility.image_url" :src="careFacility.image_url" height="400" />
      </v-col>
    </v-row>
  </div>
  
</template>

<script lang="ts">
export default defineComponent({
  props: {
    careFacility: {
        type: Object,
        required: true
    }
  },
  setup () {
    const showingGalery = ref(false)
    const showGalery = () => {
      showingGalery.value = true
    }
   
    return {
      showingGalery,
      showGalery
    }
  }
})
</script>

<style lang="sass" scoped>
.image
  width: 100%
  border-radius: 25px


.image-area
  position: relative
  
  &.has-logo
    margin-bottom: 3%
    background-color: white
  .logo img
    max-width: 15%
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
    border-radius: 20px
    position: absolute
    left: 40px
    bottom: -5%
    background-color: white
</style>