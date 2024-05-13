<template>
  <div class="main-wrapper">
    <v-row class="heading">
      <v-col class="d-flex align-center">
        <span
          class="general-font-size text-h4 font-weight-medium is-dark-grey d-md-block d-none text-wrap"
          >{{ careFacility?.name }}</span
        >
        <span v-if="careFacility?.billable_through_health_insurance_approved">
          <v-icon size="x-large" class="pl-8" color="primary"
            >mdi-check-decagram-outline</v-icon
          >
        </span>
      </v-col>
    </v-row>
    <v-divider
      class="my-5 d-md-block d-none"
      v-if="careFacility?.description"
    ></v-divider>
    <v-btn @click="createEditDialogOpen = true">beschweren <v-icon class="ml-2" size="x-large" color="red">mdi-emoticon-angry-outline</v-icon></v-btn>
    <PublicComplaintModal
      v-if="createEditDialogOpen"
      @close="createEditDialogOpen = false"
      @click:outside="createEditDialogOpen = false"
    />
    <span
      class="is-primary mr-2"
      v-if="careFacility?.kind === 'news'"
      v-for="tags in careFacility.tag_categories"
    >
      <span>{{ tags.name }}</span>
    </span>
    <div class="mt-4">
      <ClientOnly>
        <PublicTextTooltipWrap
          v-if="careFacility?.description"
          class="pr-5 is-dark-grey description text-wrap"
          :text="
            careFacility?.description.replace(
              '<p><br></p><p><br></p>',
              '<p><br></p>'
            )
          "
        />
      </ClientOnly>
      <div
        v-if="!careFacility?.description"
        class="is-dark-grey general-font-size"
      >
        <i>
          <b>Beispieltext: </b>
          Unsere Gesundheitseinrichtung ist ein Ort, der sich dem Wohlbefinden
          und der Fürsorge für alle Menschen verschrieben hat. Mit einem
          ganzheitlichen Ansatz bieten wir eine breite Palette von
          Dienstleistungen und Einrichtungen, die darauf abzielen, deine
          Gesundheit und dein Wohlbefinden zu fördern. Unsere hochqualifizierten
          Fachkräfte, darunter Ärzte, Krankenschwestern, Therapeuten und
          Pflegepersonal, stehen dir zur Seite, um eine individuelle Betreuung
          zu gewährleisten. Wir bieten Diagnose, Behandlung und Prävention für
          eine Vielzahl von Gesundheitsproblemen und Krankheiten, von der
          Routineuntersuchung bis zur komplexen medizinischen Versorgung. Unser
          modernes medizinisches Zentrum ist mit fortschrittlicher Technologie
          und Ausrüstung ausgestattet, um eine präzise Diagnose und effektive
          Behandlungen zu gewährleisten. Wir legen großen Wert auf Sicherheit,
          Qualität und deine Zufriedenheit in allem, was wir tun. Unser
          Engagement für Exzellenz erstreckt sich über alle Bereiche unserer
          Einrichtung, einschließlich unserer Pflegeabteilungen,
          Rehabilitationszentren, Labore und Apotheken. Wir arbeiten eng mit
          lokalen Gemeinden zusammen, um Gesundheitsaufklärung und
          Präventionsprogramme anzubieten, um deine Gesundheit und dein
          Wohlbefinden zu fördern. Egal, ob du uns für eine regelmäßige
          Untersuchung, eine akute Erkrankung oder eine langfristige Pflege
          aufsuchst, wir sind hier, um dir zu helfen. Dein Wohlbefinden steht
          bei uns an erster Stelle, und wir sind stolz darauf, dir eine
          qualitativ hochwertige, mitfühlende und umfassende Versorgung zu
          bieten. Besuche unsere Gesundheitseinrichtung und lass uns gemeinsam
          auf dem Weg zu einem gesünderen und glücklicheren Leben gehen. Wir
          freuen uns darauf, dich zu unterstützen und dir die bestmögliche
          Betreuung zu bieten.</i
        >
      </div>
      <v-divider
        class="my-10"
        v-if="careFacility?.name_responsible_person"
      ></v-divider>
      <div
        v-if="
          careFacility?.street &&
          careFacility?.zip &&
          careFacility?.town &&
          careFacility?.additional_address_info
        "
      >
        <i>
          Adresse: {{ careFacility.street }}, {{ careFacility.zip }}
          {{ careFacility.additional_address_info }} {{ careFacility.town }}
        </i>
      </div>
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

const createEditDialogOpen = ref(false);

const getFacilityDescription = async () => {
  return props.careFacility?.description;
};
const getFacilityTitle = async () => {
  return props.careFacility?.name;
};
const getFacilityImage = async () => {
  return props.careFacility?.image_url;
};

useHead({
  title: getFacilityTitle(),
  meta: [
    { property: "og:type", content: "Webseite" },
    { name: "description", content: getFacilityDescription() },
    { name: "title", content: getFacilityTitle() },
    { name: "image", content: getFacilityImage() },
  ],
});
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

h1 {
  margin-bottom: 0;
}

.main-wrapper {
  margin: 1rem 0;

  .heading {
    display: flex;
    flex-direction: column;
  }

  .info-bar {
    justify-content: flex-end;

    @include md {
      justify-content: space-between;
    }

    .bar-content {
      justify-content: flex-end;

      @include md {
        justify-content: space-between;
      }

      .bar-item {
        padding: 0 1rem;

        @include md {
          padding: 0;
        }
      }
    }
  }
}
.description {
  font-weight: 300;
}
</style>
