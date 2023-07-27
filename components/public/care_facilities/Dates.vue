<template>
  <div
    class="box flex-column text-dark-grey font-weight-bold pa-5"
    v-if="careFacility.event_dates"
  >
    <h2 class="is-primary is-uppercase">Termine</h2>
    <p>
      <i>{{ careFacility.event_dates.length }} Termine gefunden</i>
    </p>
    <div class="flex-column">
      <div class="my-3">
        <v-table density="compact" fixed-header height="400px">
          <thead>
            <tr>
              <th class="text-center">Datum</th>
              <th class="text-center">Uhrzeit</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="date in careFacility.event_dates">
              <td class="py-3 text-center">{{ date.slice(0, 10) }}</td>
              <td class="py-3 text-center">
                {{ date.slice(Math.max(date.length - 5, 1)) }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
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
</style>
