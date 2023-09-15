<template>
  <div class="wrapper">
    <h1 class="title">Deine Gesundheits-plattform im Landkreis Sankt Wendel</h1>
    <PublicLandingChooseCategory />
    <p class="general-font-size sub-title">Informationen zu Gesundheitsthemen, Präventionsmaßnahmen sowie umfangreiche Pflegeangebote finden.</p>
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
  }
  .sub-title {
    color: white;
    font-style: normal;
    font-weight: 400;
    line-height: 160%;
    width: 75%;

    @include md {
      width: 100%;
    }
  }
  .header {
    margin-top: 20%;
  }
}
</style>
