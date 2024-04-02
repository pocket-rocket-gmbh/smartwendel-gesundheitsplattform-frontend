<template>
  <div
    :class="[
      'image-area mt-5',
      { 'has-logo': careFacility?.logo_url || careFacility?.logo || careFacility?.user?.onboarding_token },
    ]"
  >
    <v-row class="image-row">
      <v-col class="d-flex flex-wrap align-content-bottom" :md="careFacility?.sanitized_images?.length === 0 ? '8' : ''">
        <img
          class="image"
          :class="[careFacility?.sanitized_images?.[0] ? 'left' : '']"
          v-if="careFacility?.image_url || careFacility?.file"
          :src="careFacility?.image_url || careFacility?.file"
        />
        <img v-else class="image image-placeholder" :src="imagePlaceHolder1" />
      </v-col>
      <v-col
        v-if="careFacility?.sanitized_images?.[0] || careFacility?.user?.onboarding_token"
        md="4"
        class="d-flex flex-wrap align-content-center justify-end"
      >
        <v-row v-if="breakPoints.type.value !== 'sm' && breakPoints.type.value !== 'md' && breakPoints.type.value !== 'xs'">
          <v-col class="d-flex flex-wrap align-content-bottom justify-center">
            <img class="image right-top" v-if="careFacility?.sanitized_images?.length" :src="careFacility?.sanitized_images?.[0].url" />
            <img v-else class="image right-top image-placeholder" :src="imagePlaceHolder2" />
          </v-col>
        </v-row>
        <v-row v-if="breakPoints.type.value !== 'sm' && breakPoints.type.value !== 'md' && breakPoints.type.value !== 'xs'">
          <v-col class="d-flex flex-wrap align-content-bottom justify-center">
            <img
              class="image right-bottom"
              v-if="careFacility?.sanitized_images?.[1]"
              :src="careFacility?.sanitized_images?.[1].url"
            />
            <img v-else-if="careFacility?.user?.onboarding_token" class="image right-top image-placeholder" :src="imagePlaceHolder3" />
            <v-btn
              class="show-more general-font-size"
              size="large"
              v-if="careFacility.sanitized_images.length > 1"
              @click="showGallery()"
            >
              alle Bilder zeigen</v-btn
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <div class="logo" v-if="careFacility?.logo || careFacility?.logo_url">
      <img :src="careFacility?.logo ? careFacility?.logo : careFacility?.logo_url" />
    </div>
    <div v-else class="logo image-placeholder">
      <img :src="logo1" />
    </div>
  </div>
  <PublicCareFacilitiesGallery
    :care-facility="careFacility"
    :showingGallery="showingGallery"
    @close="showingGallery = false"
  />
</template>

<script lang="ts" setup>
import { useBreakpoints } from "~/composables/ui/breakPoints";
import imagePlaceHolder1 from "/images/cover-images-gallery/facility/cover-21.jpg";
import imagePlaceHolder2 from "/images/cover-images-gallery/facility/cover-22.jpg";
import imagePlaceHolder3 from "/images/cover-images-gallery/facility/cover-23.jpg";
import logo1 from "@/assets/images/logo-gallery/logo_doctor.png";

const props = defineProps({
  careFacility: {
    type: Object,
    required: true,
  },
});

const breakPoints = useBreakpoints();

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
    @include md
      border-top-right-radius: 20px
      border-bottom-right-radius: 20px
    @include sm
      border-top-right-radius: 20px
      border-bottom-right-radius: 20px
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
    @include md
      width: 100%
      max-width: 50%
      bottom: -15%
      left: 5%
    

.image-row
  @include md
    flex-direction: column

.image-placeholder
  opacity: 0.5

</style>
