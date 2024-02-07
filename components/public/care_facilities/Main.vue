<template>
  <div class="main-wrapper">
    <v-row class="heading">
      <v-col class="d-flex align-center">
        <span class="general-font-size font-weight-medium is-dark-grey d-md-block d-none">{{ careFacility?.name }}</span>
        <span v-if="careFacility?.billable_through_health_insurance_approved">
          <v-icon size="x-large" class="pl-8" color="primary"
            >mdi-check-decagram-outline</v-icon
          >
        </span>
      </v-col>
    </v-row>
    <v-divider class="my-5 d-md-block d-none"></v-divider>
    <div class="mt-4">
      <ClientOnly>
        <PublicTextTooltipWrap class="pr-5 is-dark-grey description" :text="careFacility?.description.replace('<p><br></p><p><br></p>', '<p><br></p>')" />
      </ClientOnly>
      <v-divider class="my-10"></v-divider>
      <div class="genral-font-size is-dark-grey">
        <i
          >Inhaltlich verantwortlich:
          <span v-if="careFacility?.name_responsible_person">{{
            careFacility?.name_responsible_person
          }}</span>
          </i
        >
      </div>
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