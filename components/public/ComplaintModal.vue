<template>
  <v-dialog
  v-model="dialog" transition="dialog-top-transition" width="900" @click:outside="emitClose()"
  >
  <v-card class="dialog-900">
      <v-card-title class="text-h5"> Beschwerde </v-card-title>
      <v-card-text>
        <div class="field">
          <v-text-field label="Titel" hide-details="auto" />
        </div>
        <div class="field d-flex align-center ga-5">
          <v-text-field label="URL" hide-details="auto" v-model="currentUrl" disabled/>
        </div>
        <div class="field">
          <v-text-field label="Name" hide-details="auto" />
        </div>
        <div class="field">
          <v-text-field label="E-Mail" hide-details="auto" />
        </div>
        <v-textarea
          counter
          maxlength="300"
          hide-details="auto"
          label="Beschreibung"
        />
        <div class="field">
          <v-select
            :items="listOptions"
            item-title="text"
            item-value="id"
            label="Typ"
            single-line
            hide-details="auto"
            persistent-hint
            return-object
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          variant="outlined"
          dark
          @click="emitClose()"
        >
          Schließen
        </v-btn>
        <v-btn
          color="blue darken-1"
          variant="outlined"
          dark
          @click="emitClose()"
        >
          senden
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts" setup>
const emit = defineEmits(["close"]);

const dialog = ref(true);

const currentUrl = ref('');

const listOptions = ref([
  { text: "Nutzungsbedingungen", value: "" },
  { text: "Gesetzverweis", value: "" },
]);

const getCurrentUrl = () => {
  currentUrl.value = window.location.href;
};

const emitClose = () => {
  emit("close");
};

onMounted(() => {
  getCurrentUrl();
});
</script>
<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
</style>
