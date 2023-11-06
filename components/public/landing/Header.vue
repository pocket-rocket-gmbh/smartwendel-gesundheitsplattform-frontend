<template>
  <div class="wrapper">
    <h1 class="title">{{ title }}</h1>
    <PublicLandingChooseCategory class="search-field"/>
    <p class="sub-title">{{ subTitle }}</p>
  </div>
</template>

<script lang="ts" setup>
import { useFilterStore } from "~/store/searchFilter";
import homeImage from "@/assets/images/home.jpg";

const filterStore = useFilterStore();

const title = ref('Gemeinsam für deine Gesundheit: Die Gesundheitsplattform für das Smart Wendeler Land')
const subTitle = ref('Finde hier Informationen zu Gesundheitsthemen, Präventions- und Pflegeangeboten im Landkreis Sankt Wendel.')

useHead({
  title: title,
  meta: [
    { property: "og:type", content: "Webseite" },
    { name: "description", content: subTitle },
    { name: "title", content: title },
    { name: "image", content: homeImage },
  ],
});

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
  gap: 2rem;
  justify-content: center;
  width: 50%;
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
    font-weight: 300;
    line-height: 35px;
    width: 75%;
    font-size: 27px;

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
