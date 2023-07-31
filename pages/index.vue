<template>
  <div>
    <div class="background">
      <v-row>
        <v-col class="header-wrapper flex-column align-start justify-start" md="6" xl="6">
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

<script lang="ts"></script>

<style lang="scss" scoped>
@import "@/assets/sass/base/breakpoints";
@import "@/assets/sass/main.sass";

.background {
  width: 100vw;
  height: 100vh;
  background: url("../assets/images/home.jpg") no-repeat center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: right top;
}

.header-wrapper {
  margin: 5rem;

  @include sm {
    margin: 1rem;
  }
}
</style>
