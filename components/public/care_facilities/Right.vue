<template>
  <div class="box flex-column text-dark-grey font-weight-bold pa-5">
    <h2 class="is-primary is-uppercase mb-6">Kontakt und Infos</h2>
    <div v-if="careFacility?.phone" class="py-3">
      <span>
        <v-icon class="mr-2" color="primary">mdi-phone-outline</v-icon>
        <a :href="`tel:${careFacility.phone}`">{{ careFacility.phone }}</a>
      </span>
    </div>
    <div v-if="careFacility?.email" class="py-1">
      <span>
        <v-icon class="mr-2" color="primary">mdi-email-outline</v-icon>
        <a :href="`mailto:${careFacility.email}`">{{ careFacility.email }}</a>
      </span>
    </div>
    <div
      v-if="careFacility?.street || careFacility?.zip || careFacility?.town"
      class="py-1"
    >
      <div class="py-4">
        <div>
          <v-icon color="primary">mdi-map-marker-outline</v-icon>
          <span>{{ careFacility.street }}</span>
        </div>
        <div v-if="careFacility?.additional_address_info">
          <v-icon></v-icon>
          <span>
            {{ careFacility?.additional_address_info }}
          </span>
        </div>

        <div>
          <v-icon color="primary"></v-icon>
          <span>{{ careFacility.zip }} {{ careFacility.town }}</span>
        </div>
      </div>
    </div>
    <div v-if="careFacility?.name_instructor" class="py-4">
      <h3 class="is-primary is-uppercase mb-1"><span v-if="careFacility.kind === 'course'">
        Kursleitung
        </span>
        <span v-else>
          Veranstalter
        </span>
        </h3>
      <span>
        {{ careFacility.name_instructor }}
      </span>
    </div>
    <div class="mt-3" v-if="careFacility?.kind === 'facility'">
      <v-table density="compact">
        <tbody>
          <h3 class="is-primary is-uppercase mb-1">Offnungszeiten</h3>
          <tr v-for="opening in careFacility.opening_hours" :key="opening.day">
            <td class="py-3 is-primary">{{ opening.day }}</td>
            <td class="py-3" v-if="opening.hours.length">
              {{ opening.hours }}
            </td>
            <td class="py-3" v-else>keine Angabe</td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <div class="my-4" v-if="careFacility?.website">
      <v-btn
        append-icon="mdi-open-in-new"
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

const buttonHref = computed(() => {
  if (!props.careFacility) return null;

  if (props.careFacility.website) {
    if (
      props.careFacility.website.includes("http://") ||
      props.careFacility.website.includes("https://")
    ) {
      return props.careFacility.website;
    } else return "https://" + props.careFacility.website;
  }

  return null;
});
</script>

<style lang="sass" scoped>
.box
  background: white
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
  border-radius: 20px
  padding: 20px
</style>
