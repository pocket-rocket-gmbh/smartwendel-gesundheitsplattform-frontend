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
        <v-btn
          class="mx-3"
          variant="outlined"
          size="large"
          rounded="pill"
          color="white"
          @click="filterStore.clearSearch()"
        >
          Felder löschen
        </v-btn>
        <v-btn variant="flat" color="white" rounded="pill" size="large" @click="emitSearch()">
          <span class="text-black"> Suche starten </span>
        </v-btn>
      </v-col>
    </v-row>
  </div>
  <div class="map-widget">
    <ClientOnly>
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
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
import { MapLocation } from "@/types/MapLocation";
import { useFilterStore } from "~/store/facilitySearchFilter";

const filterStore = useFilterStore();

const showingMap = ref(true);
const map = ref(null);
const locations = ref<MapLocation[]>([]);

watch(
  () => filterStore.careFaclities,
  () => updateLocations()
);

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
      });
    });
  }
};

const updateLocations = () => {
  getLocationsFromFacilies(filterStore.careFaclities);
};

const mapToogle = () => {
  showingMap.value = !showingMap.value;
};

const emitSearch = () => {
  filterStore.loadCareFacilities();
};
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
