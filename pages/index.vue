<template>
  <div>
    <div class="background">
      <v-row>
        <v-col
          class="flex-column align-start justify-start ma-15"
          md="6"
          xl="6"
        >
          <PublicLandingHeader />
        </v-col>
      </v-row>
    </div>
    <PublicLandingCurrentNotes />
    <div class="divider ma-10"></div>
    <PublicLandingCategories />
    <PublicLandingCurrentRecommendations />
    <PublicLandingCurrentEvents />
    <div class="divider ma-10"></div>
    <PublicLandingHelplinks />
  </div>
</template>

<script lang="ts">
export default defineComponent({});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
.background
  width: 100vw
  height: 100vh
  background: url('../assets/images/home.jpg') no-repeat center center
  background-repeat: no-repeat
  background-size: cover
  background-position: right top


</style>
