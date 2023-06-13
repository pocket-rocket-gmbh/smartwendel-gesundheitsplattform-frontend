<template>
  <Loading v-if="filterStore.loading" />
  <div v-else-if="filterStore.careFaclities.length > 0">
    <div class="ml-2 my-2">
      <span>{{ filterStore.careFaclities.length }} Treffer</span>
    </div>
    <div class="item mb-6" v-for="careFacility in filterStore.careFaclities" :key="careFacility.id">
      <v-row>
        <v-col md="8">
          <h2 class="is-dark-grey is-uppercase">{{ careFacility.name }}</h2>
          <v-row>
            <v-col>
              <div class="text-dark-grey mt-4">
                <div v-if="careFacility.street">{{ careFacility.street }}</div>
                <div v-if="careFacility.zip || careFacility.town">{{ careFacility.zip }} {{ careFacility.town }}</div>
                <div v-if="careFacility.community">{{ careFacility.community }}</div>
              </div>
            </v-col>
            <v-col>
              <div class="text-dark-grey mt-4">
                <div v-if="careFacility.phone">
                  <v-icon color="primary" class="mr-2">mdi-phone-outline</v-icon>{{ careFacility.phone }}
                </div>
                <div v-if="careFacility.email">
                  <v-icon color="primary" class="mr-2">mdi-email-outline</v-icon>{{ careFacility.email }}
                </div>
              </div>
            </v-col>
          </v-row>
          <div>
            <v-btn
              append-icon="mdi-map-marker-outline"
              size="small"
              class="mt-4 pa-1"
              variant="text"
              color="primary"
              rounded="pill"
              @click="showCareFacilityInMap(careFacility.id)"
            >
              Auf karte zeigen
            </v-btn>
          </div>
        </v-col>
        <v-col align="right">
          <v-btn
            variant="outlined"
            size="large"
            rounded="pill"
            color="primary"
            :href="`/public/care_facilities/${careFacility.id}`"
            target="_blank"
          >
            Details ansehen
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
  <div v-else-if="!filterStore.loading">
    <div class="item">Leider keine Ergebnisse. Bitte passen Sie Ihre Suche an.</div>
  </div>
</template>

<script setup lang="ts">
import { useFilterStore } from "~/store/facilitySearchFilter";

const filterStore = useFilterStore();

onMounted(() => {
  filterStore.loadCareFacilities();
});

const showCareFacilityInMap = async (careFacilityId: string) => {
  filterStore.mapFilter = careFacilityId;
  await filterStore.loadCareFacilities();
  filterStore.mapFilter = null;
  window.scrollTo({
    behavior: "smooth",
    top: 0,
  });
};
</script>

<style lang="sass" scoped>
.item
  background: #FFFFFF
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
  border-radius: 20px
  padding: 20px
</style>