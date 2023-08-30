<template>
  <div class="main-wrapper">
    <v-row class="heading">
      <v-col class="d-flex align-center">
        <h1 class="is-dark-grey">{{ careFacility?.name }}</h1>
        <span v-if="careFacility?.billable_through_health_insurance_approved">
          <v-icon size="x-large" class="pl-8" color="primary">mdi-check-decagram-outline</v-icon>
        </span>
      </v-col>
      <v-col class="info-bar d-flex align-center" v-if="careFacility?.kind === 'news'">
        <v-row>
          <v-col class="bar-content d-flex align-center">
            <div class="d-flex align-center bar-item">
              <span class="pr-1"><v-icon color="primary">mdi-clock-time-three-outline</v-icon></span>
              <span>{{ useDatetime().parseDatetime(careFacility.created_at) }}</span>
            </div>
            <div class="bar-item">
              <span class="px-1"><v-icon color="primary">mdi-account</v-icon></span>
              <span>{{ careFacility?.user?.name }}</span>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <span class="is-primary mr-2" v-if="careFacility?.kind === 'news'" v-for="tags in careFacility.tag_categories">
      <span>{{ tags.name }}</span>
    </span>
    <div class="mt-4">
      <ClientOnly>
        <PublicTextTooltipWrap class="pr-5" :text="careFacility?.description" />
      </ClientOnly>
      <v-divider class="my-5"></v-divider>
      <div>
        <i>Inhaltlich verantwortlich: {{ careFacility?.user?.name }} </i>
      </div>
      <div v-if="careFacility?.street && careFacility?.zip && careFacility?.town && careFacility?.additional_address_info">
        <i> Adresse: {{ careFacility.street }}, {{ careFacility.zip }} {{ careFacility.additional_address_info }} {{ careFacility.town }} </i>
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
