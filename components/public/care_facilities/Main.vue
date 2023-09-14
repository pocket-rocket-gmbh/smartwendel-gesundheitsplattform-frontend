<template>
  <div class="main-wrapper">
    <v-row class="heading">
      <v-col class="d-flex align-center">
        <h1 class="is-dark-grey">{{ careFacility?.name }}</h1>
        <span v-if="careFacility?.billable_through_health_insurance_approved">
          <v-icon size="x-large" class="pl-8" color="primary"
            >mdi-check-decagram-outline</v-icon
          >
        </span>
      </v-col>
      <v-col class="info-bar d-flex align-center" v-if="careFacility?.kind === 'news'">
        <v-row>
          <v-col class="bar-content d-flex align-center">
            <div class="d-flex align-center bar-item">
              <span class="pr-1"
                ><v-icon color="primary">mdi-clock-time-three-outline</v-icon></span
              >
              <span>{{ useDatetime().parseDatetime(careFacility.created_at) }}</span>
            </div>
            <div
            class="d-flex align-center facility-name is-clickable"
            v-if="careFacility?.user_care_facility?.name"
          >
            <a
              :href="`/public/care_facilities/${careFacility?.user_care_facility?.id}`"
              class="is-clickable d-flex"
            >
              <v-icon color="primary" class="facility-name">mdi-home-outline</v-icon>
              <span
                class="break-title facility-name"
                v-html="careFacility?.user_care_facility?.name"
              ></span>
            </a>
          </div>
            <div class="bar-item" v-if="careFacility?.name_instructor">
              <span class="px-1"><v-icon color="primary">mdi-account</v-icon></span>
              <span>{{ careFacility?.name_instructor }}</span>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="my-5"></v-divider>
    <span
      class="is-primary mr-2"
      v-if="careFacility?.kind === 'news'"
      v-for="tags in careFacility.tag_categories"
    >
      <span>{{ tags.name }}</span>
    </span>
    <div class="mt-4">
      <ClientOnly>
        <PublicTextTooltipWrap class="pr-5 description" :text="careFacility?.description" />
      </ClientOnly>
      <v-divider class="my-10"></v-divider>
      <div>
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
  @include md {
    margin: 1rem 0;
  }

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
</style>