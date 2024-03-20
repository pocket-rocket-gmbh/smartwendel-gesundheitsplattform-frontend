<template>
  <div class="component is-dark-grey d-flex">
    <div class="d-flex align-center ga-2">
      <div>
        <v-icon
          :color="!loading ? 'warning' : checkAddress && loading ? 'success' : 'error'"
          >mdi-map-marker</v-icon
        >
      </div>
      <div v-if="!checkAddress">
        <span v-if="!loading"> wird geladen ... </span>
        <span v-else> Adresse kann nicht geladen werden, bitte erneut versuchen</span>
      </div>
      <div v-if="!checkAddress && loading">
        <v-btn
          icon="mdi-reload"
          density="compact"
          @click="setAddress"
          class="is-dark-grey"
          size="small"
        ></v-btn>
      </div>
    </div>
    <div v-if="checkAddress">
      <span v-if="address?.road"> &nbsp; {{ address?.road }}, </span>
      <span v-if="address?.house_number"> &nbsp; {{ address?.house_number }}, </span>
      <span v-if="address?.postcode"> &nbsp; {{ address?.postcode }}</span>
      <span v-if="address?.city_district"> &nbsp; {{ address?.city_district }}, </span>
      <span v-if="address?.town"> &nbsp; {{ address?.town }} </span>
    </div>
    <div v-if="!loading && !checkAddress">
      <LoadingSpinner></LoadingSpinner>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";

const props = defineProps<{
  lat: number;
  long: number;
  itemId: string | null;
}>();

const checkAddress = computed(() => {
  if (
    (!!address.value && !!address.value?.road && !!address.value?.house_number) ||
    !!address.value?.postcode ||
    !!address.value?.city_district ||
    !!address.value?.town
  ) {
    return true;
  }
  return false;
});


const loading = ref(true);

const address = ref<any>({});

watch(props, () => {
  setAddress();
  getCareFacility();
});

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());

const getCareFacility = async () => {
  api.setEndpoint(`care_facilities/${props.itemId}`);
  await api.getItem();
};

const setAddress = async () => {
  setTimeout(async () => {
    loading.value = true;
    const { data } = await axios.get(
      `https://geocode.maps.co/reverse?lat=${props.lat}&lon=${props.long}&api_key=65cb46b5a5ab0289110035xqze5103b`
    );
    address.value = data.address;
    if (!address.value) {
      loading.value = false;
    }
  }, 2000);
  loading.value = false;
};

onMounted(() => {
  setAddress();
});
</script>

<style lang="scss" scoped></style>
