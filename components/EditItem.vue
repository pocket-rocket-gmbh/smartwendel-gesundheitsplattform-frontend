<template>
  <v-dialog
    v-model="open"
    width="500"
    transition="dialog-bottom-transition"
    @click:outside="emitClose()"
  >
    <v-card class="dialog">
      <v-card-title class="text-h5"
        ><span v-if="type && type === 'slug'">Link</span
        ><span v-else-if="type !== 'sendEmail'"
          >Adresse</span
        >
        <span v-if="type !== 'sendEmail'">
          ändern</span
        >
        <span v-if="type === 'sendEmail'"
          >Email an <i>{{ item?.name }}</i> senden</span
        >
      </v-card-title>
      <v-card-text v-if="type === 'email'"
        >Bitte beachten: Wenn du die E-Mail Adresse änderst, wird dein Benutzer
        wieder durch den Landkreis geprüft und freigegeben. So lange stehen
        deine Inhalte nicht zur Verfügung.
      </v-card-text>
      <v-card-text v-else-if="type === 'slug'"
        >Bitte beachten: Wenn du die bestehende URL bearbeitest, wird keine
        automatische Weiterleitung zur neuen URL erzeugt. Die alte URL wird
        nicht mehr funktionieren und bestehende Verlinkungen auf bspw. sozialen
        Medien werden dadurch unwirksam.</v-card-text
      >
      <v-card-text v-else-if="type !== 'sendEmail'"
        >Bitte beachten: Wenn du die Adresse deiner Einrichtung änderst, wird
        die Einrichtung wieder durch den Landkreis geprüft und freigegeben. So
        lange stehen deine Inhalte nicht zur Verfügung.
      </v-card-text>
      <v-card-text v-if="type === 'sendEmail'">
        <div>
          Bitte beachten: Mit dem Klick auf "Email senden" wird eine Email an
          die hinterlegte Email Adresse von {{ item?.name }} gesendet.
        </div>

        <div
          class="my-2"
          v-if="item?.user?.notification_after_manual_import_sent_at"
        >
          <i>
            Letzte E-mail wurde am:
            <span>{{
              useDatetime().parseDatetime(
                item?.user?.notification_after_manual_import_sent_at
              )
            }}</span>
            gesendet</i
          >
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-row>
          <v-col md="6" class="d-flex justify-start">
            <v-btn variant="outlined" elevation="0" @click="emitClose()">
              abbrechen
            </v-btn>
          </v-col>
          <v-col md="6" class="d-flex justify-end">
            <v-btn
              variant="outlined"
              :color="type === 'sendEmail' ? 'success' : 'error'"
              elevation="0"
              @click="emitAccept()"
            >
              <span v-if="type === 'email'">E-Mail Adresse</span
              ><span v-if="type === 'slug'">Link</span
              ><span v-else-if="type !== 'sendEmail'"
                >Adresse</span
              >
              <span v-if="type !== 'sendEmail'"
                >ändern</span
              >
              <span v-if="type === 'sendEmail'">Email senden</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default defineComponent({
  emits: ["close", "accepted"],
  props: {
    open: Boolean,
    type: String,
    item: Object,
  },
  setup(props, { emit }) {
    const emitClose = () => {
      emit("close");
    };

    const emitAccept = () => {
      emit("accepted");
    };

    return {
      emitClose,
      emitAccept,
    };
  },
});
</script>

<style lang="sass">
.dialog
  overflow: hidden !important
</style>
