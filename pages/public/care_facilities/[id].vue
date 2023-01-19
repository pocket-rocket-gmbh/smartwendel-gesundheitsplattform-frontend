<template>
  <v-container class="limited offset">
    <PublicCareFacilitiesImages
      :care-facility="careFacility"
    />
    <v-row>
      <v-col md="8">
        <PublicCareFacilitiesMain
          :care-facility="careFacility"
        />
      </v-col>
      <v-col md="4">
        <PublicCareFacilitiesRight
          :care-facility="careFacility"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default defineComponent({
  setup() {
    const route = useRoute()
    const careFacility = ref({})
    const loading = ref(false)

    const careFacilityId = computed(() => {
      return route.params.id
    })

    const showApi = useCollectionApi()
    showApi.setBaseApi(usePublicApi())

    const getCareFacility = async () => {
      showApi.setEndpoint(`care_facilities/${careFacilityId.value}`)

      loading.value = true
      await showApi.getItem()
      loading.value = false
      careFacility.value = showApi.item.value
    }

    onMounted(() => {
      getCareFacility()
    })

    return {
      careFacility
    }
  }
})
</script>

<style lang="sass" scoped>

</style>