<template>
  <Loading v-if="loading" />
  <div v-else-if="careFaclities.length > 0">
    <div class="item mb-6" v-for="careFacility in careFaclities" :key="careFacility.id">
      <v-row>
        <v-col md="8">
          <h2 class="is-dark-grey is-uppercase">{{ careFacility.name }}</h2>
          <div v-if="careFacility.kind" class="is-primary font-weight-bold">
            {{ useKindsCareFacilities().getNameFromId(careFacility.kind) }}
          </div>
          <v-row>
            <v-col>
              <div class="text-dark-grey mt-4">
                <div v-if="careFacility.street">{{ careFacility.street }}</div>
                <div v-if="careFacility.zip || careFacility.town">{{ careFacility.zip }} {{ careFacility.town }}</div>
                <div v-if="careFacility.community">{{ careFacility.community }}</div>
              </div>
            </v-col>
            <v-col>
              <div class="text-dark-grey mt-4">
                <div v-if="careFacility.phone"><v-icon color="primary" class="mr-2">mdi-phone-outline</v-icon>{{ careFacility.phone }}</div>
                <div v-if="careFacility.email"><v-icon color="primary" class="mr-2">mdi-email-outline</v-icon>{{ careFacility.email }} {{ filterCriteria }}</div>
              </div>
            </v-col>
          </v-row>
          <div>
            <v-btn 
              append-icon="mdi-map-marker-outline"
              size="small"
              class="mt-4 pa-1"
              variant="text"
              color="primary"
              rounded="pill"
              @click=""
                >
                Auf karte zeigen
            </v-btn>
          </div>
        </v-col>
        <v-col align="right">
          <v-btn
            variant="flat"
            color="secondary"
            rounded="pill"
            :href="`/public/care_facilities/${careFacility.id}`"
          >
            Details ansehen
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
  <div v-else-if="!loading">
    <div class="item">
      Leider keine Ergebnisse. Bitte passen Sie Ihre Suche an.
    </div>
  </div>
</template>

<script lang="ts">
import { useFilterStore } from '@/store/filter'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    filterCriteria : String
  },
  setup(props) {
    const filters = ref([])
    const searchQuery = ref(null)
    const loading = ref(false)
    const filter = props.filterCriteria

    const currentCategoryId = computed(() => {
      return useFilterStore().currentCategoryId
    })
    const currentSubCategoryId = computed(() => {
      return useFilterStore().currentSubCategoryId
    })
    const currentSubSubCategoryId = computed(() => {
      return useFilterStore().currentSubSubCategoryId
    })
    const currentTags = computed(() => {
      return useFilterStore().currentTags
    })

    const careFaclitiesApi = useCollectionApi()
    careFaclitiesApi.setBaseApi(usePublicApi())
    careFaclitiesApi.setEndpoint(`care_facilities`)
    const careFaclities = ref([])

    if (useNuxtApp().$bus) {
      useNuxtApp().$bus.$on("updateFacilitiesBasedOnFilterChange", (toUpdate:string) => {
        if (!toUpdate) {
          filters.value = []
          searchQuery.value = null
        } else {
          updateFilters(toUpdate)
        }
        getCareFacilities()
      })

      useNuxtApp().$bus.$on("emitFacilitySearch", (query:string) => {
        searchQuery.value = query
        getCareFacilities()
      })
    }

    const updateFilters = (toUpdate:string) => {
      if (toUpdate === 'category') {
        const foundFilter = filters.value.find((f:any) => f.field === 'care_facility_category')
        if (foundFilter) {
          filters.value = filters.value.filter((f:any) => f.field !== 'care_facility_category')
        }
        filters.value.push ( { field: 'care_facility_category', value: currentCategoryId.value } )
        return
      }
      if (toUpdate === 'subCategory') {
        const foundFilter = filters.value.find((f:any) => f.field === 'care_facility_sub_category')
        if (foundFilter) {
          filters.value = filters.value.filter((f:any) => f.field !== 'care_facility_sub_category')
        }
        filters.value.push ( { field: 'care_facility_sub_category', value: currentSubCategoryId.value } )
        return
      }
      if (toUpdate === 'subSubCategory') {
        const foundFilter = filters.value.find((f:any) => f.field === 'care_facility_sub_sub_category')
        if (foundFilter) {
          filters.value = filters.value.filter((f:any) => f.field !== 'care_facility_sub_sub_category')
        }
        filters.value.push ( { field: 'care_facility_sub_sub_category', value: currentSubSubCategoryId.value } )
        return
      }
      if (toUpdate === 'tags') {
        const foundFilter = filters.value.find((f:any) => f.field === 'tags')
        if (foundFilter) {
          filters.value = filters.value.filter((f:any) => f.field !== 'tags')
        }
        filters.value.push ( { field: 'care_facility_tags', value: currentTags.value } )
        return
      }
    }

    const getCareFacilities = async () => {
      loading.value = true
      const options = { page: 1, per_page: 25, sort_by: 'menu_order', sort_order: filter, searchQuery: searchQuery.value, concat: false, filters: filters.value }
      await careFaclitiesApi.retrieveCollection(options as any)
      careFaclities.value = careFaclitiesApi.items.value
      loading.value = false
    }

    onMounted(() => {
      if (currentCategoryId.value) {
        updateFilters('category')
      }
      if (currentSubCategoryId.value) {
        updateFilters('subCategory')
      }
      if (currentSubSubCategoryId.value) {
        updateFilters('currentSubSubCategoryId')
      }
      getCareFacilities()

    })

    watch(filter, () => {
      getCareFacilities()
    })

    return {
      careFaclities,
      loading,
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