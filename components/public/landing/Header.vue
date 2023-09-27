<template>
  <div class="wrapper">
    <h1 class="title">Gemeinsam für deine Gesundheit: Die Gesundheitsplattform für das Smart Wendeler Land</h1>
    <PublicLandingChooseCategory class="search-field"/>
    <p class="general-font-size sub-title">Finde hier Informationen zu Gesundheitsthemen, Präventions- und Pflegeangeboten im Landkreis Sankt Wendel.</p>
  </div>
</template>

<script lang="ts" setup>
import { useFilterStore } from "~/store/searchFilter";

const filterStore = useFilterStore();

onMounted(() => {
  filterStore.resetAllFilters();
});
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1rem;
  justify-content: center;
  width: 40%;
  padding: 0 0 0 5rem;

  @include md {
    padding: 1rem;
    padding-top: 5rem;
    width: 100%;
    width: 100%;
    justify-content: flex-start;
  }

  @include sm {
    padding: 1rem;
    width: 100%;
    justify-content: flex-start;
  }

  .title {
    color: white;
    font-size: 55px;
    text-transform: uppercase;
    line-height: 150%;
    @include md {
      text-align: center;
      justify-content: center;
      font-size: 2rem;
    }
  }
  .sub-title {
    color: white;
    font-style: normal;
    font-weight: 400;
    line-height: 160%;
    width: 75%;

    @include md {
      text-align: center;
      justify-content: center;
      font-size: 1.5rem;
      width: 100%;
    }
  }
  .header {
    margin-top: 20%;
  }
}
.search-field {
  @include md {
   margin: 2rem 0;
  }
}
</style>
