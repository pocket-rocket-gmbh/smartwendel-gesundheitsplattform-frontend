<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    @click:outside="emitClose()"
  > 
    <v-card class="">
      <v-card-title v-if="location" class="text-h5">
        Ort bearbeiten
      </v-card-title>
      <v-card-title v-else class="text-h5">
        Ort erstellen
      </v-card-title>
      <v-container>
        <ClientOnly>
          <lazy-MapWidget
            class="mapwidget"
            ref="map"
            :locations="locations"
            :auto-fit=true
          />
        </ClientOnly>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn text @click="emitSave()">OK</v-btn>
        <v-btn text @click="emitClose()">Abbrechen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { MapLocation } from '@/types/MapLocation'

export default defineComponent({
  emits: ['close', 'save'],
  props: {
    careFacilityId: String,
    location: Object as PropType<MapLocation>
  },
  setup (props, { emit }) {

    const dialog = ref(true)
    const map = ref(null)

    const locations = ref([])

    onBeforeMount(() => {
      if (props.location) {
        locations.value.push(props.location)
      }
      else {
        locations.value.push({
          id: 'new',
          longitude: 7.10083, // TODO determine default center coordinates from project
          latitude: 49.53123,
          draggable: true
        })
      }
    })

    const emitClose = () => {
      emit('close')
    }

    const emitSave = () => {
      emit('save')
    }

    const getLocationCoordinates = () => {
      return {
        id: map.value.getLocations()[0].id,
        longitude: map.value.getLocations()[0].longitude,
        latitude: map.value.getLocations()[0].latitude
      }
    }

    return {
      emitClose,
      emitSave,
      getLocationCoordinates,
      dialog,
      map,
      locations
    }
  }
})
</script>

<style lang="sass">


</style>