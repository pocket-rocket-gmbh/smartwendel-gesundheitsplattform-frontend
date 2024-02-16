<template>
  <div class="component is-secondary-color">
    <div v-if="loading">
      <LoadingSpinner></LoadingSpinner>
    </div>
    <div v-else>
      <v-icon>mdi-map-marker</v-icon>
      <span v-if="address?.road"> &nbsp; {{ address?.road }}, </span>
      <span v-if="address?.house_number">
        &nbsp; {{ address?.house_number }},
      </span>
      <span v-if="address?.postcode"> &nbsp; {{ address?.postcode }}</span>
      <span v-if="address?.city_district">
        &nbsp; {{ address?.city_district }},
      </span>
      <span v-if="address?.town"> &nbsp; {{ address?.town }} </span>
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

const loading = ref(false);

const address = ref("");

watch(props, () => {
  setAddress();
  getCareFacility();
});

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());

const getCareFacility = async () => {
  loading.value = true;
  api.setEndpoint(`care_facilities/${props.itemId}`);
  await api.getItem();
  loading.value = false;
};

const setAddress = async () => {
  const { data } = await axios.get(
    `https://geocode.maps.co/reverse?lat=${props.lat}&lon=${props.long}&api_key=65cb46b5a5ab0289110035xqze5103b`
  );
  address.value = data.address;
};

onMounted(() => {
  setAddress();
});
</script>

<style lang="scss" scoped></style>
