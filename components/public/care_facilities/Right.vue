<template>
  <div class="box flex-column is-dark-grey pa-5">
    <span
      class="is-primary general-font-size is-uppercase font-weight-medium mb-6"
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
    <div v-if="careFacility?.street || careFacility?.zip || careFacility?.town">
      <div class="py-3">
        <span class="d-flex align-center">
          <img
            class="mr-2 icon"
            :src="iconAddress"
            v-if="
              careFacility?.street && careFacility?.zip && careFacility?.town
            "
          />
          <span class="is-dark-grey general-font-size">{{
            careFacility.street
          }}</span>
        </span>
        <div
          v-if="careFacility?.additional_address_info"
          class="aditional-info"
        >
          <v-icon class="mr-2"></v-icon>
          <span class="mr-2 is-dark-grey general-font-size">
            {{ careFacility?.additional_address_info }}
          </span>
        </div>

        <div>
          <v-icon class="mr-2" color="primary"></v-icon>
          <span class="is-dark-grey general-font-size"
            >{{ careFacility.zip }} {{ careFacility.town }}</span
          >
        </div>
      </div>
    </div>
    <div
      v-if="careFacility?.phone"
      class="py-3 d-flex flex-column justify-center"
    >
      <span class="d-flex align-center">
        <img class="mr-2 icon" :src="iconPhone" />
        <a
          class="is-dark-grey general-font-size"
          :href="`tel:${careFacility.phone}`"
          >{{ careFacility.phone }}</a
        >
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
      <h3
        class="is-primary is-uppercase general-font-size font-weight-medium mb-1"
      >
        <span v-if="careFacility?.kind === 'course'"> Kursleitung </span>
        <span v-else> Veranstalter </span>
      </h3>
      <span class="is-dark-grey general-font-size">
        {{ careFacility.name_instructor }}
      </span>
    </div>
    <div
      class="mt-3"
      v-if="careFacility?.kind === 'facility' && careFacility?.opening_hours"
    >
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
            <td
              class="py-3 is-dark-grey general-font-size"
              v-if="opening.hours.length"
            >
              {{ opening?.hours }}
            </td>
            <td class="py-3 is-dark-grey general-font-size" v-else>
              keine Angabe
            </td>
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
    <div>
      <div
        class="is-primary general-font-size is-uppercase font-weight-medium mb-6 is-clickable"
      >
        <v-btn
          variant="flat"
          class="general-font-size"
          color="primary"
          rounded="pill"
          size="large"
          width="100%"
          @click="showImprint = !showImprint"
        >
          <span> Impressumsangaben der Einrichtung </span>
        </v-btn>
      </div>
      <div v-auto-animate v-if="showImprint" class="general-font-size">
        <div v-if="careFacility?.kind !== 'facility'">
          <div v-for="(facility, index) in facilityDetails" :key="index">
            <div v-if="facility.authorized_represent_name">
              <span class="is-primary font-weight-bold"
                >Vor- und Nachname der vertretungsberechtigen und
                verantwortlichen Person</span
              >
              <div>{{ facility.authorized_represent_name }}</div>
            </div>
            <v-divider
              v-if="facility?.commercial_register_number"
              class="my-2"
            ></v-divider>
            <div v-if="facility.commercial_register_number">
              <span class="is-primary font-weight-bold"
                >Registernummer (z.B. Handelsregister)</span
              >
              <div>{{ facility.commercial_register_number }}</div>
            </div>
            <v-divider
              v-if="facility.associated_chamber"
              class="my-2"
            ></v-divider>
            <div v-if="facility.associated_chamber">
              <span class="is-primary font-weight-bold">Zugehörige Kammer</span>
              <div>{{ facility.associated_chamber }}</div>
            </div>
            <v-divider
              v-if="facility.doctor_associations"
              class="my-2"
            ></v-divider>
            <div v-if="facility.doctor_associations">
              <span class="is-primary font-weight-bold"
                >Kassenärztliche Vereinigung</span
              >
              <div>{{ facility.doctor_associations }}</div>
            </div>
            <v-divider
              v-if="facility.professional_title"
              class="my-2"
            ></v-divider>
            <div v-if="facility.professional_title">
              <span class="is-primary font-weight-bold"
                >Gesetzliche Berufsbezeichnung</span
              >
              <div>{{ facility.professional_title }}</div>
            </div>
            <v-divider
              v-if="facility.tax_identification_number"
              class="my-2"
            ></v-divider>
            <div v-if="facility.tax_identification_number">
              <span class="is-primary font-weight-bold"
                >Umsatzsteueridentifikationsnummer</span
              >
              <div>{{ facility.tax_identification_number }}</div>
            </div>
            <v-divider
              v-if="facility.professional_regulations"
              class="my-2"
            ></v-divider>

            <div v-if="facility.professional_regulations">
              <span class="is-primary font-weight-bold"
                >Bezeichnung der berufsrechtlichen Regelungen und wie diese
                zugänglich sind</span
              >
              <div>{{ facility.professional_regulations }}</div>
            </div>
            <v-divider
              v-if="facility.professional_designation"
              class="my-2"
            ></v-divider>
            <div v-if="facility.professional_designation">
              <span class="is-primary font-weight-bold">
                Berufsrechtliche Regelungen (z.B. Berufsordnung für Ärzte als
                Link)</span
              >
              <div>{{ facility.professional_designation }}</div>
            </div>
          </div>
        </div>

        <div v-if="careFacility?.authorized_represent_name">
          <span class="is-primary font-weight-bold"
            >Vor- und Nachname der vertretungsberechtigen und verantwortlichen
            Person</span
          >

          <div>
            {{ careFacility.authorized_represent_name }}
          </div>
        </div>
        <v-divider
          v-if="careFacility?.commercial_register_number?.length > 1"
          class="my-2"
        ></v-divider>
        <div v-if="careFacility?.commercial_register_number?.length > 1">
          <span class="is-primary font-weight-bold"
            >Registernummer (z.B. Handelsregister)</span
          >
          <div>
            {{ careFacility.commercial_register_number }}
          </div>
        </div>
        <v-divider
          v-if="careFacility?.associated_chamber"
          class="my-2"
        ></v-divider>
        <div v-if="careFacility?.associated_chamber">
          <span class="is-primary font-weight-bold">Zugehörige Kammer</span>
          <div>
            {{ careFacility.associated_chamber }}
          </div>
        </div>
        <v-divider
          v-if="careFacility?.doctor_associations"
          class="my-2"
        ></v-divider>
        <div v-if="careFacility?.doctor_associations">
          <span class="is-primary font-weight-bold"
            >Kassenärztliche Vereinigung</span
          >
          <div>
            {{ careFacility.doctor_associations }}
          </div>
        </div>
        <v-divider
          v-if="careFacility?.professional_title"
          class="my-2"
        ></v-divider>
        <div v-if="careFacility?.professional_title">
          <span class="is-primary font-weight-bold"
            >Gesetzliche Berufsbezeichnung</span
          >
          <div>
            {{ careFacility.professional_title }}
          </div>
        </div>
        <v-divider
          v-if="careFacility?.tax_identification_number"
          class="my-2"
        ></v-divider>
        <div v-if="careFacility?.tax_identification_number">
          <span class="is-primary font-weight-bold"
            >Umsatzsteueridentifikationsnummer</span
          >
          <div>
            {{ careFacility.tax_identification_number }}
          </div>
        </div>
        <v-divider
          v-if="careFacility?.professional_regulations"
          class="my-2"
        ></v-divider>
        <div v-if="careFacility?.professional_regulations">
          <span class="is-primary font-weight-bold">
            Bezeichnung der berufsrechtlichen Regelungen und wie diese
            zugänglich sind</span
          >

          <div>
            {{ careFacility.professional_regulations }}
          </div>
        </div>
        <v-divider
          v-if="careFacility?.professional_designation"
          class="my-2"
        ></v-divider>
        <div v-if="careFacility?.professional_designation">
          <span class="is-primary font-weight-bold">
            Berufsrechtliche Regelungen (z.B. Berufsordnung für Ärzte als
            Link)</span
          >
          <div>
            {{ careFacility.professional_designation }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import facilityIcon from "~/assets/icons/facilityTypes/facilities_green.svg";
import iconPhone from "@/assets/icons/facilities/icon_phone.svg";
import iconMail from "@/assets/icons/facilities/icon_mail.svg";
import iconAddress from "@/assets/icons/facilities/icon_address.svg";
const props = defineProps({
  careFacility: {
    type: Object,
    required: true,
  },
});

const facilityDetails = computed(() => {
  if (!props.careFacility?.user?.care_facilities) return [];

  return props.careFacility.user.care_facilities
    .filter((item: any) => item.kind === "facility")
    .map((item: any) => ({
      authorized_represent_name: item.authorized_represent_name,
      commercial_register_number: item.commercial_register_number,
      associated_chamber: item.associated_chamber,
      doctor_associations: item.doctor_associations,
      professional_title: item.professional_title,
      tax_identification_number: item.tax_identification_number,
      professional_regulations: item.professional_regulations,
      professional_designation: item.professional_designation,
    }));
});

const showImprint = ref(false);

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
  width: 1.50rem

.aditional-info
  width: 100%
  display: flex
  flex-wrap: nowrap
</style>
