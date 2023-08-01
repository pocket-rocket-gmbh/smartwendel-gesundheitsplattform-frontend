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
      <v-container class="container limited padding">
        <v-row class="row">
          <v-col v-if="showSearchFilter" md="5" lg="3" class="mt-8">
            <PublicSearchTheFilter :filterKind="'facility'" />
          </v-col>
          <v-col md="7" lg="9" class="filtered-items mb-10">
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
          </v-col>
        </v-row>
      </v-container>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useFilterStore } from "~/store/searchFilter";
import { MapLocation } from "~/types/MapLocation";
import { BreakPoints, useBreakpoints } from "~/composables/ui/breakPoints";

const filterStore = useFilterStore();
const showMap = ref(true);
const breakpoints = useBreakpoints();

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
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.container
  padding: 0

  .row
    max-width: 100%
    @include md
      margin: 0

.filtered-items
  display: flex
  flex-direction: column

  .facilities
    margin-top: 1rem

  @include md
    padding: 0

  .map-widget
    align-self: stretch
</style>
