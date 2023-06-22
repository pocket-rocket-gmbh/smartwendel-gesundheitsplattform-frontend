<template>
    <div>    
      <div>
        <v-btn
          class="mt-n4 mb-1 ml-n2"
          size="x-small" elevation="0" variant="outlined"
          @click="openLocationDialog(null)">
          Ort hinzufügen
        </v-btn>
        <v-table>
          <thead>
            <tr>
              <th>Addresse </th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(location) in careFacility?.locations" :key="location.id">
              <td><AdminCareFacilitiesLocationName :lat="location.latitude" :long="location.longitude" /></td>
              <td>
                <v-icon class="is-clickable" @click="openLocationDialog({
                  id: location.id,
                  longitude: parseFloat(location.longitude),
                  latitude: parseFloat(location.latitude),
                  draggable: true,
                  name: careFacility.name,
                  url: careFacility.website,
                  imageUrl: careFacility.logo_url,
                  kind: 'facility'
                  })">mdi-pencil</v-icon>
              </td>
              <td><v-icon class="is-clickable" @click="deleteLocation(location.id)">mdi-delete</v-icon></td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
    <AdminCareFacilitiesCreateEditLocation
      ref="createEditDialog"
      :care-facility-id="careFacility?.id"
      :location="location"
      v-if="createEditLocationOpen"
      @close="closeLocationDialog()"
      @save="saveLocation()"
    />

</template>

<script lang="ts">
import { ResultStatus } from '@/types/serverCallResult'
import { MapLocation } from '@/types/MapLocation'

export default defineComponent({
  emits: ['close'],
  props: {
    itemId: {
      type :String,
      required: true
    }
  },
  setup (props, { emit }) {
    const loadingItem = ref(false)
    const dialog = ref(true)
    const errors = ref([])

    const careFacility = ref(null)
    const location = ref(null)

    const createEditDialog = ref(null)

    const createEditLocationOpen = ref(false)

    const emitClose = () => {
      emit('close')
    }
    const api = useCollectionApi()
    api.setBaseApi(usePrivateApi())

    const getCareFacility = async () => {
      api.setEndpoint(`care_facilities/${props.itemId}`)
      loadingItem.value = true
      await api.getItem()
      loadingItem.value = false
      careFacility.value = api.item.value
    }

    const closeLocationDialog = async () => {
      location.value = null
      createEditLocationOpen.value = false
    }

    const saveLocation = async () => {
      const locationId = createEditDialog.value.getLocationCoordinates().id 
      const longitude = createEditDialog.value.getLocationCoordinates().longitude
      const latitude = createEditDialog.value.getLocationCoordinates().latitude

      createEditLocationOpen.value = false
      loadingItem.value = true

      if (location.value) {
        api.setEndpoint(`/locations/${locationId}`)
        await api.updateItem({
          longitude: longitude,
          latitude: latitude
        })
      }
      else {
        api.setEndpoint(`locations/care_facility/${props.itemId}`)
        await api.createItem({
          careFacility_id: props.itemId,
          longitude: longitude,
          latitude: latitude
        })
      }

      await getCareFacility()
      loadingItem.value = false
      location.value = null
    }

    const deleteLocation = async (locationId: string) => {
      api.setEndpoint(`/locations/${locationId}`)
      loadingItem.value = true
      const result = await api.deleteItem('Ort erfolgreich gelöscht')
      if (result.status === ResultStatus.SUCCESSFUL) {
        loadingItem.value = false
        getCareFacility()
      } else {
        errors.value = result.data
        loadingItem.value = false
      }
    }

    const openLocationDialog = async (editLocation: MapLocation) => {
      if (editLocation) {
        location.value = editLocation
        location.value.draggable = true
      }
      createEditLocationOpen.value = true
    }

    onMounted(() => {
      getCareFacility()
    })

    return {
      emitClose,
      dialog,
      loadingItem,
      errors,
      careFacility,
      location,
      createEditLocationOpen,
      closeLocationDialog,
      saveLocation,
      getCareFacility,
      deleteLocation,
      openLocationDialog,
      createEditDialog
    }
  }
})
</script>

<style lang="sass">

</style>