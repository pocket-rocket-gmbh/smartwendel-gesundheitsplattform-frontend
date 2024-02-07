<template>
  <div class="box flex-column is-secondary-color pa-5">
    <div class="is-primary general-font-size is-uppercase">Pflegeangebote</div>
    <div class="is-secondary-color general-font-size mb-6">
      zuletzt aktualisiert: 02.12.2023
    </div>

    <v-row no-gutters v-for="places in freePlaces">
      <v-col class="d-flex flex-column justify-center align-center">
        <div class="is-primary general-font-size">{{ places.title }}</div>
        <div class="is-secondary-color general-font-size">
          {{ places.description }}
        </div>
        <div class="is-primary-color general-font-size mt-5">
          <v-icon color="success">mdi-circle</v-icon>
          <span class="ml-2">Plätze verfügbar</span>
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

const freePlaces = [
  {
    title: "Betreutes Wohnen",
    description: "Rollstuhlgerecht, Einzelappartement",
  },
  {
    title: "Kurzzeitpflege",
    description: "Rollstuhlgerecht, Einzelzimmer",
  },
  {
    title: "Ambulante Pflege",
    description: "",
  },
];
</script>

<style lang="sass" scoped>
.box
  background: white
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
  border-radius: 20px
  padding: 20px
</style>
