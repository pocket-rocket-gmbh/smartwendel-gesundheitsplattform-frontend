<template>
  <div>
    <h2>Mein Profil</h2>
    <v-alert v-if="!setupFinished && !loading" type="info" density="compact" closable class="mt-2">
      Vervollständige die Daten deiner Einrichtung um Kurse, Ereignisse und Beiträge zu erstellen 
    </v-alert>
    <h2 class="mt-5">Bitte vervollständige deine Daten und ändere dein Passwort:</h2>
    <div class="box my-15">
      <div class="main" v-if="item">
        <h3 class="mb-4">Persönliche Daten</h3>
        <v-row justify="center">
          <v-col>
            <v-text-field 
              v-model="item.firstname"
              label="Vorname"
            />
            <v-text-field 
              v-model="item.phone"
              label="Telefonnummer*"
            />
            <h3 class="mb-4">Profilbild</h3>
            <PublicUsersProfileImage
              :preset-image-url="item.image_url"
              @setImage="setImage"
              @purgeImage="item.file = 'purge'"
              @save="saveUserData"
              class="my-3"
            />
            <v-btn
              elevation="0"
              variant="outlined"
              @click="saveUserData()"
              >
              Persönliche Daten Speichern
            </v-btn>
          </v-col>
          <v-col>
            <v-text-field
              v-model="item.lastname"
              label="Nachname"
            />
            <v-text-field
              v-model="item.email"
              label="E-Mail *"
            />
          </v-col>
        </v-row>
        <v-divider class="my-5"></v-divider>
        <v-row>
          <v-col md="6">
            <h3 class="mb-4">Passwort ändern</h3>
            <v-text-field v-model="password"
              type="password"
              label="Neues Passwort"
            />
            <v-text-field v-model="password_confirmation"
              type="password"
              label="Passwort Bestätigung"
            />
            <v-btn
              elevation="0"
              variant="outlined"
              @click="updatePassword()"
              >
              Passwort ändern
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="my-5"></v-divider>
        <div v-if="item && item.care_facilities && Array.isArray(item.care_facilities)">
          <h3 class="mb-4">Deine Einrichtungen:</h3>
          <div v-for="facilities in item.care_facilities.filter(facilities => facilities.kind === 'facility')" :key="facilities.id">
            <v-row class="d-flex align-center">
              <v-col md="6" class="d-flex my-5 has-bg-light-grey">
                <div class="pr-5">
                  <v-icon>mdi-home-city-outline</v-icon>
                </div>
                <div>
                  {{ facilities.name }}
                </div>
              </v-col>
              <v-btn elevation="0" class="mx-5" variant="outlined" @click="goToFacility(facilities.id)">
                Zur Einrichtung
              </v-btn>
            </v-row>
          </div>
        </div>
        <v-divider class="my-5"></v-divider>
        <div v-if="item && item.care_facilities && Array.isArray(item.care_facilities)">
          <h3 class="mb-4">Deine Kurse:</h3>
          <div v-for="facilities in item.care_facilities.filter(facilities => facilities.kind === 'course')" :key="facilities.id">
            <v-row class="d-flex align-center">
              <v-col md="6" class="d-flex my-5 has-bg-light-grey">
                <div class="pr-5">
                  <v-icon>mdi-school-outline</v-icon>
                </div>
                <div>
                  {{ facilities.name }}
                </div>
              </v-col>
              <v-btn elevation="0" class="mx-5" variant="outlined" @click="goToFacility(facilities.id)">
                Zum Kurs
              </v-btn>
            </v-row>
          </div>
        </div>
        <v-divider class="my-5"></v-divider>
        <div v-if="item && item.care_facilities && Array.isArray(item.care_facilities)">
          <h3 class="mb-4">Deine Veranstaltungen:</h3>
          <div v-for="facilities in item.care_facilities.filter(facilities => facilities.kind === 'event')" :key="facilities.id">
            <v-row class="d-flex align-center">
              <v-col md="6" class="d-flex my-5 has-bg-light-grey">
                <div class="pr-5">
                  <v-icon>mdi-calendar-star-four-points</v-icon>
                </div>
                <div>
                  {{ facilities.name }}
                </div>
              </v-col>
              <v-btn elevation="0" class="mx-5" variant="outlined" @click="goToFacility(facilities.id)">
                Zum Veranstaltung
              </v-btn>
            </v-row>
          </div>
        </div>
        <v-divider class="my-5"></v-divider>
        <div v-if="item && item.care_facilities && Array.isArray(item.care_facilities)">
          <h3 class="mb-4">Deine Beiträge:</h3>
          <div v-for="facilities in item.care_facilities.filter(facilities => facilities.kind === 'news')" :key="facilities.id">
            <v-row class="d-flex align-center">
              <v-col md="6" class="d-flex my-5 has-bg-light-grey">
                <div class="pr-5">
                  <v-icon>mdi-post-outline</v-icon>
                </div>
                <div>
                  {{ facilities.name }}
                </div>
              </v-col>
              <v-btn elevation="0" class="mx-5" variant="outlined" @click="goToFacility(facilities.id)">
                Zum Beitrag
              </v-btn>
            </v-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/store/user"
definePageMeta({
  layout: "admin",
});

const loading = ref(false);
const router = useRouter();
const setupFinished = ref(false);

const goToFacility = (id:string) => {
  router.push({ path: `/public/care_facilities/${id}` })
}

const currentUser = ref(useUserStore().currentUser.id)
const item = ref({
  firstname: '',
  lastname: '',
  phone: '',
  file: '',
  image_url: null
})


const password = ref('')
const password_confirmation = ref('')

const api = useCollectionApi()
api.setBaseApi(usePrivateApi())

const getUser = async () => {
  api.setEndpoint(`users/me`)
  await api.getItem()
  item.value = api.item.value
}

const setImage = (image:any) => {
  item.value.file = image
}

const saveUserData = async () => {
  api.setEndpoint(`users/${currentUser.value}`)
  const data = {
    firstname: item.value.firstname,
    lastname: item.value.lastname,
    phone: item.value.phone,
    file: item.value.file,
    image_url: item.value.image_url
  }
  await api.updateItem(data, 'Benutzer erfolgreich aktualisiert')
}

const updatePassword = async () => {
  api.setEndpoint(`users/${currentUser.value}/update-password`)
  const data = {
    password: password.value,
    password_confirmation: password_confirmation.value
  }
  const result = await api.updateItem(data, 'Passwort erfolgreich geändert')
}

onMounted(async () => {
  loading.value = true;
  getUser()
  setupFinished.value = await useUser().setupFinished();
  loading.value = false;
});

</script>
<style lang="sass">
@import "@/assets/sass/main.sass"

</style>
