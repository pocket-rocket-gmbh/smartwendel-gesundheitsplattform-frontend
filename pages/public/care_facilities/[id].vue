<template>
  <div class="facility-wrapper limited offset content-wrapper" v-if="!loading">
    <v-btn prepend-icon="mdi-chevron-left" @click="goBack()"> Zurück zur Suche </v-btn>
    <div v-if="careFacility?.kind === 'news'" class="mt-8">
      <img :src="careFacility?.image_url" class="news-image" />
      <div class="mb-3">
        <v-row>
          <v-col class="bar-content d-flex justify-space-between pa-0 mb-3">
            <div>
              <span class="pr-1"
                ><v-icon color="primary">mdi-clock-time-three-outline</v-icon></span
              >
              <span>{{ useDatetime().parseDatetime(careFacility.created_at) }}</span>
            </div>
            <div
              class="d-flex align-center facility-name is-clickable"
              v-if="careFacility?.user_care_facility?.name"
            >
              <a
                :href="`/public/care_facilities/${careFacility?.user_care_facility?.id}`"
                class="is-clickable d-flex"
              >
                <v-icon color="primary" class="facility-name">mdi-home-outline</v-icon>
                <span
                  class="break-title facility-name"
                  v-html="careFacility?.user_care_facility?.name"
                ></span>
              </a>
            </div>
            <div class="bar-item" v-if="careFacility?.name_instructor">
              <span class="px-1"><v-icon color="primary">mdi-account</v-icon></span>
              <span>{{ careFacility?.name_instructor }}</span>
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
    <v-row class="row">
      <v-col sm="12" md="8" class="order-last order-md-first">
        <PublicCareFacilitiesMain
          v-if="careFacility?.kind !== 'news'"
          :care-facility="careFacility"
        />
      </v-col>
      <v-col md="4" sm="12" v-if="careFacility?.kind !== 'news'">
        <PublicCareFacilitiesRight
          :class="[breakPoints.width.value < 960 ? 'mt-10' : 'down']"
          :care-facility="careFacility"
        />
        <div class="mt-5" v-if="(careFacility?.kind === 'course', 'event')">
          <PublicCareFacilitiesDates :care-facility="careFacility" />
        </div>
        <div class="mt-5">
          <PublicCareFacilitiesDocuments :care-facility="careFacility" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { Facility } from "~/store/searchFilter";
import { useBreakpoints } from "~/composables/ui/breakPoints";

const breakPoints = useBreakpoints();

const route = useRoute();
const router = useRouter();
const careFacility = ref<Facility>();
const loading = ref(true);

const careFacilityId = computed(() => {
  return route.params.id;
});

const goBack = () => {
  if (careFacility.value.kind === "news") {
    router.push({ path: "/public/search/news" });
  }
  if (careFacility.value.kind === "event") {
    router.push({ path: "/public/search/events" });
  }
  if (careFacility.value.kind === "course") {
    router.push({ path: "/public/search/courses" });
  }
  if (careFacility.value.kind === "facility") {
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

const myTitle = ref("");

const getFacilityDescription = async () => {
  await getCareFacility();
  return careFacility.value?.description;
};
const getFacilityTitle = async () => {
  await getCareFacility();
  return myTitle.value;
};
const getFacilityImage = async () => {
  await getCareFacility();
  return careFacility.value?.image_url;
};
useHead({
  title: myTitle,
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
  @include md {
    gap: 1rem;
    display: flex;
    flex-direction: column;
  }
}
</style>
