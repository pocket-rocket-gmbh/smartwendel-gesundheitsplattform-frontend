<template>
  <ClientOnly>
    <div>
      <PublicSearchTheBasicSearchBox
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
            <v-skeleton-loader type="card" v-if="appStore.loading && !breakPoints.isMobile.value"></v-skeleton-loader>
            <ClientMap
              :locations="locations"
              v-if="
                showMap && !appStore.loading && filterStore.filteredResults.length > 0
              "
              ref="map"
              :auto-fit="false"
              :center-point="{
                lng: 7.131735,
                lat: 49.523656,
              }"
              :min-zoom="11"
            />
          </div>
          <div class="facilities">
            <PublicSearchTheFilteredCareFacilities @showOnMap="handleShowOnMap" />
          </div>
        </div>
      </div>
      <v-row v-if="!filterStore.filteredResults.length && !appStore.loading">
        <v-col class="d-flex flex-column align-center justify-center">
          <div class="flex-column" align="center">
            <div class="general-font-size text-h4">
              Leider haben wir kein Suchergebnis zu deiner Anfrage.
            </div>
          </div>
          <img :src="noResults" class="no-results-image mt-10" />
        </v-col>
      </v-row>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useFilterStore } from "~/store/searchFilter";
import type { MapLocation } from "~/types/MapLocation";
import { BreakPoints, useBreakpoints } from "~/composables/ui/breakPoints";
import { useAppStore } from "~/store/app";
import noResults from "~/assets/images/search_no_results.jpg";

const breakPoints = useBreakpoints();

const appStore = useAppStore();

const filterStore = useFilterStore();
const breakpoints = useBreakpoints();
const showMap = ref(true);

watch(
  () => filterStore.filteredResults,
  () => updateLocations()
);

watch(
  () => appStore.loading,
  async () => {
    if (appStore.loading) return;
    await filterStore.loadAllResults();
    filterStore.loadFilteredFacilityMainFilters();
  }
);

const startedAt = ref<null | "facilities" | "services" | "communities">(null);

const handleStartedAt = (origin: "facilities" | "services" | "communities") => {
  if (startedAt.value) {
    startedAt.value = origin;
    return;
  }

  if (
    filterStore.currentFacilityTags.length === 0 &&
    filterStore.currentServiceTags.length === 0 &&
    filterStore.currentZips.length === 0
  ) {
    if (startedAt.value) {
      startedAt.value = null;
      return;
    }
    startedAt.value = origin;
  }
};

watch(
  () => filterStore.currentFacilityTags,
  async () => {
    await filterStore.loadAllResults();

    handleStartedAt("facilities");

    if (startedAt.value !== "services") filterStore.loadAllServiceFilters();
    if (startedAt.value !== "communities") filterStore.loadFilteredCommunities();
  },
  {
    deep: true,
  }
);

watch(
  () => filterStore.currentZips,
  async () => {
    await filterStore.loadAllResults();

    handleStartedAt("communities");

    if (startedAt.value !== "services") filterStore.loadAllServiceFilters();
    if (startedAt.value !== "facilities") filterStore.loadFilteredFacilityMainFilters();
  },
  {
    deep: true,
  }
);

watch(
  () => filterStore.currentServiceTags,
  async () => {
    await filterStore.loadAllResults();

    handleStartedAt("services");

    if (startedAt.value !== "communities") filterStore.loadFilteredCommunities();
    if (startedAt.value !== "facilities") filterStore.loadFilteredFacilityMainFilters();
  },
  {
    deep: true,
  }
);

const showSearchFilter = computed(() => {
  return breakpoints.width.value > BreakPoints.md;
});

const locations = ref<MapLocation[]>([]);
const getLocationsFromFacilies = async (facilities: any[]) => {
  locations.value = [];

  for (const facility of facilities) {
    if (
      facility.geocode_address?.length &&
      facility.geocode_address[0] &&
      facility.geocode_address[0].lon &&
      facility.geocode_address[0].lat
    ) {
      locations.value.push({
        id: facility.id,
        latitude: parseFloat(facility.geocode_address[0].lat),
        longitude: parseFloat(facility.geocode_address[0].lon),
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
};

const updateLocations = () => {
  getLocationsFromFacilies(filterStore.filteredResults);
};

const mapToogle = () => {
  showMap.value = !showMap.value;
};

onMounted(async () => {
  filterStore.currentKinds = ["facility"];
  startedAt.value = null;
  filterStore.updateFromUrlQuery();
  await filterStore.loadAllResults();
  filterStore.loadAllServiceFilters();

  await filterStore.loadAllFacilityFilters();
  filterStore.loadFilteredFacilityMainFilters();
  showMap.value = !breakpoints.isMobile.value;
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

.no-results-image
  max-width: 500px
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15)
  border-radius: 20px
</style>
