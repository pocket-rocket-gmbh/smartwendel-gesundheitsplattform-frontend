<template>
  <ClientOnly>
    <div>
      <PublicSearchTheBasicSearchBox
        title="Anbietersuche"
        sub-title="Wählen Sie ihre Wunscheinrichtung"
        :map-controls="true"
        :show-map="showMap"
        @toggle-map="mapToogle"
      />
      <v-container class="container limited padding">
        <v-row>
          <v-col md="4" lg="3" class="mt-8">
            <PublicSearchTheFilter />
          </v-col>
          <v-col md="8" lg="9" class="filtered-items mb-10">
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

            <PublicSearchTheFilteredCareFacilities />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useFilterStore, filterSortingDirections } from "~/store/searchFilter";
import { MapLocation } from "~/types/MapLocation";

const filterStore = useFilterStore();
const showMap = ref(true);

watch(
  () => filterStore.filterSort,
  () => {
    filterStore.loadCareFacilities();
  }
);

watch(
  () => filterStore.filterResults,
  () => updateLocations()
);

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
        url: `care_facilities/${facility.id}`,
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
        url: `care_facilities/${facility.id}`,
        imageUrl: facility.logo_url,
        kind: facility.kind,
      });
    });
  }
};

const updateLocations = () => {
  getLocationsFromFacilies(filterStore.filterResults);
};

const mapToogle = () => {
  showMap.value = !showMap.value;
};

onMounted(() => {
  filterStore.currentKinds = ["facility"];
  filterStore.updateFromUrlQuery();
  filterStore.loadCareFacilities();
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.container
  padding: 0

.filtered-items
  display: flex
  justify-content: flex-end
  flex-direction: column
  align-items: flex-end

  .map-widget
    align-self: stretch
</style>
