<template>
  <div>
    <v-row>
      <v-col md="8">
        <PublicCareFacilitiesMain
          :care-facility="careFacility"
        />
      </v-col>
      <v-col md="4">
        Right
      </v-col>
    </v-row>
  </div>
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