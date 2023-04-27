<template>
  <div class="background">
    <v-container class="limited offset">
      <v-row>
        <v-col md="6">
          <PublicLandingHeader />
          <PublicLandingChooseCategory />
        </v-col>
      </v-row>
    </v-container>
  </div>
  <PublicLandingCurrentNotes />
  <v-container>
    <div class="divider my-10"></div>
  </v-container>
  <PublicLandingCategories />
  <PublicLandingCurrentRecommendations/>
  <PublicLandingCurrentEvents />
  <v-container>
    <div class="divider my-10"></div>
  </v-container>
  <PublicLandingHelplinks />
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