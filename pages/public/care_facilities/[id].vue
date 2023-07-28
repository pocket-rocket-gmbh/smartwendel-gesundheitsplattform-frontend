<template>
  <v-container class="limited offset my-15" v-if="!loading">
    <v-btn prepend-icon="mdi-chevron-left" @click="goBack()">
      Zurück zur Suche
    </v-btn>
    <PublicCareFacilitiesImages :care-facility="careFacility" />
    <v-row>
      <v-col>
        <PublicCareFacilitiesMain :care-facility="careFacility" />
      </v-col>
      <v-col md="4" v-if="careFacility?.kind !== 'news'">
        <PublicCareFacilitiesRight :care-facility="careFacility" />
        <div class="mt-5" v-if="careFacility?.kind === 'course'">
          <PublicCareFacilitiesDates :care-facility="careFacility" />
        </div>
        <div class="mt-5" v-if="careFacility?.kind !== 'news'">
          <PublicCareFacilitiesDocuments :care-facility="careFacility" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const careFacility = ref({});
    const loading = ref(true);

    const careFacilityId = computed(() => {
      return route.params.id;
    });

    const goBack = () => {
      router.push({ path: "/public/search/facilities" });
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
    });
    return {
      careFacility,
      goBack,
      loading,
    };
  },
});
</script>

<style lang="sass" scoped></style>
