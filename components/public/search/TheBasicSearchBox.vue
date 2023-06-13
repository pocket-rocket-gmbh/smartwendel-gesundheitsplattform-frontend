<template>
  <div class="basic-search-box pa-8 mt-10">
    <v-row>
      <v-col>
        <h2 class="is-uppercase text-white">Wählen Sie hier Ihre Suchkriterien aus</h2>
      </v-col>
      <v-col class="is-white d-flex align-center justify-end">
        <p>Hilfe ?</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="field">
          <label class="label">Einrichtung, Arzt, Name etc.</label>
          <input type="text" class="input" v-model="filterStore.currentSearchQuery" />
        </div>
      </v-col>
      <v-col>
        <PublicFilterSelect
          :key="filterStore.currentCategoryId"
          color="is-white"
          filter-name="category"
          label="Bereich"
          endpoint="categories"
        />
      </v-col>
      <v-col>
        <PublicFilterSelect
          :key="filterStore.currentCategoryId"
          color="is-white"
          filter-name="category"
          label="Ort, Adresse oder PLZ"
          endpoint=""
        />
      </v-col>
    </v-row>
    <v-row class="mt-3">
      <v-col>
        <v-btn class="mx-3" variant="outlined" size="large" rounded="pill" color="white" @click="mapToogle()">
          <span v-if="showingMap"> Karte ausblenden </span>
          <span v-if="!showingMap"> Karte einblenden </span>
        </v-btn>
      </v-col>
      <v-col class="d-flex justify-end">
        <v-btn class="mx-3" variant="outlined" size="large" rounded="pill" color="white" @click="emitResetFilter()">
          Felder löschen
        </v-btn>
        <v-btn variant="flat" color="white" rounded="pill" size="large" @click="emitSearch()">
          <span class="text-black"> Suche starten </span>
        </v-btn>
      </v-col>
    </v-row>
  </div>
  <div class="map-widget">
    <MapWidget
      :locations="locations"
      v-if="showingMap"
      ref="map"
      :auto-fit="false"
      :center-point="{
        lng: 7.131735,
        lat: 49.523656,
      }"
      :min-zoom="11"
    />
  </div>
</template>
<script lang="ts">
import { useFilterStore } from "@/store/filter";
import { MapLocation } from "@/types/MapLocation";
import axios from "axios";

export default defineComponent({
  setup() {
    const searchQuery = ref("");
    const filterStore = useFilterStore();
    const showingMap = ref(true);
    const map = ref(null);
    const locations = ref<MapLocation[]>([]);

    const api = useCollectionApi();
    api.setBaseApi(usePublicApi());
    api.setEndpoint("care_facilities");
    let facilities = api.items;

    if (useNuxtApp().$bus) {
      useNuxtApp().$bus.$on("clearSearch", () => {
        searchQuery.value = "";
      });
      useNuxtApp().$bus.$on("facilitiesUpdated", (updatedFacilities: any) => {
        facilities.value = updatedFacilities;
        updateLocations();
      });
    }

    onMounted(() => {
      getfacilities(false);
    });

    const getfacilities = async (concat = false) => {
      await api.retrieveCollection();
      updateLocations();
    };

    const getLatLngFromZipCodeAndStreet = async (zipCode: string, street: string) => {
      const { data } = await axios.get(
        `https://geocode.maps.co/search?postalcode=${zipCode}&street=${street}&country=DE`
      );

      if (!data.length) {
        return null;
      }

      const bestResult = data[0];

      return [bestResult.lat, bestResult.lon];
    };

    const getLocationsFromFacilies = async (facilities: any[]) => {
      locations.value = [];

      // locations.value wird doppelt genommen weil der filter doppelt geupdated wird, und weil das hier in nem async context ist wird das leider nicht neu geleert

      for (const facility of facilities) {
        if (facility.zip && facility.street) {
          const response = await getLatLngFromZipCodeAndStreet(facility.zip, facility.street);

          if (response) {
            const [lat, lon] = response;

            locations.value.push({
              id: facility.id,
              latitude: lat,
              longitude: lon,
              name: facility.name,
              draggable: false,
              url: facility.website,
              imageUrl: facility.logo_url,
            });
          }
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
          });
        });
      }
    };

    const updateLocations = () => {
      getLocationsFromFacilies(facilities.value);
    };

    const emitResetFilter = () => {
      useFilterStore().$patch({
        currentCategoryId: null,
        currentSubCategoryId: null,
        currentSubSubCategoryId: null,
        currentTags: null,
      });
      useNuxtApp().$bus.$emit("updateFacilitiesBasedOnFilterChange", null);
      useNuxtApp().$bus.$emit("clearSearch", null);
      useNuxtApp().$bus.$emit("clearTags", null);
    };

    const mapToogle = () => {
      showingMap.value = !showingMap.value;
    };
    const currentCategoryId = computed(() => {
      return filterStore.currentCategoryId;
    });

    const emitSearch = () => {
      useNuxtApp().$bus.$emit("emitFacilitySearch", searchQuery.value);
    };

    return {
      useFilterStore,
      searchQuery,
      currentCategoryId,
      emitSearch,
      showingMap,
      map,
      mapToogle,
      emitResetFilter,
      locations,
      facilities,
    };
  },
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
.basic-search-box
  background: linear-gradient(88.43deg, #91A80D 13.65%, #BAC323 35.37%, #9EA100 82.27%)
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
  border-radius: 20px

.map-widget
  margin-top: -10px
</style>
