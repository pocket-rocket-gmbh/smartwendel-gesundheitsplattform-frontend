<template>
  <Loading v-if="filterStore.loading" />
  <div
    class="entries general-font-size"
    v-if="!(!filterStore.loading && !filterStore.filteredResults.length)"
  >
    <v-row class="mb-4">
      <v-col class="d-flex justify-space-between">
        <div class="d-flex align-center">
          {{ filterStore.filteredResults.length }} TREFFER
        </div>

        <div
          class="d-flex align-center is-clickable"
          @click="setCurrentAvailableCapacity(1)"
          :class="[
            filterStore.currentAvailableCapacity === 1 ||
            filterStore.currentAvailableCapacity === null
              ? 'enable-filter'
              : 'disabled-filter',
            filterStore.currentAvailableCapacity === 1 ? 'selected-filter' : '',
          ]"
        >
          <v-icon size="x-large" color="primary">mdi-circle</v-icon>
          <div class="px-2">Freie Plätze</div>
        </div>
        <div
          class="d-flex align-center is-clickable"
          @click="setCurrentAvailableCapacity(2)"
          :class="[
            filterStore.currentAvailableCapacity === 2 ||
            filterStore.currentAvailableCapacity === null
              ? 'enable-filter'
              : 'disabled-filter',
            filterStore.currentAvailableCapacity === 2 ? 'selected-filter' : '',
          ]"
        >
          <v-icon size="x-large" color="orange">mdi-circle</v-icon>
          <div class="px-2">Plätze auf Anfrage</div>
        </div>
        <div
          class="d-flex align-center is-clickable"
          @click="setCurrentAvailableCapacity(3)"
          :class="[
            filterStore.currentAvailableCapacity === 3 ||
            filterStore.currentAvailableCapacity === null
              ? 'enable-filter'
              : 'disabled-filter',
            filterStore.currentAvailableCapacity === 3 ? 'selected-filter' : '',
          ]"
        >
          <v-icon size="x-large" color="red">mdi-circle</v-icon>
          <div class="px-2">Wartezeit bis zu 2 Monate</div>
        </div>
      </v-col>
      <v-col md="4" class="d-flex justify-end">
        <div class="d-flex actions">
          <div
            class="sort-order is-clickable d-flex align-center"
            @click="toggleFilterSort"
          >
            <span>{{ filterStore.filterSort }}</span>
            <v-icon v-show="filterStore.filterSort === 'A-Z'">mdi-chevron-down</v-icon>
            <v-icon v-show="filterStore.filterSort === 'Z-A'">mdi-chevron-up</v-icon>
          </div>
        </div>
      </v-col>
    </v-row>
    <template v-if="filterStore.filteredResults.length > 0">
      <div
        v-if="!filterStore.currentKinds.includes('facility')"
        class="boxes"
        :class="{ doubled }"
      >
        <PublicContentBox
          :size="12"
          class=""
          v-for="category in filterStore.filteredResults"
          :key="category.id"
          :item="category"
        />
      </div>
      <div v-else class="boxes">
        <div
          class="item"
          v-for="careFacility in filterStore.filteredResults"
          :key="careFacility.id"
        >
          <v-row class="item-row">
            <v-col sm="12" md="6" class="mb-0 pb-0">
              <div class="d-flex justify-space-between align-center">
                <div class="is-label-big font-weight-medium is-clickable">
                  <a
                    class="is-secondary-color"
                    :href="`/public/care_facilities/${careFacility.id}`"
                    >{{ careFacility.name }}</a
                  >
                </div>
                <div class="hidden-md-and-up">
                  <v-icon
                    v-if="
                      careFacility.geocode_address.length || careFacility.locations.length
                    "
                    size="x-large"
                    color="primary"
                    @click="showCareFacilityInMap(careFacility.id)"
                    >mdi-map-marker-outline</v-icon
                  >
                </div>
              </div>
            </v-col>
            <v-col sm="12" md="6" class="action d-md-flex justify-end hidden-sm-and-down">
              <v-btn
                variant="flat"
                class="general-font-size"
                color="primary"
                rounded="pill"
                size="large"
                @click="goToFacility(careFacility)"
              >
                <span> Details ansehen </span>
              </v-btn>
            </v-col>
          </v-row>

          <v-row class="item-row">
            <v-col cols="12" md="4" sm="4" xl="4" xs="12" class="mb-0 pb-0">
              <div class="is-secondary-color mt-4">
                <div class="d-flex">
                  <img class="mr-2 icon" :src="iconAddress" />
                  <div v-if="careFacility.street">
                    {{ careFacility.street }}
                  </div>
                </div>
                <div class="d-flex ml-n1" v-if="careFacility.zip || careFacility.town">
                  <v-icon></v-icon>
                  {{ careFacility.zip }} {{ careFacility.town }}
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="4" xl="4" xs="12" class="mb-0 pb-0">
              <div class="mt-4">
                <div v-if="careFacility.phone" class="d-flex align-center">
                  <img class="mr-2 icon" :src="iconPhone" />
                  <a class="is-secondary-color" :href="`tel:${careFacility.phone}`">{{
                    careFacility.phone
                  }}</a>
                </div>
                <div v-if="careFacility.email" class="d-flex align-center">
                  <img class="mr-2 icon" :src="iconMail" />
                  <a class="is-secondary-color" :href="`mailto:${careFacility.email}`">{{
                    careFacility.email
                  }}</a>
                </div>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="4"
              xl="4"
              xs="12"
              class="mb-0 pb-0 d-flex justify-top align-top"
            >
              <PublicCareFacilitiesRight
                :care-facility="careFacility"
                :search-page="true"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="12" class="action hidden-md-and-up">
              <v-btn
                variant="flat"
                width="100%"
                class="general-font-size"
                color="primary"
                rounded="pill"
                size="large"
                @click="goToFacility(careFacility)"
              >
                <span> Details ansehen </span>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex">
              <div class="hidden-sm-and-down">
                <v-btn
                  v-if="
                    careFacility.geocode_address.length || careFacility.locations.length
                  "
                  append-icon="mdi-map-marker-outline"
                  size="small"
                  class=""
                  variant="text"
                  color="primary"
                  rounded="pill"
                  @click="showCareFacilityInMap(careFacility.id)"
                >
                  Auf karte zeigen
                </v-btn>
              </div>
            </v-col>
            <v-col class="d-flex justify-end align-center">
              <div>
                <v-icon class="mr-2" color="primary">mdi-update</v-icon>
              </div>
              {{ useDatetime().parseDatetime(careFacility.updated_at) }}
            </v-col>
          </v-row>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useFilterStore, filterSortingDirections } from "~/store/searchFilter";
