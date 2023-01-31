<template>
  <header class="background">
    <v-container class="limited offset">
      <v-row>
        <v-col md="6">
          <PublicLandingHeader />
          <PublicLandingChooseCategory />
        </v-col>
      </v-row>
    </v-container>
  </header>
  <PublicLandingCurrentNotes />
  <PublicLandingCategories />
  <PublicLandingCurrentHealthNotes />
</template>

<script lang="ts">
export default defineComponent({
})
</script>

<style lang="sass" scoped>
header
  height: 100vh
  
.background
  background: url('@/assets/images/home.jpg') no-repeat center center fixed
  -webkit-background-size: cover
  -moz-background-size: cover
  -o-background-size: cover
  background-size: cover
</style>