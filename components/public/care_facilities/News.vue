<template>
  <div v-if="newsCareFacilities?.length">
    <v-divider class="my-10"></v-divider>
    <span
      class="general-font-size text-h4 font-weight-medium is-dark-grey d-md-block d-none text-wrap my-10"
      >Beiträge Dieser Einrichtung</span
    >
    <div class="boxes doubled">
      <PublicContentBox
        :size="6"
        class=""
        v-for="news in newsCareFacilities"
        :key="news.id"
        :item="news"
        :item-type="'news'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  careFacility: {
    type: Object,
    required: true,
  },
});

const newsCareFacilities = computed(() => {
  return props.careFacility?.user.care_facilities.filter(
    (facility: any) => facility.kind === "news" && facility?.is_active === true
  );
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
.boxes
  display: flex
  flex-direction: column
  gap: 2rem

  &.doubled
    display: grid
    grid-template-columns: 1fr 1fr

    @include md
      display: flex
      // gap: 0.5rem
</style>
