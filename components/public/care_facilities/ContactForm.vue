<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    @click:outside="emitClose()"
  >
    <v-card class="dialog-500">
      <v-card-title class="text-h5">
        Nehmen Sie Kontakt zu uns auf!
      </v-card-title>
      <v-card-text>
        <div class="field">
          <v-text-field
            v-model="item.firstname"
            hide-details="auto"
            label="Vorname"
            :error-messages="useErrors().checkAndMapErrors('firstname', errors)"
          />
        </div>
        <div class="field">
          <v-text-field
            v-model="item.lastname"
            hide-details="auto"
            label="Nachname"
            :error-messages="useErrors().checkAndMapErrors('lastname', errors)"
          />
        </div>
        <div class="field">
          <v-text-field
            v-model="item.email"
            hide-details="auto"
            label="E-Mail *"
            :error-messages="useErrors().checkAndMapErrors('email', errors)"
          />
        </div>
        <div class="field">
          <v-text-field
            v-model="item.subject"
            hide-details="auto"
            label="Betreff *"
            :error-messages="useErrors().checkAndMapErrors('subject', errors)"
          />
        </div>
        <div class="field">
          <v-textarea
            rows="7"
            hide-details="auto"
            v-model="item.message"
            label="Ihre Nachricht *"
            :error-messages="useErrors().checkAndMapErrors('message', errors)"
          />
        </div>
        <div class="gap" />
        <div class="gap" />
        <div class="gap" />
      </v-card-text>
      <v-divider></v-divider>
        <v-card-actions class="project-card-actions">
          <v-btn
            text
            @click="emitClose()"
          >
            Schließen
          </v-btn>
          <v-btn
            color="blue darken-1"
            variant="outlined"
            dark
            text
            @click="send()"
            :loading="loading"
          >
            Abschicken
          </v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { ResultStatus } from '@/types/serverCallResult'
export default defineComponent({
  name: 'PublicProjectsContactForm',
  emits: ['close'],
  props: {
    careFacilityId: String
  },
  setup(props, { emit }) {
    const item = ref({
      firstname: '',
      lastname: '',
      email: '',
      subject: '',
      message: '',
      care_facility: props.careFacilityId
    })

    const errors = ref([])
    const dialog = ref(true)
    const loading = ref(false)
    const createApi = useCollectionApi()
    createApi.setBaseApi(usePublicApi())

    const emitClose = () => {
      emit('close')
    }

    const send = async () => {
      createApi.setEndpoint(`messages`)
      loading.value = true
      const result = await createApi.createItem(item.value, 'Nachricht erfolgreich gesendet')
      loading.value = false
      if (result.status === ResultStatus.SUCCESSFUL) {
        emit('close')
      } else {
        errors.value = result.data
      }
    }

    return {
      item,
      errors,
      emitClose,
      dialog,
      loading,
      send
    }
  }
})
</script>
<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.dialog-box
  &.is-desktop
    width: 500px
  &.is-mobile
    width: 200px



</style>