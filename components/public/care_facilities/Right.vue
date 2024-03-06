<template>
  <div class="box flex-column is-secondary-color pa-5">
    <div class="is-secondary-color is-label-big general-font-size is-uppercase">
      Pflegeangebote
    </div>
    <div class="is-secondary-color general-font-size mb-6">
      <pre>{{ careFacility.care_facility_tag_categories }}</pre>
    </div>

    <v-row
      no-gutters
      v-for="(places, index) in careFacility.care_facility_tag_categories"
      :key="index"
    >
      <v-col class="d-flex flex-column justify-center align-center">
        <div class="is-primary general-font-size">
          {{ places?.tag_category?.name }}
        </div>
        <div class="is-primary-color general-font-size mt-5">
          <v-icon :color="capacityColor[index]">mdi-circle</v-icon>
          <span class="ml-2" :style="{ color: capacityColor[index] }">
            {{ capacityText[index] }}
          </span>
        </div>
      </v-col>
      <v-divider class="my-5"></v-divider>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  careFacility: {
    type: Object,
    required: true,
  },
});

const capacityColor = computed(() => {
  return props.careFacility.care_facility_tag_categories.map((place: any) => {
    const capacity = place.available_capacity;
    if (capacity === 1) {
      return "red";
    } else if (capacity === 2) {
      return "orange";
    } else if (capacity === 3) {
      return "green";
    } else {
      return "black";
    }
  });
});

const capacityText = computed(() => {
  return props.careFacility.care_facility_tag_categories.map((place: any) => {
    const capacity = place.available_capacity;
    if (capacity === 1) {
      return "Keine Plätze vorhanden";
    } else if (capacity === 2) {
      return "Platz auf Nachfrage";
    } else if (capacity === 3) {
      return "Plätze vorhanden";
    } else {
      return "Plätze unbekannt";
    }
  });
});
</script>

<style lang="sass" scoped>
.box
  background: white
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
  border-radius: 20px
  padding: 20px
</style>
