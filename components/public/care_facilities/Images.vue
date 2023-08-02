<template>
  <div :class="['image-area mt-5', { 'has-logo': careFacility.logo_url }]" v-if="careFacility.sanitized_images">
    <v-row class="image-row">
      <v-col class="d-flex flex-wrap align-content-bottom justify-center">
        <img
          class="image"
          :class="[careFacility.sanitized_images[0] ? 'left' : '']"
          v-if="careFacility.image_url"
          :src="careFacility.image_url"
        />
      </v-col>

      <v-col v-if="careFacility.sanitized_images[0]" md="4" class="d-flex flex-wrap align-content-center justify-end">
        <v-row>
          <v-col class="d-flex flex-wrap align-content-bottom justify-center">
            <img class="image right-top" :src="careFacility.sanitized_images[0].url" />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex flex-wrap align-content-bottom justify-center">
            <img
              class="image right-bottom"
              v-if="careFacility.sanitized_images[1]"
              :src="careFacility.sanitized_images[1].url"
            />
            <v-btn class="show-more" v-if="careFacility.sanitized_images.length > 0" @click="showGalery()">
              alle Bilder zeigen</v-btn
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <div class="logo" v-if="careFacility.logo_url">
      <img :src="careFacility.logo_url" />
    </div>
  </div>
  <PublicCareFacilitiesGalery
    :care-facility="careFacility"
    :showingGalery="showingGalery"
    @close="showingGalery = false"
  />
</template>

<script lang="ts">
export default defineComponent({
  props: {
    careFacility: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const showingGalery = ref(false);
    const showGalery = () => {
      showingGalery.value = true;
    };

    return {
      showingGalery,
      showGalery,
    };
  },
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main"

.show-more
  position: absolute
  bottom: 0
  right: 0
  margin: 30px
.image
  max-width: 100%
  max-height: 100%
  border-radius: 20px
  &.left
    border-radius: 20px
    border-bottom-left-radius: 20px
  &.right-top
    border-top-right-radius: 20px
  &.right-bottom
    border-bottom-right-radius: 20px

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

.image-row
  @include md
    flex-direction: column
</style>
