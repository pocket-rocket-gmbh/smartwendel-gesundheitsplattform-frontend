<template>
  <v-dialog v-model="dialog" transition="dialog-bottom-transition" @click:outside="emitClose()">
    <v-card class="">
      <v-card-title v-if="location" class="text-h5"> Ort bearbeiten </v-card-title>
      <v-card-title v-else class="text-h5"> Ort erstellen </v-card-title>
      <v-container>
        <v-form ref="form">
          <div class="mb-15">
            <div class="field">
              <v-text-field
                v-model="street"
                hide-details="auto"
                label="Straße und Nummer"
                :rules="[rules.required, rules.counterStreet]"
              />
            </div>
            <div class="field">
              <v-select
                hide-details="auto"
                v-model="community"
                :items="communities"
                item-title="name"
                item-value="id"
                label="Gemeinde"
                :rules="[rules.required]"
              />
            </div>
            <div class="field split">
              <v-text-field
                v-model="zip"
                hide-details="auto"
                label="PLZ"
                :type="'number'"
                readonly
                :rules="[rules.required, rules.zip]"
              />
              <v-select
                hide-details="auto"
                v-model="town"
                :items="townsByCommunityId"
                item-title="name"
                item-value="name"
                label="Ort"
                :rules="[rules.required]"
              />
            </div>
          </div>
          <span v-if="error" class="error">{{ error }}</span>
        </v-form>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="emitSave()">OK</v-btn>
        <v-btn @click="emitClose()">Abbrechen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { MapLocation } from "@/types/MapLocation";
import { rules } from "../../../data/validationRules";
import axios from "axios";

const emit = defineEmits(["close", "save"]);

const props = defineProps<{
  careFacilityId: string;
  location?: MapLocation;
}>();

const communitiesApi = useCollectionApi();
communitiesApi.setBaseApi(usePrivateApi());
communitiesApi.setEndpoint(`communities`);
const communities = communitiesApi.items;

const dialog = ref(true);
const form = ref();

const street = ref("");
const community = ref("");
const zip = ref("");
const town = ref("");

const error = ref("");
const snackbar = useSnackbar();

const townsByCommunityId = ref([]);

watch(community, () => {
  const foundCommunity = communities.value.find(({ id }) => id === community.value);
  if (!foundCommunity) return;
  zip.value = foundCommunity.zip;

  townsByCommunityId.value = getTownsByCommunityId(community.value);

  if (!townsByCommunityId.value.find((item) => item === town.value)) {
    town.value = "";
  }
});

const getCommunities = async () => {
  await communitiesApi.retrieveCollection();
};

onBeforeMount(async () => {
  getCommunities();

  if (props.location) {
    try {
      const { address } = await getAddressInfoFromLatLong(props.location.latitude, props.location.longitude);

      street.value = `${address.road} ${address.house_number || ""}`;
      community.value = address.city_district;
      zip.value = address.postcode;
      town.value = address.town || address.village;
    } catch (err) {
      console.error(err);
    }
  }
});

const emitClose = () => {
  emit("close");
};

const emitSave = async () => {
  const { valid } = await form.value.validate();

  if (!valid) {
    snackbar.showError("Speichern fehlgeschlagen! Es gibt ungültige Felder!");
    return;
  }

  const response = await getLatLngFromAddress(zip.value, street.value);

  if (response) {
    const [lat, long] = response;
    emit("save", lat, long);
  } else {
    console.error("Address not found");
    snackbar.showError("Addresse konnte nicht befunden werden. Bitte eine Eingaben überprüfen!");
    error.value = "Addresse konnte nicht befunden werden. Bitte eine Eingaben überprüfen!";
  }
};

const getLatLngFromAddress = async (zipCode: string, street: string) => {
  try {
    const { data } = await axios.get(
      `https://geocode.maps.co/search?postalcode=${zipCode}&street=${street}&country=DE`
    );

    if (!data.length) {
      return null;
    }

    const bestResult = data[0];

    return [bestResult.lat, bestResult.lon];
  } catch (err) {
    console.error(err);
    return null;
  }
};

const getAddressInfoFromLatLong = async (lat: number, long: number) => {
  const { data } = await axios.get(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}`);

  return data;
};

const getTownsByCommunityId = (communityId: string) => {
  const found = communities.value.find((community: any) => community.id === communityId);

  if (found) {
    // useNuxtApp().$bus.$emit('setPayloadFromSlotChild', { name: 'zip', value: found.zip })
    return found.towns;
  } else {
    [];
  }
};
</script>

<style lang="sass">
.error
  font-weight: bold
  color: red
</style>
