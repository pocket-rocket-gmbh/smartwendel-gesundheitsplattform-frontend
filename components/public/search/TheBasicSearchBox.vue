<template>
  <PublicSearchResponsiveMobileSearchBox v-if="breakPoints.isMobile.value" v-bind="{ ...$props }" @toggle-map="emit('toggleMap')" />

  <PublicSearchResponsiveDesktopSearchBox v-else v-bind="{ ...$props }" @toggle-map="emit('toggleMap')" :show-map="showMap" />
</template>
<script setup lang="ts">
import { useBreakpoints } from "~/composables/ui/breakPoints";
import { type FilterKind, useFilterStore } from "~/store/searchFilter";

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

</script>

<style lang="sass" scoped></style>
