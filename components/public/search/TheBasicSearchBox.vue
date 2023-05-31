<template>
  <div class="basic-search-box pa-8 mt-10">
    <v-row>
      <v-col>
        <h2 class="is-uppercase text-white">Wählen Sie hier Ihre Suchkriterien aus</h2>
      </v-col>
      <v-col class="is-white d-flex align-center justify-end">
        <p>Hilfe ?</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="field">
          <label class="label">Einrichtung, Arzt, Name etc.</label>
          <input type="text" class="input" v-model="searchQuery" />
        </div>
      </v-col>
      <v-col>
        <PublicFilterSelect
          :key="currentCategoryId"
          color="is-white"
          filter-name="category"
          label="Schwerpunkt"
          endpoint="categories"
        />
      </v-col>
      <v-col>
        <PublicFilterSelect
          :key="currentCategoryId"
          color="is-white"
          filter-name="category"
          label="Ort, Adresse oder PLZ"
          endpoint=""
        />
      </v-col>
    </v-row>
    <v-row class="mt-3">
      <v-col>
        <v-btn 
          append-icon="mdi-map-outline"
          size="large"
          class="mt-4"
          variant="text"
          color="primary"
          rounded="pill"
          @click="mapToogle"
            >
              Karte ausblenden
          </v-btn>
      </v-col>
      <v-col class="d-flex justify-end">
        <v-btn
          class="ma-4"
          variant="outlined"
          rounded="pill"
          color="primary"
          @click="emitResetFilter()"
          >
            Felder löschen
        </v-btn>
        <v-btn
          class="ma-4"
          variant="flat"
          color="primary"
          rounded="pill"
          @click="emitSearch"
            >
              Suche starten
        </v-btn>
      </v-col>
    </v-row>
  </div>
  <div  class="map-widget">
    <ClientOnly>
      <lazy-MapWidget
        :locations="locations"
        v-if="showingMap"
        ref="map"
        :auto-fit="false"
        :center-point="{
          lng: 7.131735,
          lat: 49.523656,
        }"
        :min-zoom="11"
       />
    </ClientOnly>
  </div>          
  
</template>
<script lang="ts">
import { Ref } from 'vue'
import { useFilterStore } from '@/store/filter'
import { MapLocation } from '@/types/MapLocation'

export default defineComponent({
  setup () {
    const searchQuery = ref('')
    const filterStore = useFilterStore()
    const showingMap = ref(true)
    const map = ref(null)
    const locations: Ref<MapLocation[]> = ref([])

    const api = useCollectionApi()
    api.setBaseApi(usePublicApi())
    api.setEndpoint('care_facilities')
    const facilities = api.items

    if (useNuxtApp().$bus) {
      useNuxtApp().$bus.$on("clearSearch", () => {
        searchQuery.value = ''
      })
    }

    onMounted(() => {
      getfacilities(false)
    })

    const getfacilities = async (concat = false) => {
      await api.retrieveCollection()
      updateLocations()
    }

    const updateLocations = () => {

    locations.value = []

    facilities.value.forEach((facility) => {
      facility.locations.forEach((location: any) => {
        locations.value.push({
          id: facility.id,
          longitude: parseFloat(location.longitude),
          latitude: parseFloat(location.latitude),
          draggable: false,
          tooltipHtml: `<div style="width: 200px;"><img src="${facility.logo_url}" style="width: 100%;" /><div style="white-space: normal;">${facility.name}</div></div>`
        })
      })
    })

    // Give the ref some time to update.
    setTimeout(function () {
      if (map.value) { // take in to account that the map has not yet been loaded into the dom
        map.value.refreshView()
      }
    }, 10)
    }

    const emitResetFilter = () => {
      useFilterStore().$patch({
        'currentCategoryId': null,
        'currentSubCategoryId': null,
        'currentSubSubCategoryId': null,
        'currentTags': null
      })
      useNuxtApp().$bus.$emit('updateFacilitiesBasedOnFilterChange', null)
      useNuxtApp().$bus.$emit('clearSearch', null)
      useNuxtApp().$bus.$emit('clearTags', null)
    }
    
    const mapToogle = () => {
      showingMap.value = !showingMap.value
    }
    const currentCategoryId = computed(() => {
      return filterStore.currentCategoryId
    })

    const emitSearch = () => {
      useNuxtApp().$bus.$emit('emitFacilitySearch', searchQuery.value)
    }

    return {
      useFilterStore,
      searchQuery,
      currentCategoryId,
      emitSearch,
      showingMap,
      map,
      mapToogle,
      emitResetFilter,
      locations,
      facilities
    }
  }
})
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
.basic-search-box
  background: $dark-green-gradient
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
  border-radius: 20px



</style>