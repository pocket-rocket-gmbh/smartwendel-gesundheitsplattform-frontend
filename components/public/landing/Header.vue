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

  @include lg {
    width: 70%;
    justify-items: center;
    padding: 2rem;
  }

  @include md {
    width: 100%;
    justify-items: center;
    padding: 2rem;
  }

  @include sm {
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
    }
    @include sm {
      font-size: 1.6rem;
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
     
      width: 100%;
    }
  }
  .header {
    margin-top: 20%;
  }
}
.search-field {
  @include md {
   margin: 1rem 0;
  }
}
</style>
