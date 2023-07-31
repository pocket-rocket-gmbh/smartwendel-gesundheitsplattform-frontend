<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-top-transition"
    width="900"
    @click:outside="emitClose()"
  >
    <v-card class="dialog-900">
      <v-card-title class="text-h5">
        Benutzer
      </v-card-title>
      <v-card-text>
        <div class="field">
          <v-text-field
            disabled
            v-model="item.firstname" 
            label="Vorname"
            hide-details="auto"
          />
        </div>
        <div class="field">
          <v-text-field
            disabled
            v-model="item.lastname"
            label="Nachname"
            hide-details="auto"
          />
        </div>
        <div class="field">
          <v-text-field
            disabled
            v-model="item.phone"
            label="Telefonnummer"
            :error-messages="useErrors().checkAndMapErrors('phone', errors)"
            hide-details="auto"
          />
        </div>
        <div class="field">
          <v-text-field
            disabled
            v-model="item.email"
            label="E-Mail"
            :error-messages="useErrors().checkAndMapErrors('email', errors)"
            hide-details="auto"
          />
        </div>
        <div class="field">
          <v-select
            v-model="item.role"
            :items="roles"
            item-title="name"
            item-value="id"
            label="Rolle"
            single-line
            hide-details="auto"
          />
        </div>
      </v-card-text>
      <v-divider class="my-5"></v-divider>
      <div v-if="item && item.care_facilities && Array.isArray(item.care_facilities)">
        <h3 class="mb-4 mx-5">Einrichtungen:</h3>
        <div v-for="facilities in item.care_facilities.filter(facilities => facilities.kind === 'facility')" :key="facilities.id" class="mx-10">
          <v-row class="d-flex align-center">
            <v-col class="d-flex my-5 has-bg-light-grey">
              <div class="pr-5">
                <v-icon>mdi-home-city-outline</v-icon>
              </div>
              <div>
                {{ facilities.name }}
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
      <v-divider class="my-5"></v-divider>
      <div v-if="item && item.care_facilities && Array.isArray(item.care_facilities)">
        <h3 class="mb-4 mx-5">Kurse:</h3>
        <div v-for="facilities in item.care_facilities.filter(facilities => facilities.kind === 'course')" :key="facilities.id" class="mx-10">
          <v-row class="d-flex align-center">
            <v-col class="d-flex my-5 has-bg-light-grey">
              <div class="pr-5">
                <v-icon>mdi-school-outline</v-icon>
              </div>
              <div>
                {{ facilities.name }}
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
      <v-divider class="my-5"></v-divider>
      <div v-if="item && item.care_facilities && Array.isArray(item.care_facilities)">
        <h3 class="mb-4 mx-5">Veranstaltungen:</h3>
        <div v-for="facilities in item.care_facilities.filter(facilities => facilities.kind === 'event')" :key="facilities.id" class="mx-10">
          <v-row class="d-flex align-center">
            <v-col class="d-flex my-5 has-bg-light-grey">
              <div class="pr-5">
                <v-icon>mdi-calendar-star-four-points</v-icon>
              </div>
              <div>
                {{ facilities.name }}
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
      <v-divider class="my-5"></v-divider>
      <div v-if="item && item.care_facilities && Array.isArray(item.care_facilities)">
        <h3 class="mb-4 mx-5">Beiträge:</h3>
        <div v-for="facilities in item.care_facilities.filter(facilities => facilities.kind === 'news')" :key="facilities.id" class="mx-10">
          <v-row class="d-flex align-center">
            <v-col class="d-flex my-5 has-bg-light-grey">
              <div class="pr-5">
                <v-icon>mdi-post-outline</v-icon>
              </div>
              <div>
                {{ facilities.name }}
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          @click="emitClose()"
        >
          Schließen
        </v-btn>
        <v-btn
          color="blue darken-1"
          variant="outlined"
          dark
          @click="handleCta()"
          :loading="loadingItem"
        >
          <span v-if="itemId">Speichern</span>
          <span v-else>Einladen</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { ResultStatus } from '@/types/serverCallResult'
import axios from 'axios'
export default defineComponent({
  emits: ['close'],
  props: {
    itemId: String
  },
  setup (props, { emit }) {
    const loadingItem = ref(false)
    const dialog = ref(true)
    const errors = ref([])

    const item = ref({
      name: '',
      register_token: ''
    })
    const roles = ref([
      { name: 'Einrichtung', id: 'facility_owner'},
      { name: 'Standard Benutzer', id: 'user'},
      { name: 'Super Administrator', id: 'care_facility_admin'},
      { name: 'Administrator', id: 'admin'}
    ])

    const showApi = useCollectionApi()
    showApi.setBaseApi(usePrivateApi())

    const createUpdateApi = useCollectionApi()
    createUpdateApi.setBaseApi(usePrivateApi())

    const getItem = async () => {
      showApi.setEndpoint(`users/${props.itemId}`)

      loadingItem.value = true
      await showApi.getItem()
      loadingItem.value = false
      item.value = showApi.item.value
    }

    const handleCta = () => {
      if (props.itemId) {
        save()
      } else {
        invite()
      }
    }

    const invite = async () => {
      createUpdateApi.setEndpoint(`users/invite`)
      loadingItem.value = true

      const res = await axios.post("/api/get_register_token");
      item.value.register_token = res.data

      const result = await createUpdateApi.createItem(item.value, 'Benutzer erfolgreich eingeladen')
      loadingItem.value = false
      if (result.status === ResultStatus.SUCCESSFUL) {
        emit('refreshCollection')
        emit('close')
      } else {
        errors.value = result.data
      }
    }

    const save = async () => {
      createUpdateApi.setEndpoint(`users/${props.itemId}`)
      loadingItem.value = true
      const result = await createUpdateApi.updateItem(item.value, 'Benutzer erfolgreich aktualisiert')
      loadingItem.value = false
      if (result.status === ResultStatus.SUCCESSFUL) {
        emit('refreshCollection')
        emit('close')
      } else {
        errors.value = result.data
      }
    }

    onMounted(() => {
      if (props.itemId) {
        getItem()
      }
    })
    
    const emitClose = () => {
      emit('close')
    }

    return {
      loadingItem,
      dialog,
      item,
      handleCta,
      emitClose,
      roles,
      errors
    }
  }
})
</script>

<style lang="sass">
</style>