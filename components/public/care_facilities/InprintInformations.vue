<template>
  <v-btn
    variant="flat"
    color="primary"
    rounded="pill"
    size="x-large"
    :width="careFacility?.kind !== 'news' ? '100%' : ''"
    @click="showImprint = !showImprint"
  >
    <span> Impressumsangaben der Einrichtung </span>
  </v-btn>

  <div v-auto-animate v-if="showImprint" class="general-font-size mt-3">
    <div v-if="facilityDetails?.length">
      <div v-for="(facility, index) in facilityDetails" :key="index">
        <div v-if="facility.authorized_represent_name">
          <span class="is-primary font-weight-bold">Vertretungsberechtigte Person</span>
          <div>{{ facility.authorized_represent_name }}</div>
        </div>
        <v-divider v-if="facility?.commercial_register_number" class="my-2"></v-divider>
        <div v-if="facility.commercial_register_number">
          <span class="is-primary font-weight-bold">Registernummer</span>
          <div>{{ facility.commercial_register_number }}</div>
        </div>
        <v-divider v-if="facility.associated_chamber" class="my-2"></v-divider>
        <div v-if="facility.associated_chamber">
          <span class="is-primary font-weight-bold">Zuständige Kammer</span>
          <div>{{ facility.associated_chamber }}</div>
        </div>
        <v-divider v-if="facility.professional_title" class="my-2"></v-divider>
        <div v-if="facility.professional_title">
          <span class="is-primary font-weight-bold">Gesetzliche Berufsbezeichnung</span>
          <div>{{ facility.professional_title }}</div>
        </div>
        <v-divider v-if="facility.tax_identification_number" class="my-2"></v-divider>
        <div v-if="facility.tax_identification_number">
          <span class="is-primary font-weight-bold"
            >Umsatzsteueridentifikationsnummer</span
          >
          <div>{{ facility.tax_identification_number }}</div>
        </div>
        <v-divider v-if="facility.professional_regulations" class="my-2"></v-divider>

        <div v-if="facility.professional_regulations">
          <span class="is-primary font-weight-bold"
            >Bezeichnung der berufsrechtlichen Regelungen und wie diese zugänglich
            sind</span
          >
          <div>{{ facility.professional_regulations }}</div>
        </div>
        <v-divider v-if="facility.professional_designation" class="my-2"></v-divider>
        <div v-if="facility.professional_designation">
          <span class="is-primary font-weight-bold">
            Berufsrechtliche Regelungen (z.B. Berufsordnung für Ärzte als Link)</span
          >
          <div>{{ facility.professional_designation }}</div>
        </div>

        //

        <v-divider v-if="facility.register_court" class="my-2"></v-divider>
        <div v-if="facility.register_court">
          <span class="is-primary font-weight-bold">
            Berufsrechtliche Regelungen (z.B. Berufsordnung für Ärzte als Link)</span
          >
          <div>{{ facility.register_court }}</div>
        </div>

        <v-divider v-if="facility.awarded_in" class="my-2"></v-divider>
        <div v-if="facility.awarded_in">
          <span class="is-primary font-weight-bold">
            Berufsrechtliche Regelungen (z.B. Berufsordnung für Ärzte als Link)</span
          >
          <div>{{ facility.awarded_in }}</div>
        </div>

        <v-divider
          v-if="facility.responsible_supervisory_authority"
          class="my-2"
        ></v-divider>
        <div v-if="facility.responsible_supervisory_authority">
          <span class="is-primary font-weight-bold">
            Berufsrechtliche Regelungen (z.B. Berufsordnung für Ärzte als Link)</span
          >
          <div>{{ facility.responsible_supervisory_authority }}</div>
        </div>

        <v-divider v-if="facility.management_name" class="my-2"></v-divider>
        <div v-if="facility.management_name">
          <span class="is-primary font-weight-bold">
            Berufsrechtliche Regelungen (z.B. Berufsordnung für Ärzte als Link)</span
          >
          <div>{{ facility.management_name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  careFacility: {
    type: Object,
    required: true,
  },
});

const showImprint = ref(false);

const facilityDetails = computed(() => {
  if (!props.careFacility?.user?.care_facilities) return;
  return props.careFacility?.user?.care_facilities
    .filter((item: any) => item.kind === "facility")
    .map((item: any) => ({
      authorized_represent_name: item.authorized_represent_name,
      commercial_register_number: item.commercial_register_number,
      associated_chamber: item.associated_chamber,
      professional_title: item.professional_title,
      tax_identification_number: item.tax_identification_number,
      professional_regulations: item.professional_regulations,
      professional_designation: item.professional_designation,
      register_court: item.register_court,
      awarded_in: item.awarded_in,
      responsible_supervisory_authority: item.responsible_supervisory_authority,
      management_name: item.management_name,
    }));
});
</script>
<style lang="sass" scoped>
@import "@/assets/sass/main"
</style>
