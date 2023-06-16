<template>
  <div class="my-15">
    <v-row>
      <v-col>
        <h1 class="is-dark-grey">{{ careFacility.name }}</h1>
      </v-col>
      <v-col md="6" class="d-flex align-center justify-center">
        <v-row>
          <v-col class="d-flex justify-end align-center">
            <div class="d-flex align-center px-3">
              <span class="px-1"><v-icon color="primary">mdi-clock-time-three-outline</v-icon></span>
              <span>{{ useDatetime().parseDatetime(careFacility.created_at) }}</span>
            </div>
            <div class="px-8">
              <span class="px-1"><v-icon color="primary">mdi-account</v-icon></span>
              <span>{{ careFacility.user?.name }}</span>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <div class="is-primary" v-for="category in careFacility.categories">
      <h3>{{ category.name }}</h3>
    </div>
   <div class="mt-4" v-html="careFacility.description"></div>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    careFacility: {
      type: Object,
      required: true
    }
  })
</script>

<style lang="sass" scoped>
</style>