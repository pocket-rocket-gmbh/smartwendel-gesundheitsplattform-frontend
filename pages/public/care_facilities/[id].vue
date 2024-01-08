<template>
  <div class="facility-wrapper limited offset content-wrapper" v-if="!loading">
    <v-btn
      prepend-icon="mdi-chevron-left"
      class="general-font-size"
      size="large"
      @click="goBack()"
    >
      Zurück zur Suche
    </v-btn>
    <div v-if="careFacility?.kind === 'news'" class="mt-8">
      <img :src="careFacility?.image_url" class="news-image" />
      <div class="mb-3">
        <v-row>
          <v-col cols="12" md="4" sm="12" class="bar-content d-flex justify-space-between pa-0 mb-3">
            <div class="d-flex align-center">
              <img class="icon mb-1" :src="eventIcon" />
              <span class="general-font-size is-dark-grey pl-3">{{
                useDatetime().parseDatetime(careFacility.created_at)
              }}</span>
            </div>
          </v-col>
            <v-col cols="12" md="4" sm="12" class="bar-content d-flex justify-space-between pa-0 mb-3">
              <div
              class="d-flex align-center facility-name is-clickable"
              v-if="careFacility?.user_care_facility?.name"
            >
              <a
                :href="`/public/care_facilities/${careFacility?.user_care_facility?.id}`"
                class="is-clickable d-flex general-font-size is-dark-grey"
              >
                <img class="icon mb-1" :src="facilityIcon" />
                <span
                  class="break-title facility-name pl-3"
                  v-html="careFacility?.user_care_facility?.name"
                ></span>
              </a>
            </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" class="bar-content d-flex justify-space-between pa-0 mb-3">

              <div class="bar-item" v-if="careFacility?.name_responsible_person">
              <div class="d-flex align-center">
                <img class="icon mb-1" :src="personIcon" />
                <span class="general-font-size is-dark-grey pl-3 break-title">{{
                  careFacility?.name_responsible_person
                }}</span>
              </div>
            </div>
            </v-col>
          


          <v-divider class="my-1 mb-3"></v-divider>
        </v-row>
      </div>
      <p class="general-font-size text-description" v-html="careFacility.description"></p>
    </div>
    <PublicCareFacilitiesImages
      :care-facility="careFacility"
      v-if="careFacility?.kind !== 'news'"
    />
    <div
      class="d-md-none d-sm-block"
      :class="[careFacility?.logo_url ? ' mt-10 pt-15' : 'mt-5']"
    >
      <span class="general-font-size font-weight-medium is-dark-grey">{{
        careFacility?.name
      }}</span>
      <v-divider class="my-5"></v-divider>
    </div>

    <v-row class="row">
      <v-col sm="12" md="8" class="order-last order-md-first">
        <PublicCareFacilitiesMain
          v-if="careFacility?.kind !== 'news'"
          :care-facility="careFacility"
        />
        <div class="hidden-md-and-up">
          <div class="mt-5" v-if="(careFacility?.kind === 'course', 'event')">
            <PublicCareFacilitiesDates :care-facility="careFacility" />
          </div>
          <div class="mt-5">
            <PublicCareFacilitiesDocuments :care-facility="careFacility" />
          </div>
        </div>
      </v-col>
      <v-col md="4" sm="12" v-if="careFacility?.kind !== 'news'">
        <PublicCareFacilitiesRight :care-facility="careFacility" />
        <div class="hidden-sm-and-down">
          <div class="mt-5" v-if="(careFacility?.kind === 'course', 'event')">
            <PublicCareFacilitiesDates :care-facility="careFacility" />
          </div>
          <div class="mt-5">
            <PublicCareFacilitiesDocuments :care-facility="careFacility" />
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import type { Facility } from "~/store/searchFilter";
import { useBreakpoints } from "~/composables/ui/breakPoints";
import facilityIcon from "~/assets/icons/facilityTypes/facilities_green.svg";
import eventIcon from "~/assets/icons/facilityTypes/events_green.svg";
import personIcon from "~/assets/icons/icon_person.svg";

const breakPoints = useBreakpoints();

const route = useRoute();
const router = useRouter();
const careFacility = ref<Facility>();
const loading = ref(true);

const careFacilityId = computed(() => {
  return route.params.id;
});

const goBack = () => {
  const backLink = router.options.history.state.back as string;

  if (backLink) {
    router.push({ path: backLink });
  } else {
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

const getFacilityDescription = async () => {
  await getCareFacility();
  return careFacility.value?.description;
};
const getFacilityTitle = async () => {
  await getCareFacility();
  return careFacility.value?.name;
};
const getFacilityImage = async () => {
  await getCareFacility();
  return careFacility.value?.image_url;
};
useHead({
  title: getFacilityTitle(),
  meta: [
    { property: "og:type", content: "Webseite" },
    { name: "description", content: getFacilityDescription() },
    { name: "title", content: getFacilityTitle() },
    { name: "image", content: getFacilityImage() },
  ],
});

onMounted(() => {
  getCareFacility();
});
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main";

.facility-wrapper {
  margin-top: 4rem;

  .row {
    .column {
      @include md {
        display: flex;
        flex-direction: column;
      }
    }
  }
}

.news-image {
  margin: 0 1.25em 0 0;
  width: 50%;
  object-fit: cover;
  border-radius: 20px;
  float: left;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15);
  @include md {
    width: 100%;
    margin-bottom: 2rem;
  }
}

.text-description {
  text-align: justify;
}

.content-wrapper {
  margin: 5rem;
  @include md {
    margin: 1rem;
  }
}

.bar-content {
  gap: 1rem;
  @include md {
    gap: 1rem;
    display: flex;
    flex-direction: column;
  }
}

.icon {
  width: 1.7rem;
}
</style>
