<template>
  <div>
    <div class="background">
      <PublicLandingHeader />
    </div>
    <PublicLandingCategories />
    <PublicLandingCurrentRecommendations />

    <PublicLandingHelplinks />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app";

const appStore = useAppStore();

</script>

<style lang="scss" scoped>
@import "@/assets/sass/base/breakpoints";
@import "@/assets/sass/main.sass";

.background {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.673)),
    url("../assets/images/home.svg") no-repeat center center;
  background: linear-gradient(rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.673)),
    url("../assets/images/home.svg") no-repeat center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;

  @include sm {
    background-position: center;
    background-size: cover;
    height: 90vh;
  }

  @include md {
    background-position: center;
    background-size: cover;
    background-position: right top;
    height: 50vh;
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
