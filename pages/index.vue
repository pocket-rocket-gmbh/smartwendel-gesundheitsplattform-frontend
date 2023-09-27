<template>
  <div>
    <div class="background">
      <PublicLandingHeader />
    </div>
    <PublicLandingCurrentNotes />
    <div class="divider"></div>
    <PublicLandingCategories />
    <PublicLandingCurrentRecommendations />
    <PublicLandingCurrentEvents />
    <div class="divider"></div>
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

  @include sm {
    background: url("../assets/images/home_mobile.jpg") no-repeat center center;
    background-position: center;
    background-size: cover;
    height: 70vh;
  }

  @include md {
    background-position: left;
  }
}

.divider {
  margin: 5rem;

  @include md {
    margin: 1rem;
  }
}

.row {
  @include sm {
    max-width: 100%;
    margin: 0;
  }
}

.header-wrapper {
  @include sm {
    padding: 0;
  }
}
</style>
