<template>
  <header class="background">
    <v-container class="limited">
      <v-row>
        <v-col md="7">
          <PublicLandingHeader />
          <PublicLandingChooseCategory />
        </v-col>
      </v-row>
    </v-container>
  </header>
</template>

<script lang="ts">
export default defineComponent({
})
</script>

<style lang="sass" scoped>
header
  height: 100vh
  // slide into second navbar
  margin-top: -50px
.background
  background: url('@/assets/images/home.jpg') no-repeat center center fixed
  -webkit-background-size: cover
  -moz-background-size: cover
  -o-background-size: cover
  background-size: cover
</style>