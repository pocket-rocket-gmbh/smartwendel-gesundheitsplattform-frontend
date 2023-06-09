<template>
  <v-container>
    <div class="box my-15">
      <div class="main" v-if="item">
        <div class="headline mb-3">Hallo {{ item.firstname }} {{ item.lastname }}</div>
          <div class="mb-3">Willkommen in Deinem persönlichen Account. Hier kannst du deine Daten und dein Passwort ändern.</div>
          <v-divider class="mb-10"></v-divider>
          <v-row justify="center">
            <v-col
            cols="12"
            xs="12"
            md="6"
            lg="6"
            >
          <div class="mb-4">Persönliche Daten</div>
          <v-text-field 
            v-model="item.firstname"
            label="Vorname"
          />
          <v-text-field
            v-model="item.lastname"
            label="Nachname"
          />
          <div class="mb-4">Profilbild</div>
          <PublicUsersProfileImage
            :preset-image-url="item.image_url"
            @setImage="setImage"
            @purgeImage="item.file = 'purge'"
            @save="saveUserData"
          />
          <v-btn 
            class="button is-primary-gradient is-rounded my-5"
            @click="saveUserData()"
          >
            Persönliche Daten Speichern
          </v-btn>
        </v-col>
        <v-col
        cols="12"
        xs="12"
        md="6"
        lg="6"
        >
          <div class="mb-4">Passwort ändern</div>
          <v-text-field v-model="password"
            type="password"
            label="Neues Passwort"
          />
          <v-text-field v-model="password_confirmation"
            type="password"
            label="Passwort Bestätigung"
          />
          <v-btn 
          class="button is-primary-gradient is-rounded mb-3"
          @click="updatePassword()"
          >
          Passwort ändern
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>

  </v-container>

</template>

<script lang="ts">
import { useUserStore } from '@/store/user'
export default defineComponent({
  setup() {
    const loadingItem = ref(false)
    const currentUser = ref(useUserStore().currentUser)
    const item = ref({
      notification_preferences: [],
      firstname: '',
      lastname: '',
      file: '',
      image_url: null
    })
    const password = ref('')
    const password_confirmation = ref('')

    const activeTab = ref('')
    const route = useRoute()

    const api = useCollectionApi()
    api.setBaseApi(usePrivateApi())

    const userId = computed(() => {
      return route.params.id
    })

    onMounted(() => {
      getUser()
      activeTab.value = 'personal_data'
    })

    const getUser = async () => {
      api.setEndpoint(`users/${route.params.id}`)

      loadingItem.value = true
      await api.getItem()
      loadingItem.value = false
      item.value = api.item.value
    }

    const setImage = (image:any) => {
      item.value.file = image
    }

    const personalData = () => {
      activeTab.value = 'personal_data'
    }

    const notificationsData = () => {
      activeTab.value = 'notifications_data'
    }

    const saveUserData = async () => {
      api.setEndpoint(`users/${userId.value}`)
      loadingItem.value = true
      const data = {
        firstname: item.value.firstname,
        lastname: item.value.lastname,
        file: item.value.file
      }
      await api.updateItem(data, 'Benutzer erfolgreich aktualisiert')
      loadingItem.value = false
    }

    const saveEmailPreferences = async () => {
      api.setEndpoint(`users/${userId.value}`)
      loadingItem.value = true
      const data = {
        notification_preferences: item.value.notification_preferences,
      }
      await api.updateItem(data, 'E-Mail Benachrichtigungen erfolgreich aktualisiert')
      loadingItem.value = false
    }

    const updatePassword = async () => {
      api.setEndpoint(`users/${userId.value}/update-password`)
      loadingItem.value = true
      const data = {
        password: password.value,
        password_confirmation: password_confirmation.value
      }
      const result = await api.updateItem(data, 'Passwort erfolgreich geändert')
      loadingItem.value = false
    }

    return {
      item,
      password,
      password_confirmation,
      saveUserData,
      saveEmailPreferences,
      updatePassword,
      setImage,
      activeTab,
      personalData,
      notificationsData,
      currentUser
    }
  }
})
</script>

<style lang="sass" scoped>
.view-selected
  color: white
  background-color: #015281

.view-not-selected
  background-color: white

</style>