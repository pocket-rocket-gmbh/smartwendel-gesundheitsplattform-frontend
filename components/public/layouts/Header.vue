<template>
  <template v-if="breakPoints.isMobile.value">
    <v-app-bar :elevation="0" density="compact" class="main-layouts-title-bar">
      <div class="main-toolbar-content">
        <div class="menu-title is-uppercase text-h4 d-flex align-center justify-space-between text">
          <div class="spacer">
            <PublicCategoriesSelectCategoriesModal
              :sub-categories="subCategories"
              :selected-id="selectedId"
              @set-category-and-scroll="setSubCategoryAndScroll"
            />
          </div>
          <div class="is-white text-center font-weight-medium text-h4" v-if="category">{{ category.name }}</div>
          <div class="is-white text-center font-weight-medium text-h4" v-else>{{ title }}</div>
          <div class="spacer"></div>
        </div>
      </div>
    </v-app-bar>
  </template>
  <template v-else>
    <v-app-bar v-model="appStore.showTopbar" :elevation="0" density="compact" class="main-layouts-title-bar">
      <div class="main-toolbar-content">
        <div class="menu-title is-uppercase text-h4 d-flex align-center justify-center text my-3">
          <span class="is-white font-weight-medium" v-if="category">{{ category.name }}</span>
          <h2 class="is-white" v-else>{{ title }}</h2>
        </div>
        <div class="menu-bar-wrapper">
          <div class="menu-bar d-flex has-bg-mid-grey is-uppercase align-center justify-center">
            <div v-for="item in subCategories" @click="setSubCategoryAndScroll(item?.id)" class="is-clickable">
              <span class="px-5 is-dark-grey text-h5 font-weight-medium" :class="[selectedId === item?.id ? 'text-decoration-underline' : '']">
                {{ item?.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </v-app-bar>
  </template>
</template>
<script lang="ts" setup>
import { useBreakpoints } from "~/composables/ui/breakPoints";
import { useAppStore } from "~/store/app";

const props = defineProps({
  category: {
    type: Object,
  },
  subCategories: {
    type: Object,
  },
  title: {
    type: String,
  },
});

const appStore = useAppStore();
const breakPoints = useBreakpoints();
const selectedId = ref(null);

const setSubCategoryAndScroll = (id: any) => {
  requestAnimationFrame(() => {
    useNuxtApp().$bus.$emit("setSubCategory", id);
    selectedId.value = id;
  });
};

useNuxtApp().$bus.$on("updateSubCategoriesFromUrl", (id) => {
  selectedId.value = id;
});
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"

.main-layouts-title-bar
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column
  height: fit-content

  margin-top: 1rem

  @include md
    margin-top: 0

  .v-toolbar__content
    height: fit-content !important
    padding: 0

  .main-toolbar-content
    max-width: 100%
    width: 100%
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column
    gap: 0.5rem
    background-image: linear-gradient(89.48deg, #91a80d 19.14%, #bac323 42.28%, #9ea100 83.7%)
    background-position: 0 -35px

    @include md
      background-position: unset

    .menu-title
      width: 100%
      padding: 1rem
      position: relative
      top: 0.5rem

      @include md
        top: 0

      .text
        display: flex
        align-items: center
        justify-content: center
        width: 100%
        margin-top: 2rem

        @include md
          margin-top: 0

      .spacer
        width: 4rem

    .menu-bar-wrapper
      padding: 0.5rem
      padding-top: 0

      .menu-bar
        border-radius: 20px
        min-height: 60px
        width: 100%
        color: $dark-green

        @include md
          padding: 0.5rem
          flex-wrap: wrap
          gap: 0.5rem
          height: fit-content
</style>
