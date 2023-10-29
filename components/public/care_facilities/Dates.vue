<template>
  <div
    class="box flex-column is-dark-grey font-weight-medium pa-3"
    v-if="careFacility?.event_dates.length"
  >
    <span class="is-primary is-dark-grey general-font-size font-weight-medium is-uppercase">Termine</span>
    <p class="is-dark-grey general-font-size">
      <i
        >{{ careFacility?.event_dates.length }}
        <span v-if="careFacility?.event_dates.length === 1">
          Termin gefunden
        </span>
        <span v-else> Termine gefunden </span></i
      >
    </p>
    <div class="my-3 is-dark-grey general-font-size">
      <v-table density="compact" fixed-header>
        <thead>
          <tr class="is-dark-grey general-font-size">
            <th class="text-center">Datum</th>
            <th class="text-center">Uhrzeit</th>
            <th class="text-center">Dauer</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="date in careFacility?.event_dates">
            <td class="py-0 text-center">{{ date.slice(0, 10) }}</td>
            <td class="py-0 text-center">
              {{ date.slice(Math.max(date.length - 5, 1)) }} Uhr
            </td>
            <td class="text-center">{{ careFacility?.event_duration }} Std.</td>
          </tr>
        </tbody>
      </v-table>
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
</script>

<style lang="sass" scoped>
.box
  background: white
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
  border-radius: 20px
  padding: 20px


th
  color: #58595E!important
  font-weight: 300!important

tr
  color: #58595E!important
  font-weight: 300!important
</style>
