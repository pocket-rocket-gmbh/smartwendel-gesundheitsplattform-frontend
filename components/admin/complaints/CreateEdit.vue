<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-top-transition"
    width="900"
    @click:outside="emitClose()"
  >
    <v-card class="dialog-900">
      <v-card-title class="text-h5"> Beschwerde </v-card-title>
      <v-card-text>
        <div class="field">
          <v-text-field label="Titel" hide-details="auto" disabled />
        </div>
        <div class="field d-flex align-center ga-5">
          <v-text-field label="URL" hide-details="auto" disabled />
          <v-icon @click="goToLink(itemId)">mdi-open-in-new</v-icon>
        </div>
        <div class="field">
          <v-text-field label="Name" hide-details="auto" disabled />
        </div>
        <div class="field">
          <v-text-field label="E-Mail" hide-details="auto" disabled />
        </div>
        <v-textarea
          disabled
          counter
          maxlength="300"
          hide-details="auto"
          label="Beschreibung"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="blue darken-1"
          variant="outlined"
          dark
          @click="emitClose()"
          :loading="loadingItem"
        >
          Schließen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts" setup>
const emit = defineEmits(["close", "refreshCollection"]);
const props = defineProps<{
  itemId: string;
}>();

const listOptions = ref([
  { text: "Nutzungsbedingungen", value: "" },
  { text: "Gesetzverweis", value: "" },
]);

const loadingItem = ref(false);
const dialog = ref(true);

const emitClose = () => {
  emit("close");
};

const goToLink = (item: any) => {
  const link = `${window.location.origin}/public/care_facilities/${item?.id}?token_id=${item?.preview_token}`;
  return window.open(link, "_blank");
};
</script>
<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
</style>
