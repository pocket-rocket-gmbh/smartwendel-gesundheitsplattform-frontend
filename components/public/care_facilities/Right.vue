<template>
  <div class="box flex-column is-dark-grey pa-5">
    <span class="is-primary general-font-size is-uppercase font-weight-medium mb-6">Kontakt und Infos</span>
    <div v-if="careFacility?.phone" class="py-3 d-flex flex-column justify-center">
      <span class="d-flex align-center">
        <img class="mr-2 icon" :src="iconPhone" />
        <a class="is-dark-grey general-font-size" :href="`tel:${careFacility.phone}`">{{ careFacility.phone }}</a>
      </span>
    </div>
    <div v-if="careFacility?.email" class="py-3">
      <span class="d-flex align-center">
        <img class="mr-2 icon" :src="iconMail" />
        <a class="is-dark-grey general-font-size" :href="`mailto:${careFacility.email}`">{{ careFacility.email }}</a>
      </span>
    </div>
    <div v-if="careFacility?.street || careFacility?.zip || careFacility?.town">
      <div class="py-3">
        <span class="d-flex align-center">
          <img class="mr-2 icon" :src="iconAddress" />
          <span class="is-dark-grey general-font-size">{{ careFacility.street }}</span>
        </span>
        <div v-if="careFacility?.additional_address_info">
          <v-icon></v-icon>
          <span class="mr-2 is-dark-grey general-font-size">
            {{ careFacility?.additional_address_info }}
          </span>
        </div>

        <div>
          <v-icon class="mr-1" color="primary"></v-icon>
          <span class="is-dark-grey general-font-size">{{ careFacility.zip }} {{ careFacility.town }}</span>
        </div>
      </div>
    </div>
    <div v-if="careFacility?.name_instructor" class="py-4">
      <h3 class="is-primary is-uppercase general-font-size font-weight-medium mb-1">
        <span v-if="careFacility.kind === 'course'"> Kursleitung </span>
        <span v-else> Veranstalter </span>
      </h3>
      <span class="is-dark-grey general-font-size">
        {{ careFacility.name_instructor }}
      </span>
    </div>
    <div class="mt-3" v-if="careFacility?.kind === 'facility' && careFacility.location">
      <v-table density="compact">
        <tbody>
          <h3 class="is-primary is-dark-grey general-font-size font-weight-medium is-uppercase mb-1">Öffnungszeiten</h3>
          <tr v-for="opening in careFacility.opening_hours" :key="opening.day">
            <td class="py-3 is-primary is-dark-grey general-font-size">{{ opening.day }}</td>
            <td class="py-3 is-dark-grey general-font-size" v-if="opening.hours.length">
              {{ opening.hours }}
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
import iconPhone from "@/assets/icons/facilities/icon_phone.svg";
import iconMail from "@/assets/icons/facilities/icon_mail.svg";
import iconAddress from "@/assets/icons/facilities/icon_address.svg";
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

.icon
  width: 1.25rem

</style>
