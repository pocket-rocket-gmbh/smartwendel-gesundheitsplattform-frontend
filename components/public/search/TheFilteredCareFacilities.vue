<template>
  <Loading v-if="filterStore.loading" />
  <div
    class="entries general-font-size"
    v-if="!(!filterStore.loading && !sortedResults?.length)"
  >
    <div class="d-flex actions">
      <div
        v-if="filterStore.currentKinds.includes('course') || filterStore.currentKinds.includes('event')"
        class="sort-order is-clickable d-flex align-center"
        @click="toggleFilterSort"
      >
        <img
          :src="coursesIcon"
          class="mr-2 icon is-dark-grey"
        />
        <div class="mt-1">Datum</div>
        <div>
          <v-icon v-show="sortDirection === 'asc' || sortDirection === null">mdi-chevron-down</v-icon>
          <v-icon v-show="sortDirection === 'desc'">mdi-chevron-up</v-icon>
        </div>
      </div>
      <div
        v-if="filterStore.currentKinds.includes('facility')"
        class="sort-order is-clickable d-flex align-center"
        @click="toggleFilterSort"
      >
        <span v-show="sortDirection === 'asc' || sortDirection === null">
          A-Z
          <v-icon>mdi-chevron-down</v-icon></span
        >

        <span v-show="sortDirection === 'desc'">
          Z-A
          <v-icon v-show="sortDirection === 'desc'">mdi-chevron-up</v-icon></span
        >
      </div>
    </div>
    <template v-if="sortedResults.length > 0">
      <div
        v-if="!filterStore.currentKinds.includes('facility')"
        class="boxes"
        :class="{ doubled }"
      >
        <PublicContentBox
          :size="12"
          class=""
          v-for="category in sortedResults"
          :key="category.id"
          :item="category"
        />
      </div>
      <div
        v-else
        class="boxes"
      >
        <div
          class="item"
          v-for="careFacility in sortedResults"
          :key="careFacility.id"
        >
          <v-row class="item-row mb-0 pb-0">
            <v-col
              sm="12"
              md="6"
              class="mb-0 pb-0"
            >
              <div class="d-flex justify-space-between align-center">
                <div class="is-dark-grey font-weight-medium is-clickable">
                  <a
                    class="is-dark-grey"
                    :href="`/public/care_facilities/${careFacility.id}`"
                    >{{ careFacility.name }}</a
                  >
                </div>
                <div class="hidden-md-and-up">
                  <v-icon
                    v-if="careFacility.geocode_address.length || careFacility.locations.length"
                    size="x-large"
                    color="primary"
                    @click="showCareFacilityInMap(careFacility.id, careFacility.name)"
                    >mdi-map-marker-outline</v-icon
                  >
                </div>
              </div>
            </v-col>
            <v-col
              sm="12"
              md="6"
              class="action d-md-flex justify-end hidden-sm-and-down"
            >
              <a
                :href="careFacility.url"
                @click="goToFacility(careFacility)"
                class="d-inline-block"
              >
                <v-btn
                  variant="flat"
                  class="general-font-size"
                  color="primary"
                  rounded="pill"
                  size="large"
                >
                  <span> Details ansehen </span>
                </v-btn>
              </a>
            </v-col>
          </v-row>

          <v-row class="item-row">
            <v-col
              cols="12"
              md="6"
              sm="6"
              xl="6"
              xs="12"
              class="mb-0 pb-0"
            >
              <div class="is-dark-grey mt-4">
                <div class="d-flex">
                  <img
                    class="mr-2 icon"
                    :src="iconAddress"
                  />
                  <div v-if="careFacility.street">
                    {{ careFacility.street }}
                  </div>
                </div>
                <div
                  class="d-flex ml-n1"
                  v-if="careFacility.zip || careFacility.town"
                >
                  <v-icon></v-icon>
                  {{ careFacility.zip }} {{ careFacility.town }}
                </div>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="6"
              xl="6"
              xs="12"
              class="mb-0 pb-0"
            >
              <div class="mt-4">
                <div
                  v-if="careFacility.phone"
                  class="d-flex align-center"
                >
                  <img
                    class="mr-2 icon"
                    :src="iconPhone"
                  />
                  <a
                    class="is-dark-grey"
                    :href="`tel:${careFacility.phone}`"
                    >{{ careFacility.phone }}</a
                  >
                </div>
                <div
                  v-if="careFacility.email"
                  class="d-flex align-center"
                >
                  <img
                    class="mr-2 icon"
                    :src="iconMail"
                  />
                  <a
                    class="is-dark-grey"
                    :href="`mailto:${careFacility.email}`"
                    >{{ careFacility.email }}</a
                  >
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              sm="12"
              md="12"
              class="action hidden-md-and-up"
            >
              <a
                :href="careFacility.url"
                :target="careFacility.url_kind === 'external' ? '_blank' : ''"
                @click.prevent="goToFacility(careFacility)"
                style="display: block; width: 100%"
              >
                <v-btn
                  variant="flat"
                  width="100%"
                  class="general-font-size"
                  color="primary"
                  rounded="pill"
                  size="large"
                >
                  <span> Details ansehen </span>
                </v-btn>
              </a>
            </v-col>
          </v-row>
          <div class="hidden-sm-and-down mt-5">
            <v-btn
              v-if="careFacility.geocode_address.length || careFacility.locations.length"
              append-icon="mdi-map-marker-outline"
              size="small"
              class="mt-4 pa-1"
              variant="text"
              color="primary"
              rounded="pill"
              @click="showCareFacilityInMap(careFacility.id, careFacility.name)"
            >
              Auf karte zeigen
            </v-btn>
            <div
              v-else
              class="mt-4 pa-1"
            ></div>
          </div>
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
import { default as coursesIcon } from "~/assets/icons/facilityTypes/events.svg";

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

const showCareFacilityInMap = async (careFacilityId: string, careFacilityName: string) => {
  emit("showOnMap");
  window.scrollTo({
    behavior: "smooth",
    top: 0,
  });

  setTimeout(() => {
    filterStore.mapFilter = careFacilityId;
    filterStore.mapFilterName = careFacilityName;
    filterStore.loadAllResults();
  }, 100);
};

const sortDirection = ref<any>("asc" || "desc");

function parseCustomDateFormat(dateString: any) {
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split(".").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes);
}

const sortedResults = computed(() => {
  if (filterStore.currentKinds.includes("facility")) {
    return filterStore.filteredResults.sort((a: any, b: any) => {
      return sortDirection.value === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
  } else if (filterStore.currentKinds.includes("course") || filterStore.currentKinds.includes("event")) {
    const sortedResultsCopy = [...filterStore.filteredResults];
    if (sortDirection.value === "asc") {
      sortedResultsCopy.sort((a: any, b: any) => parseCustomDateFormat(a.event_dates[0]).valueOf() - parseCustomDateFormat(b.event_dates[0]).valueOf());
    } else {
      sortedResultsCopy.sort((a: any, b: any) => parseCustomDateFormat(b.event_dates[0]).valueOf() - parseCustomDateFormat(a.event_dates[0]).valueOf());
    }
    return sortedResultsCopy;
  }
  return filterStore.filteredResults;
});

const toggleFilterSort = () => {
  if (filterStore.currentKinds.includes("facility")) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else if (filterStore.currentKinds.includes("course") || filterStore.currentKinds.includes("event")) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  }
};

onMounted(() => {
  sortDirection.value = "asc";
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.icon
  width: 1.5rem
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
</style>
