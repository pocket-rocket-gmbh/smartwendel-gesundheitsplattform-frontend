<template>
  <v-container class="facility-wrapper limited offset" v-if="!loading">
    <v-btn prepend-icon="mdi-chevron-left" @click="goBack()"> Zurück zur Suche </v-btn>
    <PublicCareFacilitiesImages :care-facility="careFacility" />
    <v-row class="row">
      <v-col class="column">
        <PublicCareFacilitiesMain :care-facility="careFacility" />
      </v-col>
      <v-col md="4" v-if="careFacility?.kind !== 'news'">
        <PublicCareFacilitiesRight :care-facility="careFacility" />
        <div class="mt-5" v-if="careFacility?.kind === 'course', 'event'">
          <PublicCareFacilitiesDates :care-facility="careFacility" />
        </div>
        <div class="mt-5">
          <PublicCareFacilitiesDocuments :care-facility="careFacility" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { Facility } from "~/store/searchFilter";

const route = useRoute();
const router = useRouter();
const careFacility = ref<Facility>();
const loading = ref(true);

const careFacilityId = computed(() => {
  return route.params.id;
});

const goBack = () => {
  if(careFacility.value.kind === "news") {
    router.push({ path: "/public/search/news" });
  }
  if(careFacility.value.kind === "event") {
    router.push({ path: "/public/search/events" });
  }
  if(careFacility.value.kind === "course") {
    router.push({ path: "/public/search/courses" });
  }
  if(careFacility.value.kind === "facility") {
    router.push({ path: "/public/search/facilities" });
  }
};

const showApi = useCollectionApi();
showApi.setBaseApi(usePublicApi());

const getCareFacility = async () => {
  showApi.setEndpoint(`care_facilities/${careFacilityId.value}`);

  loading.value = true;
  await showApi.getItem();
  loading.value = false;
  careFacility.value = showApi.item.value;
};

onMounted(() => {
  getCareFacility();
  console.log(careFacility)
});
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main";

.facility-wrapper {
  margin: 0 auto;
  margin-top: 4rem;

  @include md {
    margin: 0;
    padding: 1rem !important;
  }

  .row {
    .column {
      @include md {
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>
