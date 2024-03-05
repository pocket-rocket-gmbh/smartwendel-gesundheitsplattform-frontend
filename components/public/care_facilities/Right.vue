<template>
  <div class="box flex-column is-dark-grey pa-5">
    <span class="is-primary general-font-size is-uppercase font-weight-medium mb-6"
      >Kontakt und Infos</span
    >
    <div
      class="py-3 d-flex flex-column justify-center"
      v-if="careFacility?.kind !== 'facility'"
    >
      <span class="d-flex align-center">
        <img class="mr-2 icon" :src="facilityIcon" />
        <a
          class="is-dark-grey general-font-size pt-1"
          :href="`/public/care_facilities/${careFacility?.user_care_facility.id}`"
          target="blank"
        >
          {{ careFacility?.user_care_facility.name }}</a
        >
      </span>
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
      </div>
    </div>
    <div v-if="careFacility?.phone" class="py-3 d-flex flex-column justify-center">
      <span class="d-flex align-center">
        <img class="mr-2 icon" :src="iconPhone" />
        <a class="is-dark-grey general-font-size" :href="`tel:${careFacility.phone}`">{{
          careFacility.phone
        }}</a>
      </span>
    </div>
    <div v-if="careFacility?.email" class="py-3">
      <span class="d-flex align-center">
        <img class="mr-2 icon" :src="iconMail" />
        <a
          class="is-dark-grey general-font-size"
          :href="`mailto:${careFacility.email}`"
          >{{ careFacility.email }}</a
        >
      </span>
    </div>
    <div v-if="careFacility?.name_instructor" class="py-4">
      <h3 class="is-primary is-uppercase general-font-size font-weight-medium mb-1">
        <span v-if="careFacility?.kind === 'course'"> Kursleitung </span>
        <span v-else> Veranstalter </span>
      </h3>
      <span class="is-dark-grey general-font-size">
        {{ careFacility.name_instructor }}
      </span>
    </div>
    <div class="mt-3" v-if="careFacility?.kind === 'facility' && careFacility?.opening_hours">
      <v-table density="compact">
        <tbody>
          <h3
            class="is-primary is-dark-grey general-font-size font-weight-medium is-uppercase mb-1"
          >
            Öffnungszeiten
          </h3>
          <tr v-for="opening in careFacility?.opening_hours" :key="opening.day">
            <td class="py-3 is-primary is-dark-grey general-font-size">
              {{ opening?.day }}
            </td>
            <td class="py-3 is-dark-grey general-font-size" v-if="opening.hours.length">
              {{ opening?.hours }}
            </td>
            <td class="py-3 is-dark-grey general-font-size" v-else>keine Angabe</td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <div class="my-4" v-if="careFacility?.website">
      <v-btn
        append-icon="mdi-open-in-new"
        class="general-font-size"
        variant="outlined"
        size="large"
        rounded="pill"
        color="primary"
        width="100%"
        :href="buttonHref"
        target="_blank"
      >
        weitere Informationen
      </v-btn>
    </div>
    <div class="my-4">
      <v-btn
        variant="outlined"
        class="general-font-size"
        size="large"
        rounded="pill"
        color="primary"
        width="100%"
        :href="`mailto:${careFacility?.email}`"
      >
        Kontakt aufnehmen
      </v-btn>
    </div>
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
