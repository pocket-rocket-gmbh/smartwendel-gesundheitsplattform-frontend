<template>
  <div class="my-15">
    <v-row>
      <v-col class="d-flex align-center">
        <h1 class="is-dark-grey">{{ careFacility.name }}</h1>
        <span v-if="careFacility.billable_through_health_insurance_approved">
          <v-icon size="x-large" class="pl-8" color="primary"
            >mdi-check-decagram-outline</v-icon
          >
        </span>
      </v-col>
      <v-col
        md="4"
        class="d-flex align-center justify-end"
        v-if="careFacility.kind === 'news'"
      >
        <v-row>
          <v-col class="d-flex justify-end align-center">
            <div class="d-flex align-center px-3">
              <span class="px-1"
                ><v-icon color="primary"
                  >mdi-clock-time-three-outline</v-icon
                ></span
              >
              <span>{{
                useDatetime().parseDatetime(careFacility.created_at)
              }}</span>
            </div>
            <div class="px-8">
              <span class="px-1"
                ><v-icon color="primary">mdi-account</v-icon></span
              >
              <span>{{ careFacility.user?.name }}</span>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <span
      class="is-primary mr-2"
      v-if="careFacility.kind === 'news'"
      v-for="tags in careFacility.tag_categories"
    >
      <span>{{ tags.name }}</span>
    </span>
    <div class="mt-4">
      <ClientOnly>
        <PublicTextTooltipWrap class="pr-5" :text="careFacility.description" />
      </ClientOnly>
      <v-divider class="my-5"></v-divider>
      <div>
        <i>Inhaltlich verantwortlich: {{ careFacility.user?.name }} </i>
      </div>
      <div v-if="careFacility.street && careFacility.zip && careFacility.town">
        <i>
          Adresse: {{ careFacility.street }}, {{ careFacility.zip }} {{ careFacility.town }}
        </i>
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
@import "@/assets/sass/main.sass"
</style>