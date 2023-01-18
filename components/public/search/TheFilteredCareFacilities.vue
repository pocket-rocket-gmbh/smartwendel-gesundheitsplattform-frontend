<template>
  <div class="item mb-6" v-for="careFacility in careFaclities" :key="careFacility.id">
    <v-row>
      <v-col><h2 class="is-primary is-uppercase">{{ careFacility.name }}</h2></v-col>
      <v-col align="right">
        <v-btn
          variant="flat"
          color="info"
          rounded="pill"
          :href="`/public/care_facilities/${careFacility.id}`"
        >
          Details ansehen
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
    const careFaclitiesApi = useCollectionApi()
    careFaclitiesApi.setBaseApi(usePublicApi())
    careFaclitiesApi.setEndpoint(`care_facilities`)
    const careFaclities = careFaclitiesApi.items

    const getCareFacilities = async () => {
      const options = { page: 1, per_page: 25, sort_by: 'menu_order', sort_order: 'ASC', searchQuery: null, concat: false, filters: [] }
      await careFaclitiesApi.retrieveCollection(options)
    }

    onMounted(() => {
      getCareFacilities()
    })

    return {
      careFaclities
    }
  }
})
</script>

<style lang="sass" scoped>
.item
  background: #FFFFFF
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
  border-radius: 20px
  padding: 20px
</style>