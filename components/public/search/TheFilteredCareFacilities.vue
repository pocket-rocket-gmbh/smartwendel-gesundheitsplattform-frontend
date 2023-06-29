<template>
  <Loading v-if="filterStore.loading" />
  <div class="entries" v-else-if="filterStore.filterResults.length > 0">
    <div class="ml-2 my-2 d-flex actions">
      <span class="hits">{{ filterStore.filterResults.length }} Treffer</span>
      <div class="sort-order">
        <v-select variant="underlined" v-model="filterStore.filterSort" :items="filterSortingDirections" />
      </div>
    </div>
    <div v-if="!filterStore.currentKinds.includes('facility')" class="items">
      <PublicContentBox
        class="content-box"
        v-for="category in filterStore.filterResults"
        :key="category.id"
        :item="category"
      />
    </div>

    <template v-else>
      <div class="item mb-6" v-for="careFacility in filterStore.filterResults" :key="careFacility.id">
        <v-row>
          <v-col md="8">
            <div class="is-dark-grey text-h5 font-weight-bold is-clickable">
              <a :href="`/public/care_facilities/${careFacility.id}`">{{ careFacility.name }}</a>
            </div>
            <v-row>
              <v-col>
                <div class="text-dark-grey mt-4">
                  <div v-if="careFacility.street">{{ careFacility.street }}</div>
                  <div v-if="careFacility.zip || careFacility.town">{{ careFacility.zip }} {{ careFacility.town }}</div>
                  <!-- <div v-if="careFacility.community">{{ careFacility.community }}</div> -->
                </div>
              </v-col>
              <v-col>
                <div class="text-dark-grey mt-4">
                  <div v-if="careFacility.phone">
                    <v-icon color="primary" class="mr-2">mdi-phone-outline</v-icon>
                    <a :href="`tel:${careFacility.phone}`">{{ careFacility.phone }}</a>
                  </div>
                  <div v-if="careFacility.email">
                    <v-icon color="primary" class="mr-2">mdi-email-outline</v-icon>
                    <a :href="`mailto:${careFacility.email}`">{{ careFacility.email }}</a>
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
    </template>
  </div>
  <div v-else-if="!filterStore.loading">
    <div class="item">Leider keine Ergebnisse. Bitte passen Sie Ihre Suche an.</div>
  </div>
</template>

<script setup lang="ts">
import { useFilterStore, filterSortingDirections } from "~/store/searchFilter";

const filterStore = useFilterStore();

const showCareFacilityInMap = async (careFacilityId: string) => {
  filterStore.mapFilter = careFacilityId;
  await filterStore.loadFilteredEntries();
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

.entries
  max-width: 650px

.sort-order
  width: 200px

.actions
  display: flex
  align-items: center
  justify-content: space-between

.hits
  font-size: 1.25rem

.items
  display: flex
  flex-direction: column

  .content-box
    flex: 1
</style>
~/store/SearchFilter