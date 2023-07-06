<template>
  <div>
    <h2>Mein Profil</h2>
    <v-alert v-if="!setupFinished && !loading" type="info" density="compact" closable class="mt-2">
      Vervollständige die Daten deiner Einrichtung um Kurse, Ereignisse und Beiträge zu erstellen
    </v-alert>
    <h2 class="mt-5">Bitte vervollständige Deine Daten und ändere dein Passwort:</h2>

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
        <h3 class="mb-4">Vervollständige Deine Einrichtungen:</h3>
        <div v-for="facilities in item.care_facilities" >
          <v-row class="d-flex align-center">
            <v-col md="6" class="d-flex my-5">
              <div class="pr-5">
                <v-icon>mdi-home-city-outline</v-icon>
              </div>
              <div>
                {{ facilities.name }}
              </div>
          </v-col>
          <v-btn
              elevation="0"
              variant="outlined"
              @click="goToFacility(facilities.id)"
              >
              Zur Einrichtung
            </v-btn>
          </v-row>
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

const user = useUser();
const loading = ref(false);
const router = useRouter();

const itemsExist = ref(false);
const setupFinished = ref(false);


const handleItemsLoaded = (items: any[]) => {
  itemsExist.value = !!items.length;
};

  const goToFacility = (id:string) => {
      router.push({ path: `/public/care_facilities/${id}` })
    }

const currentUser = ref(useUserStore().currentUser)
    const item = ref({
      firstname: '',
      lastname: '',
      file: '',
      image_url: null
    })
    const password = ref('')
    const password_confirmation = ref('')

    const route = useRoute()

    const api = useCollectionApi()
    api.setBaseApi(usePrivateApi())

    const userId = computed(() => {
      return route.params.id
    })

    const getUser = async () => {
      api.setEndpoint(`users/me`)
      await api.getItem()
      item.value = api.item.value
    }

    const setImage = (image:any) => {
      item.value.file = image
    }

    const saveUserData = async () => {
      api.setEndpoint(`users/${userId.value}`)
      const data = {
        firstname: item.value.firstname,
        lastname: item.value.lastname,
        file: item.value.file
      }
      await api.updateItem(data, 'Benutzer erfolgreich aktualisiert')
    }

    const updatePassword = async () => {
      api.setEndpoint(`users/${userId.value}/update-password`)
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
.v-dialog--custom
  width: 30%
</style>
