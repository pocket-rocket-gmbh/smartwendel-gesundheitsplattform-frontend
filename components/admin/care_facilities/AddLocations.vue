<template>
  <div>
    <div>
      <v-btn class="mt-4 mb-1 ml-n2" size="large" elevation="0" variant="outlined" @click="openLocationDialog(null)">
        Ort hinzufügen
      </v-btn>
      <template v-if="itemId">
        <v-table v-if="careFacility?.locations.length > 0">
          <thead>
            <tr>
              <th class="general-font-size is-dark-grey">Adresse</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="location in careFacility?.locations" :key="location.id">
              <td><AdminCareFacilitiesLocationName :lat="location.latitude" :long="location.longitude" :item-id="itemId"/></td>
              <td>
                <v-icon
                  class="is-clickable"
                  @click="
                    openLocationDialog({
                      id: location.id,
                      longitude: parseFloat(String(location.longitude)),
                      latitude: parseFloat(String(location.latitude)),
                      draggable: true,
                      name: careFacility.name,
                      url: careFacility.website,
                      imageUrl: careFacility.logo_url,
                      kind: 'facility',
                    })
                  "
                  >mdi-pencil</v-icon
                >
              </td>
              <td><v-icon class="is-clickable" @click="deleteLocation(location.id)">mdi-delete</v-icon></td>
            </tr>
          </tbody>
        </v-table>
      </template>
      <template v-else>
        <v-table v-if="offlineLocations.length > 0">
          <thead>
            <tr>
              <th class="general-font-size is-dark-grey">Addresse</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(location, index) in offlineLocations" :key="index">
              <td><AdminCareFacilitiesLocationName :lat="location.latitude" :long="location.longitude" :item-id="careFacility.id" /></td>
              <td>
                <v-icon
                  class="is-clickable general-font-size is-dark-grey"
                  @click="
                    openLocationDialog({
                      id: String(index),
                      longitude: parseFloat(String(location.longitude)),
                      latitude: parseFloat(String(location.latitude)),
                      draggable: true,
                      name: offlineName,
                      url: '',
                      imageUrl: '',
                      kind: 'facility',
                    })
                  "
                  >mdi-pencil</v-icon
                >
              </td>
              <td><v-icon class="is-clickable general-font-size is-dark-grey" @click="deleteOfflineLocation(index)">mdi-delete</v-icon></td>
            </tr>
          </tbody>
        </v-table>
      </template>
    </div>
  </div>
  <AdminCareFacilitiesCreateEditLocation
    ref="createEditDialog"
    :care-facility-id="careFacility?.id"
    :location="location"
    v-if="createEditLocationOpen"
    @close="closeLocationDialog()"
    @save="handleSaveLocation"
  />
</template>

<script setup lang="ts">
import { ResultStatus } from "@/types/serverCallResult";
import type { MapLocation } from "@/types/MapLocation";

const emit = defineEmits(["offline", "update"]);
const props = defineProps<{
  itemId: string | null;

  offlineName?: string;
  offlineLocations?: { latitude: number; longitude: number }[];
}>();

const loadingItem = ref(false);
const dialog = ref(true);
const errors = ref([]);

const careFacility = ref<{
  id: string;
  name: string;
  website: string;
  logo_url: string;
  locations: MapLocation[];
} | null>(null);
const location = ref(null);

const createEditDialog = ref(null);

const createEditLocationOpen = ref(false);

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());

const getCareFacility = async () => {
  api.setEndpoint(`care_facilities/${props.itemId}`);
  loadingItem.value = true;
  await api.getItem();
  loadingItem.value = false;
  careFacility.value = api.item.value;
  emit("update", careFacility.value.locations);
};

const closeLocationDialog = async () => {
  location.value = null;
  createEditLocationOpen.value = false;
};

const handleSaveLocation = (lat: number, long: number) => {
  if (props.itemId) {
    return saveLocation(lat, long);
  }
  return saveLocationOffline(lat, long);
};

const saveLocation = async (lat: number, long: number) => {
  createEditLocationOpen.value = false;
  loadingItem.value = true;
  await getCareFacility();
  if (location.value) {
    api.setEndpoint(`/locations/${location.value.id}`);
    await api.updateItem({
      longitude: long,
      latitude: lat,
    });
  } else {
    api.setEndpoint(`locations/care_facility/${props.itemId}`);
    await api.createItem({
      careFacility_id: props.itemId,
      longitude: long,
      latitude: lat,
    });
  }

  await getCareFacility();
  loadingItem.value = false;
  location.value = null;
};

const saveLocationOffline = async (lat: number, long: number) => {
  createEditLocationOpen.value = false;

  if (location.value) {
    props.offlineLocations[location.value.id] = {
      latitude: lat,
      longitude: long,
    };

    emit("offline", [...props.offlineLocations]);
  } else {
    emit("offline", [...props.offlineLocations, { latitude: lat, longitude: long }]);
  }

  location.value = null;
};

const deleteLocation = async (locationId: string) => {
  api.setEndpoint(`/locations/${locationId}`);
  loadingItem.value = true;
  const result = await api.deleteItem("Ort erfolgreich gelöscht");
  if (result.status === ResultStatus.SUCCESSFUL) {
    loadingItem.value = false;
    getCareFacility();
  } else {
    errors.value = result.data;
    loadingItem.value = false;
  }
};

const deleteOfflineLocation = async (offlineLocationIndex: number) => {
  props.offlineLocations.splice(offlineLocationIndex, 1);
  emit("offline", [...props.offlineLocations]);
};

const openLocationDialog = async (editLocation: MapLocation) => {
  if (editLocation) {
    location.value = editLocation;
    location.value.draggable = true;
  }
  createEditLocationOpen.value = true;
};

watch(
  () => props.itemId,
  () => {
    if (props.itemId) {
      getCareFacility();
      return;
    }
  }
);

onMounted(() => {
  if (props.itemId) {
    getCareFacility();
    return;
  }
});
</script>

<style lang="sass"></style>
