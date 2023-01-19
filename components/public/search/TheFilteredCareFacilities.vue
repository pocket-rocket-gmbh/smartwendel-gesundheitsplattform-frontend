<template>
  <div class="item mb-6" v-for="careFacility in careFaclities" :key="careFacility.id">
    <v-row>
      <v-col>
        <h2 class="is-primary is-uppercase">{{ careFacility.name }}</h2>
        <div v-if="careFacility.kind" class="text-info font-weight-bold">
          {{ useKindsCareFacilities().getNameFromId(careFacility.kind) }}
        </div>
        <v-row>
          <v-col>
            <div class="text-dark-grey font-weight-bold mt-4">
              <div v-if="careFacility.street">{{ careFacility.street }}</div>
              <div v-if="careFacility.zip || careFacility.town">{{ careFacility.zip }} {{ careFacility.town }}</div>
              <div v-if="careFacility.community">{{ careFacility.community }}</div>
            </div>
          </v-col>
          <v-col>
            <div class="text-dark-grey font-weight-bold mt-4">
              <div v-if="careFacility.phone"><nuxt-icon name="phone" filled class="mr-2" />{{ careFacility.phone }}</div>
              <div v-if="careFacility.email"><nuxt-icon name="email" filled class="mr-2" />{{ careFacility.email }}</div>
            </div>
          </v-col>
        </v-row>
        
      </v-col>
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

    <div>{{ careFacility.categories }}</div>
    <div>{{ careFacility.sub_categories }}</div>
    <div>{{ careFacility.tags }}</div>
  </div>
</template>

<script lang="ts">
import { useFilterStore } from '@/store/filter'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {

    const filters = ref([])

    const currentCategoryId = computed(() => {
      return useFilterStore().currentCategoryId
    })
    const currentSubCategoryId = computed(() => {
      return useFilterStore().currentSubCategoryId
    })
    const currentSubCategoryTags = computed(() => {
      return useFilterStore().currentSubCategoryTags
    })

    const careFaclitiesApi = useCollectionApi()
    careFaclitiesApi.setBaseApi(usePublicApi())
    careFaclitiesApi.setEndpoint(`care_facilities`)
    const careFaclities = ref([])

    if (useNuxtApp().$bus) {
      useNuxtApp().$bus.$on("updateFacilitiesBasedOnFilterChange", (toUpdate:string) => {
        

        if (toUpdate === 'category') {
          console.log("set category filter")
          console.log(filters.value)
          const foundFilter = filters.value.find((f:any) => f.field === 'care_facility_category')
          if (foundFilter) {
            filters.value = filters.value.filter((f:any) => f.field !== 'care_facility_category')
          }
          filters.value.push ( { field: 'care_facility_category', value: currentCategoryId.value } )
          getCareFacilities()
          return
        }
        if (toUpdate === 'subCategory') {
          console.log("set sub category filter")
          const foundFilter = filters.value.find((f:any) => f.field === 'care_facility_sub_category')
          if (foundFilter) {
            filters.value = filters.value.filter((f:any) => f.field !== 'care_facility_sub_category')
          }
          filters.value.push ( { field: 'care_facility_sub_category', value: currentSubCategoryId.value } )
          getCareFacilities()
          return
        }
        if (toUpdate === 'subCategoryTags') {
          console.log("set tags filter")
          const foundFilter = filters.value.find((f:any) => f.field === 'tags')
          if (foundFilter) {
            filters.value = filters.value.filter((f:any) => f.field !== 'tags')
          }
          filters.value.push ( { field: 'tags', value: currentSubCategoryTags.value } )
          getCareFacilities()
          return
        }
      })
    }

    const getCareFacilities = async () => {
      const options = { page: 1, per_page: 25, sort_by: 'menu_order', sort_order: 'ASC', searchQuery: null, concat: false, filters: filters.value }
      await careFaclitiesApi.retrieveCollection(options as any)
      careFaclities.value = careFaclitiesApi.items.value
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