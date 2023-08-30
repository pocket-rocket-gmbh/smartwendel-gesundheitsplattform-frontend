<template>
  <div
    :class="[
      'image-area mt-5',
      { 'has-logo': careFacility.logo_url || careFacility.logo },
    ]"
  >
    <v-row class="image-row">
      <v-col class="d-flex flex-wrap align-content-bottom justify-center">
        <img
          class="image"
          :class="[careFacility?.sanitized_images?.[0] ? 'left' : '']"
          v-if="careFacility.image_url || careFacility.file"
          :src="careFacility.image_url || careFacility.file"
        />
      </v-col>
      <v-col
        v-if="careFacility?.sanitized_images?.[0]"
        md="4"
        class="d-flex flex-wrap align-content-center justify-end"
      >
        <v-row>
          <v-col class="d-flex flex-wrap align-content-bottom justify-center">
            <img class="image right-top" :src="careFacility?.sanitized_images?.[0].url" />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex flex-wrap align-content-bottom justify-center">
            <img
              class="image right-bottom"
              v-if="careFacility?.sanitized_images?.[1]"
              :src="careFacility?.sanitized_images?.[1].url"
            />
            <v-btn
              class="show-more"
              v-if="careFacility.sanitized_images.length > 1"
              @click="showGallery()"
            >
              alle Bilder zeigen</v-btn
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <div class="logo" v-if="careFacility.logo || careFacility.logo_url">
      <img :src="careFacility.logo ? careFacility.logo : careFacility.logo_url" />
    </div>
  </div>
  <PublicCareFacilitiesGallery
    :care-facility="careFacility"
    :showingGallery="showingGallery"
    @close="showingGallery = false"
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  careFacility: {
    type: Object,
    required: true,
  },
});

const showingGallery = ref(false);
const showGallery = () => {
  showingGallery.value = true;
};
const careFacility = ref(props.careFacility);
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
