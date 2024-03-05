<template>
  <div class="wrapper">
    <h1 class="is-white-color word-break title" lang="de">{{ title }}</h1>
    <PublicLandingChooseCategory class="search-field"/>
    <p class="is-paragraph is-white-color word-break title" lang="de">{{ subTitle }}</p>
    
  </div>
</template>

<script lang="ts" setup>
import { useFilterStore } from "~/store/searchFilter";
import homeImage from "@/assets/images/home.svg";

const filterStore = useFilterStore();

const title = ref('Ihr Pflegeportal \n im Landkreis Wunsiedel')
const subTitle = ref('Finden Sie  Informationen und Anbieter rund \n um das Thema Pflege in Ihrem Landkreis.')

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
  gap: 3rem;
  justify-content: center;
  width: 50%;
  padding: 0 0 0 6.25rem;

  @include lg {
    width: 70%;
    justify-items: center;
    padding: 2rem;
  }

  @include md {
    width: 100%;
    justify-items: center;
    padding: 3rem 2rem;
  }

  @include sm {
    width: 100%;
    justify-content: flex-start;
  }

  .header {
    margin-top: 20%;
  }
}

.title {
  white-space: pre-line;
}
.search-field {
  @include md {
   margin: 1rem 0;
  }
}
</style>
