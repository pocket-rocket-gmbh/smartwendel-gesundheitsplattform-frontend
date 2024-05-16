<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-top-transition"
    width="900"
    @click:outside="emitClose()"
    v-auto-animate
  >
    <v-card class="dialog-900">
      <v-card-title class="text-h5 d-flex align-center"
        ><v-icon v-if="selectedOption" @click="selectedOption = null"
          >mdi-chevron-left</v-icon
        >Beschwerde
      </v-card-title>
      <v-card-text v-auto-animate>
        <div v-if="!selectedOption" >
          <v-row
            v-for="(option, index) in listOptions"
            :key="index"
            class="general-font-size options-select mb-2 is-clickable"
            @click="optionSelect(option)"
          >
            <v-col class="d-flex justify-start align-center">
              <span>{{ option.text }}</span>
            </v-col>
            <v-col class="d-flex justify-end align-center">
              <v-icon>mdi-chevron-right</v-icon>
            </v-col>
          </v-row>
        </div>

        <div v-if="selectedOption">
          <div class="field">
            <v-text-field
              label="Titel"
              v-model="selectedOption.text"
              hide-details="auto"
              disabled
            />
          </div>
          <div class="field">
            <v-text-field label="Name" hide-details="auto" />
          </div>
          <div class="field">
            <v-text-field label="E-Mail" hide-details="auto" />
          </div>
          <v-textarea counter maxlength="300" hide-details="auto" label="Beschreibung" />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="outlined" dark @click="emitClose()"> Schließen </v-btn>
        <v-btn color="blue darken-1" variant="outlined" dark @click="emitClose()">
          senden
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts" setup>
const emit = defineEmits(["close"]);

const dialog = ref(true);

const currentUrl = ref("");

const listOptions = ref([
  { text: "Nutzungsbedingungen", value: "" },
  { text: "Gesetzverweis", value: "" },
]);

const selectedOption = ref(null);

const optionSelect = (option: any) => {
  selectedOption.value = option;
};

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

.options-select
  border: 1px solid $dark-grey
  gap: 10px
</style>
