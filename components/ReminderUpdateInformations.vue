<template>
  <div></div>
  <v-dialog
    width="500"
    v-model="open"
    transition="dialog-bottom-transition"
    class="mt-10"
    persistent
  >
    <v-card class="dialog">
      <v-card-text class="card-text">
        <v-row>
          <v-col>
            <h3 class="mb-4">Letzte Aktualisierung deiner Daten: {{ useDatetime().parseDatetime(currentUser.last_care_facility_updated_at) }}</h3>
            <div>
              Um die Gesundheitsplattform aktuell zu halten, bitten wir dich, deine Daten regelmäßig zu aktualisieren. So können wir sicherstellen, 
              dass den Benutzern immer aktuelle Daten zu den Themen Gesundheit und Prävention in der Region zur Verfügung stehen.
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-row no-gutters>
          <v-col class="d-flex justify-center">
            <v-btn
              variant="flat"
              @click="open = false"
            >
              <span> Schließen </span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/store/user";
const emit = defineEmits(["close"]);

const open = defineModel<boolean>('open');

const currentUser = useUserStore().currentUser;

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());

const getUser = async () => {
  api.setEndpoint(`users/me`);
  await api.getItem();
};

onMounted(() => {
  getUser();
});
</script>

<style lang="sass">
.dialog
  overflow: hidden !important

.card-text
  text-align: center

.confetti-effect
  padding-top: 20px
  text-align: center
</style>
