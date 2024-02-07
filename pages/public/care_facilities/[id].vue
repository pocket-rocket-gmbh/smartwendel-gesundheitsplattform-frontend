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
    <PublicCareFacilitiesImages
      :care-facility="careFacility"
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
          :care-facility="careFacility"
        />
        <PublicCareFacilitiesContact :care-facility="careFacility" />
      </v-col>
      <v-col md="4" sm="12">
        <PublicCareFacilitiesRight :care-facility="careFacility" />
        <div class="hidden-sm-and-down">
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
