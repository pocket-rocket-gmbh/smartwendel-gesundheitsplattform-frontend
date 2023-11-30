<template>
  <div class="component is-dark-grey">
    <v-icon>mdi-map-marker</v-icon>
    <span v-if="address?.road"> &nbsp; {{ address?.road }}, </span>
    <span v-if="address?.house_number"> &nbsp; {{ address?.house_number }}, </span>
    <span v-if="address?.postcode"> &nbsp; {{ address?.postcode }}</span>
    <span v-if="address?.city_district"> &nbsp; {{ address?.city_district }}, </span>
    <span v-if="address?.town"> &nbsp; {{ address?.town }} </span>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";

const props = defineProps<{
  lat: number;
  long: number;
}>();

const address = ref("");

watch(props, () => {
  setAddress();
});

const setAddress = async () => {
  const { data } = await axios.get(
    `https://geocode.maps.co/reverse?lat=${props.lat}&lon=${props.long}`
  );
  address.value = data.address;
};

onMounted(() => {
  setAddress();
});
</script>

<style lang="scss" scoped></style>
