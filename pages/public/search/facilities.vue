<template>
  <ClientOnly>
    <div>
      <PublicSearchTheBasicSearchBox
        title="Anbietersuche"
        sub-title="Deine Wunscheinrichtung auswählen"
        :map-controls="true"
        :show-map="showMap"
        @toggle-map="mapToogle"
        :filter-kind="'facility'"
      />
      <div class="container">
        <div class="filters" v-if="showSearchFilter">
          <PublicSearchTheFilter :filterKind="'facility'" />
        </div>
        <div class="results">
          <div class="map-widget">
            <ClientMap
              :locations="locations"
              v-if="showMap"
              ref="map"
              :auto-fit="false"
              :center-point="{
                lng: 7.131735,
                lat: 49.523656,
              }"
              :min-zoom="11"
            />
          </div>

          <div class="facilities"><PublicSearchTheFilteredCareFacilities /></div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useFilterStore } from "~/store/searchFilter";
import { MapLocation } from "~/types/MapLocation";
import { BreakPoints, useBreakpoints } from "~/composables/ui/breakPoints";

const filterStore = useFilterStore();
const breakpoints = useBreakpoints();
const showMap = ref(!breakpoints.isMobile.value);

watch(
  () => filterStore.filterSort,
  () => {
    filterStore.loadAllResults();
  }
);

watch(
  () => filterStore.filteredResults,
  () => updateLocations()
);

const showSearchFilter = computed(() => {
  return breakpoints.width.value > BreakPoints.md;
});

const locations = ref<MapLocation[]>([]);
const getLocationsFromFacilies = async (facilities: any[]) => {
  locations.value = [];

  for (const facility of facilities) {
    if (facility.latitude && facility.longitude) {
      locations.value.push({
        id: facility.id,
        longitude: parseFloat(facility.longitude),
        latitude: parseFloat(facility.latitude),
        draggable: false,
        name: facility.name,
        url: `${window.location.origin}/public/care_facilities/${facility.id}`,
        imageUrl: facility.logo_url,
        kind: facility.kind,
      });
    }

    facility.locations.forEach((location: any) => {
      locations.value.push({
        id: facility.id,
        longitude: parseFloat(location.longitude),
        latitude: parseFloat(location.latitude),
        draggable: false,
        name: facility.name,
        url: `${window.location.origin}/public/care_facilities/${facility.id}`,
        imageUrl: facility.logo_url,
        kind: facility.kind,
      });
    });
  }
};

const updateLocations = () => {
  getLocationsFromFacilies(filterStore.filteredResults);
};

const mapToogle = () => {
  showMap.value = !showMap.value;
};

onMounted(async () => {
  filterStore.currentKinds = ["facility"];
  filterStore.updateFromUrlQuery();
  filterStore.loadAllResults();
});

onBeforeUnmount(() => {
  filterStore.resetAllFilters();
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.container
  padding: 2rem 5rem
  display: flex
  gap: 1rem

  @include md
    padding: 1rem

  .filters
    flex: 1

  .results
    flex: 2

  .row
    max-width: 100%
    margin: 0
    gap: 1rem
    @include md
      margin: 0

  .map-widget
    align-self: stretch
</style>
