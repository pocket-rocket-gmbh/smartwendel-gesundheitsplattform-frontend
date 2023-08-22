<template>
  <div>
    <h2>Mein Konto</h2>
    <v-alert type="info" density="compact" closable class="mt-2">
      Hier kannst du deine Daten vervollständigen und dein Passwort ändern.
    </v-alert>
    <v-alert v-if="!setupFinished && !loading" type="info" density="compact" closable class="mt-2">
      Bitte kontrolliere zunächst, dass du deine Einrichtung angelegt hast und wir dich freigegeben haben. Danach kannst
      du Kurse und Veranstaltungen sowie Beiträge anlegen.
    </v-alert>
    <v-alert v-if="!setupFinished && !loading" type="info" color="yellow" density="compact" closable class="mt-2">
      Bitte vervollständige deine Daten und ändere dein Passwort
    </v-alert>
    <v-divider class="my-5"></v-divider>
    <div class="d-flex">
      <v-btn elevation="0" class="mr-5" variant="outlined" color="primary" @click="goToFacility('care_facilities')">
        Zu meiner Einrichtung
      </v-btn>
      <v-btn elevation="0" class="mr-5" variant="outlined" @click="goToFacility('courses_events')">
        Zu meinen Kursen
      </v-btn>
      <v-btn elevation="0" class="mr-5" variant="outlined" @click="goToFacility('courses_events')">
        Zu meinen Veranstaltungen
      </v-btn>
      <v-btn elevation="0" class="mr-5" variant="outlined" @click="goToFacility('news_articles')">
        Zu meinen Beiträgen
      </v-btn>
    </div>
    <div class="box my-15">
      <div class="main" v-if="item">
        <h3 class="mb-4">Persönliche Daten</h3>
        <v-row justify="center">
          <v-col>
            <v-text-field v-model="item.firstname" label="Vorname" />
            <v-text-field v-model="item.lastname" label="Nachname" />
            <v-text-field v-model="item.phone" label="Telefonnummer*" />
            <v-text-field v-model="item.email" label="E-Mail *" />
            <h3 class="mb-4">Profilbild</h3>
            <PublicUsersProfileImage
              :preset-image-url="item.image_url"
              @setImage="setImage"
              @purgeImage="item.file = 'purge'"
              @save="saveUserData"
              class="my-3"
            />
            <v-btn elevation="0" variant="outlined" @click="saveUserData()"> Persönliche Daten Speichern </v-btn>
          </v-col>
          <v-col> </v-col>
        </v-row>
        <v-divider class="my-5"></v-divider>
        <v-row>
          <v-col md="6">
            <h3 class="mb-4">Passwort ändern</h3>
            <v-text-field v-model="password" type="password" label="Neues Passwort" />
            <v-text-field v-model="password_confirmation" type="password" label="Passwort Bestätigung" />
            <v-btn elevation="0" variant="outlined" @click="updatePassword()"> Passwort ändern </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/store/user";
definePageMeta({
  layout: "admin",
});

const loading = ref(false);
const router = useRouter();
const setupFinished = ref(false);

const goToFacility = (page: string) => {
  router.push({ path: `/admin/${page}` });
};

const currentUser = useUserStore().currentUser;
const item = ref({
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  file: "",
  image_url: null,
});

const password = ref("");
const password_confirmation = ref("");

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());

const getUser = async () => {
  api.setEndpoint(`users/me`);
  await api.getItem();
  item.value = api.item.value;
};

const setImage = (image: any) => {
  item.value.file = image;
};

const saveUserData = async () => {
  api.setEndpoint(`users/${currentUser.id}`);
  const data = {
    firstname: item.value.firstname,
    lastname: item.value.lastname,
    phone: item.value.phone,
    email: item.value.email,
    file: item.value.file,
    image_url: item.value.image_url,
  };
  await api.updateItem(data, "Benutzer erfolgreich aktualisiert");
};

const updatePassword = async () => {
  api.setEndpoint(`users/${currentUser.value}/update-password`);
  const data = {
    password: password.value,
    password_confirmation: password_confirmation.value,
  };
  const result = await api.updateItem(data, "Passwort erfolgreich geändert");
};

onMounted(async () => {
  loading.value = true;
  getUser();
  setupFinished.value = await useUser().setupFinished();
  loading.value = false;
});
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"
</style>
