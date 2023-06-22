<template>
  <div class="component">
    {{ address }}
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
  const { data } = await axios.get(`https://geocode.maps.co/reverse?lat=${props.lat}&lon=${props.long}`);

  address.value = data.display_name;
};

onMounted(() => {
  setAddress();
});
</script>

<style lang="scss" scoped></style>
