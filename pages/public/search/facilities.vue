<template>
  <ClientOnly>
    <div>
      <div class="filter-control d-flex align-center justify-center general-font-size is-white py-10" v-if="isMobilie && !showFilter">
        <v-btn
            variant="outlined"
            min-width="250px"
            max-width="250px"
            rounded="pill"
            size="large"
            color="white"
            @click="toogleShowFilter()"
            class="general-font-size"
          >
            <span v-if="showFilter"> Filter ausblenden </span>
            <span v-else> Filter anzeigen </span>
          </v-btn>
      </div>
      <div class="filter-icon-control is-white" v-if="isMobilie && showFilter"  @click="toogleShowFilter()">
        <v-icon size="x-large" v-if="showFilter">mdi-eye-off</v-icon>
        <v-icon size="x-large" v-else>mdi-eye</v-icon>
      </div>
      <PublicSearchTheBasicSearchBox
        v-if="showFilter"
        title="Anbietersuche"
        sub-title="Finde den passenden Anbieter!"
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

          <div class="facilities"><PublicSearchTheFilteredCareFacilities @showOnMap="handleShowOnMap" /></div>
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
const showMap = ref(true);
const showFilter = ref(true);

watch(
  () => filterStore.filterSort,
  () => {
    filterStore.loadAllResults();
  }
);

watch(
  () => filterStore.filteredResults,
  () => updateLocations(),
);

const showSearchFilter = computed(() => {
  return breakpoints.width.value > BreakPoints.md;
});


const isMobilie = computed(() => {
 if (breakpoints.type.value === 'sm' || breakpoints.type.value === 'xs') {
   return true;
 }
 return false;
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

const handleShowOnMap = () => {
  showMap.value = true;
  showFilter.value = false;
};

const toogleShowFilter = () => {
  showFilter.value = !showFilter.value;
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
  showMap.value = !breakpoints.isMobile.value;
  if(isMobilie.value) {
    showFilter.value = false;
  }
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

.filter-control
  background: linear-gradient(88.43deg, #91A80D 13.65%, #BAC323 35.37%, #9EA100 82.27%)

.filter-icon-control
  position: absolute
  right: 5%
  top: 100px
</style>
