<template>
  <v-dialog
    v-model="dialog"
    width="500"
    transition="dialog-bottom-transition"
    @click:outside="emitClose()"
  >
    <v-card>
      <v-card-title class="text-h5">
        Benachrichtigung senden
      </v-card-title>
      <v-card-text>
        <div>Senden Sie eine Benachrichtung um die Nutzer über <strong>{{ notificationKindExplicit }}</strong> zu informieren.</div>
        <div class="mt-2 mb-3" v-if="itemName"><strong>Name:</strong> {{ itemName }}</div>

        <div class="field">
          <v-text-field
            hide-details="auto"
            v-model="headline"
            label="Betreff"
          />
        </div>

        <div class="field">
          <v-textarea
            rows="7"
            hide-details="auto"
            v-model="text"
            label="Text"
          />
        </div>
        <v-checkbox
          v-model="appNotificationEnabled"
          label="Auch als App Push Benachrichtigung an alle Nutzer:innen senden"
          :value="true"
          hide-details
        />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          elevation="0"
          @click="emitClose()"
        >
          Keine Nachricht senden
        </v-btn>
        <v-btn
          variant="outlined"
          color="success"
          elevation="0"
          @click="sendNotification()"
        >
          Jetzt senden
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default defineComponent({
  emits: ['close'],
  props: {
    notificationKindExplicit: String,
    notificationPreFilledHeadline: String,
    notificationPreFilledText: String,
    notificationCtaLink: String,
    kind: String,
    itemName: String,
    itemId: String
  },
  setup (props, { emit }) {
    const dialog = ref(true)
    const headline = ref('')
    const text = ref('')
    const appNotificationEnabled = ref(true)

    const api = useCollectionApi()
    api.setBaseApi(usePrivateApi())
    api.setEndpoint(`notifications/send`)

    const emitClose = () => {
      emit('close')
    }

    onMounted(() => {
      if (props.notificationPreFilledHeadline) {
        headline.value = props.notificationPreFilledHeadline
      }

      if (props.notificationPreFilledText) {
        text.value = props.notificationPreFilledText.replace("[[name]]", props.itemName)
      }
    })

    const sendNotification = async () => {

      let cta_link = ''
      if (props.notificationCtaLink) {
        cta_link = props.notificationCtaLink.replace("[[itemId]]", props.itemId)
      }

      const data = {
        kind: props.kind,
        headline: headline.value,
        text: text.value,
        cta_link: cta_link,
        app_notification_enabled: appNotificationEnabled.value
      }

      await api.createItem(data, 'Benachrichtigung erfolgreich versendet')
      emit('close')
    }

    return {
      dialog,
      headline,
      text,
      appNotificationEnabled,
      emitClose,
      sendNotification
    }
  }
})
</script>

<style>

</style>