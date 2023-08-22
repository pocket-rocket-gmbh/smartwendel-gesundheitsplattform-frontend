<template>
  <Loading v-if="filterStore.loading" />
  <div class="entries" v-if="!(!filterStore.loading && !filterStore.filteredResults.length)">
    <div class="d-flex actions">
      <span class="hits">{{ filterStore.filteredResults.length }} Treffer</span>
      <div class="sort-order is-clickable d-flex align-center" @click="toggleFilterSort">
        <span>{{ filterStore.filterSort }}</span>
        <v-icon v-show="filterStore.filterSort === 'Absteigend'">mdi-chevron-down</v-icon>
        <v-icon v-show="filterStore.filterSort === 'Aufsteigend'">mdi-chevron-up</v-icon>
      </div>
    </div>
    <template v-if="filterStore.filteredResults.length > 0">
      <div v-if="!filterStore.currentKinds.includes('facility')" class="boxes" :class="{ doubled }">
        <PublicContentBox
          :size="12"
          class=""
          v-for="category in filterStore.filteredResults"
          :key="category.id"
          :item="category"
        />
      </div>
      <div v-else class="boxes">
        <div class="item" v-for="careFacility in filterStore.filteredResults" :key="careFacility.id">
          <v-row>
            <v-col md="8">
              <div class="is-dark-grey text-h5 font-weight-bold is-clickable">
                <a :href="`/public/care_facilities/${careFacility.id}`">{{ careFacility.name }}</a>
              </div>
              <v-row>
                <v-col>
                  <div class="text-dark-grey mt-4">
                    <div v-if="careFacility.street">{{ careFacility.street }}</div>
                    <div v-if="careFacility.zip || careFacility.town">
                      {{ careFacility.zip }} {{ careFacility.town }}
                    </div>
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
                variant="flat"
                color="primary"
                rounded="pill"
                size="large"
                :href="`/public/care_facilities/${careFacility.id}`"
              >
                <span> Details ansehen </span>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </div>
    </template>
  </div>
  <div v-if="!filterStore.loading && !filterStore.filteredResults.length" class="no-items">
    <div class="item">Leider keine Ergebnisse. Bitte Suche anpassen.</div>
  </div>
</template>

<script setup lang="ts">
import { useFilterStore, filterSortingDirections } from "~/store/searchFilter";

const props = defineProps<{
  doubled?: boolean;
}>();

const filterStore = useFilterStore();

const showCareFacilityInMap = async (careFacilityId: string) => {
  filterStore.mapFilter = careFacilityId;
  filterStore.loadFilteredResults();
  filterStore.mapFilter = null;
  window.scrollTo({
    behavior: "smooth",
    top: 0,
  });
};

const toggleFilterSort = () => {
  filterStore.toggleSort();
};
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
.item
  background: #FFFFFF
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
  border-radius: 20px
  padding: 20px
  margin-bottom: 1rem

  @include md
   margin-bottom: 0

.no-items
  flex: 1

.entries
  width: 100%

.actions
  display: flex
  align-items: center
  justify-content: space-between
  margin-bottom: 1rem

.hits
  font-size: 1.25rem

.items
  display: flex
  flex-direction: column

  .content-box
    flex: 1

.boxes
  display: flex
  flex-direction: column
  gap: 2rem

  &.doubled
    display: grid
    grid-template-columns: 1fr 1fr

  @include md
    display: flex
    flex-direction: column
    // gap: 0.5rem
</style>
