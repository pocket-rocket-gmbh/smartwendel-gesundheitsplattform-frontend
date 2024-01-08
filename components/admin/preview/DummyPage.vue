<template>
  <v-dialog
    class="dummy-page"
    v-model="dialog"
    transition="dialog-bottom-transition"
    @click:outside="emitClose()"
    persistent
  >
    <v-card>
      <v-container class="facility-wrapper limited offset">
        <PublicCareFacilitiesImages :care-facility="item" />
        <v-row class="row">
          <v-col class="column">
            <PublicCareFacilitiesMain :care-facility="item" />
          </v-col>
          <v-col md="4" v-if="item?.kind !== 'news'">
            <PublicCareFacilitiesRight :care-facility="item" />
            <div class="mt-5" v-if="item?.kind === 'course'">
              <PublicCareFacilitiesDates :care-facility="item" />
            </div>
            <div class="mt-5">
              <PublicCareFacilitiesDocuments :care-facility="item" />
            </div>
          </v-col>
        </v-row>
      </v-container>

      <v-card-actions class="card-actions">
        <v-btn @click="emitClose()"> Schließen </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { type Facility } from "~/store/searchFilter";

const props = defineProps<{
  item: Facility;
}>();
const emit = defineEmits<{
  (event: "close"): void;
}>();

const dialog = ref(true);

const emitClose = () => {
  emit("close");
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main";

.card-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 61px;
  position: sticky;
  z-index: 10000;
}
</style>
