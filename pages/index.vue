<template>
  <div>
    <div class="background">
      <v-row>
        <v-col class="flex-column align-start justify-start ma-15" md="5" xl="4">
          <PublicLandingHeader />
        </v-col>
        </v-row>
    </div>
    <PublicLandingCurrentNotes />
      <div class="divider ma-10"></div>
    <PublicLandingCategories />
    <PublicLandingCurrentRecommendations/>
    <PublicLandingCurrentEvents />
      <div class="divider ma-10"></div>
    <PublicLandingHelplinks />
  </div>
  
</template>

<script lang="ts">
export default defineComponent({
})
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"  
.background 
  background: url('../assets/images/home.svg') no-repeat center center
  background-size: cover
  height: 100vh

</style>