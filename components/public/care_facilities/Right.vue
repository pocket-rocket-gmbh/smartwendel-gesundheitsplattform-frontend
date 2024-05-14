<template>
  <div class="flex-column is-secondary-color pa-5" :class="searchPage ? '' : 'box'">
    <div class="is-secondary-color is-label-big general-font-size is-uppercase" v-if="!searchPage">
      Pflegeangebote
    </div>
    <div class="is-primary-color general-font-size mb-6" v-if="!searchPage">
      <span>zuletzt aktualisiert: {{ useDatetime().parseDatetime(careFacility.updated_at) }}</span>
    </div>
    <v-row
      no-gutters
      v-for="(place, index) in sortedPlaces.filter((place) => place?.tag_category?.filter_type === 'filter_facility')"
      :key="index"
    >
      <v-col class="d-flex align-center" :class="searchPage ? '' : 'justify-center flex-column'">
        <div class="is-primary-color general-font-size my-2 mr-3 d-flex align-center" v-if="searchPage">
          <v-icon :color="getCapacityColor(place)">mdi-circle</v-icon>
          <span class="ml-2" v-if="!searchPage" :style="{ color: getCapacityColor(place) }">{{ getCapacityText(place) }}</span>
        </div>

        <div class="is-primary general-font-size">{{ place?.tag_category?.name }}</div>
        <div class="is-primary-color general-font-size" v-if="!searchPage">
          <v-icon :color="getCapacityColor(place)">mdi-circle</v-icon>
          <span class="ml-2" :style="{ color: getCapacityColor(place) }">{{ getCapacityText(place) }}</span>
        </div>
      </v-col>

      <v-divider class="my-5" v-if="!searchPage"></v-divider>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  careFacility: {
    type: Object,
    required: true,
  },
  searchPage: {
    type: Boolean,
    required: false,
  },
});

function getCapacityText(place:any) {
  const capacity = place.available_capacity;
  if (capacity === 1) {
    return "Plätze vorhanden";
  } else if (capacity === 2) {
    return "Auf Anfrage";
  } else if (capacity === 3) {
    return "Nicht vorhanden";
  } else {
    return "Plätze unbekannt";
  }
}

function getCapacityColor(place:any) {
  const capacity = place.available_capacity;
  if (capacity === 1) {
    return "green";
  } else if (capacity === 2) {
    return "orange";
  } else if (capacity === 3) {
    return "red";
  } else {
    return "black";
  }
}

const sortedPlaces = computed(() => {
  const places = [...props.careFacility.care_facility_tag_categories];
  places.sort((a, b) => {
    if (a.available_capacity === 1 && b.available_capacity !== 1) {
      return -1;
    } else if (a.available_capacity !== 1 && b.available_capacity === 1) {
      return 1;
    } else {
      return 0;
    }
  });
  return places;
});
</script>

<style lang="sass" scoped>
.box
  background: white
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
  border-radius: 20px
  padding: 20px
</style>
