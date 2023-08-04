<template>
  <PublicSearchResponsiveMobileSearchBox
    v-if="breakPoints.isMobile.value"
    v-bind="{ ...$props }"
    @toggle-map="emit('toggleMap')"
  />
  <PublicSearchResponsiveDesktopSearchBox v-else v-bind="{ ...$props }" @toggle-map="emit('toggleMap')" />
</template>
<script setup lang="ts">
import { useBreakpoints } from "~/composables/ui/breakPoints";
import { FilterKind, useFilterStore } from "~/store/searchFilter";

const props = defineProps<{
  title: string;
  subTitle: string;
  filterKind: FilterKind;
  mapControls?: boolean;
  showMap?: boolean;
}>();

const emit = defineEmits<{
  (event: "toggleMap"): void;
}>();

const breakPoints = useBreakpoints();
const filterStore = useFilterStore();

watch(
  () => filterStore.currentTags,
  debounce(() => {
    filterStore.loadAllResults();
  }),
  {
    deep: true,
  }
);

watch(
  () => filterStore.currentZip,
  debounce(() => {
    filterStore.loadAllResults();
  }),
  {
    deep: true,
  }
);
</script>

<style lang="sass" scoped></style>
