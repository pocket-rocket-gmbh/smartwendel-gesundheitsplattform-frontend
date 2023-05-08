<template>
  <div>
    <div class="background">
      <v-row>
        <v-col class="flex-column align-start justify-start ma-15" md="5" xl="4">
          <PublicLandingHeader />
          <PublicLandingChooseCategory />
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
header
  height: 100vh
  
.background
  background: url('@/assets/images/home.svg') no-repeat center center fixed
  height: 100vh
  -webkit-background-size: cover
  -moz-background-size: cover
  -o-background-size: cover
  background-size: cover

.background::before 
  content: ""
  top: 0px
  right: 0px
  bottom: 0px
  left: 0px

</style>