import iconPhone from "@/assets/icons/facilities/icon_phone.svg";
import iconMail from "@/assets/icons/facilities/icon_mail.svg";
import iconAddress from "@/assets/icons/facilities/icon_address.svg";

const router = useRouter();

const props = defineProps<{
  doubled?: boolean;
}>();
const emit = defineEmits<{
  (event: "showOnMap"): void;
}>();

const goToFacility = (careFacility: any) => {
  router.push({ path: `/public/care_facilities/${careFacility.id}` });
};

const filterStore = useFilterStore();

const setCurrentAvailableCapacity = (capacity: number) => {
  if (filterStore.currentAvailableCapacity === capacity) {
    filterStore.currentAvailableCapacity = null;
  } else {
    filterStore.currentAvailableCapacity = capacity;
  }

  filterStore.loadFilteredResults();
  if (filterStore.filteredResults.length === 0) {
    filterStore.currentAvailableCapacity = null;
  }
  filterStore.loadFilteredResults();
};

const showCareFacilityInMap = async (careFacilityId: string) => {
  emit("showOnMap");
  window.scrollTo({
    behavior: "smooth",
    top: 0,
  });

  setTimeout(() => {
    filterStore.mapFilter = careFacilityId;
    filterStore.loadFilteredResults();
  }, 100);
};

const toggleFilterSort = () => {
  filterStore.toggleSort();
};
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.icon
  width: 1.25rem
.item
  background: #FFFFFF
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
  border-radius: 20px
  padding: 20px
  margin-bottom: 1rem

  .item-row
    @include md
      .action
        flex: 1
        a
          width: 100%

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
      // gap: 0.5rem

.disabled-filter
  opacity: 0.5

.enable-filter
  opacity: 1

.selected-filter
  border: 1px solid $mid-grey
  border-radius: 20px
</style>
