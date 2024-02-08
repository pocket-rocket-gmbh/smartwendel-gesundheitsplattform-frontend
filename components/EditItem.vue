<template>
  <v-dialog
    v-model="open"
    width="500"
    transition="dialog-bottom-transition"
    @click:outside="emitClose()"
  >
    <v-card class="dialog">
      <v-card-title class="text-h5">Adresse ändern</v-card-title>
      <v-card-text v-if="type === 'email'">Bitte beachten: Wenn Sie die E-Mail Adresse ändern, wird dein Benutzer wieder durch den Landkreis geprüft und freigegeben. So lange stehen deine Inhalte nicht zur Verfügung. </v-card-text>
      <v-card-text v-else>Bitte beachten: Wenn Sie die Adresse deiner Einrichtung ändern, wird die Einrichtung wieder durch den Landkreis geprüft und freigegeben. So lange stehen deine Inhalte nicht zur Verfügung. </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-row>
          <v-col md="6" class="d-flex justify-start">
            <v-btn variant="outlined" elevation="0" @click="emitClose()"> abbrechen </v-btn>
          </v-col>
          <v-col md="6" class="d-flex justify-end">
            <v-btn variant="outlined" color="error" elevation="0" @click="emitAccept()"> <span v-if="type === 'email'">E-Mail Adresse ändern</span><span v-else>Adresse ändern </span></v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default defineComponent({
  emits: ["close", "accepted"],
  props : {
    open: Boolean,
    type: String
  },
  setup(props, { emit }) {

    const emitClose = () => {
      emit("close");
    };

    const emitAccept = () => {
      emit('accepted');
    }

    return {
      emitClose,
      emitAccept
    };
  },
});
</script>

<style lang="sass">
.dialog
  overflow: hidden !important
</style>
