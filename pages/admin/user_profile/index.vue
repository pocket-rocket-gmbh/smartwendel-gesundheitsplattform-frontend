<template>
  <div>
    <span class="general-font-size is-dark-grey font-weight-bold">Mein Konto</span>
    <v-alert type="info" density="compact" closable class="mt-2 general-font-size">
      Hier kannst du deine Daten vervollständigen und dein Passwort ändern.
    </v-alert>
    <v-alert
      v-if="!setupFinished && !loading"
      type="info"
      density="compact"
      closable
      class="mt-2 general-font-size"
    >
      Bitte kontrolliere zunächst, dass du deine Einrichtung angelegt hast und
      wir dich freigegeben haben. Danach kannst du Kurse und Veranstaltungen
      sowie Beiträge anlegen.
    </v-alert>
    <v-alert
      v-if="!setupFinished && !loading"
      type="info"
      color="yellow"
      density="compact"
      closable
      class="mt-2 general-font-size"
    >
      Bitte vervollständige deine Daten und ändere dein Passwort
    </v-alert>
    <v-divider class="my-10"></v-divider>
    <div class="box my-15">
      <div class="main" v-if="item">
        <span class="general-font-size is-dark-grey font-weight-bold mb-4">Persönliche Daten</span>
        <v-form ref="form">
          <v-row justify="center">
            <v-col>
              <v-text-field v-model="item.firstname" label="Vorname" />
              <v-text-field v-model="item.lastname" label="Nachname" />
              <v-text-field
                v-model="item.phone"
                :rules="[rules.required, rules.validateNumber]"
                label="Telefonnummer*"
                type="number"
              />
              <v-alert type="info" density="compact" class="my-2" v-if="editInformations"
                > Diese Funktion ist noch nicht implementiert, Änderungen werden noch nicht gespeichert</v-alert>

              <v-alert type="warning" density="compact" class="my-2" v-if="emailConfirmation.length"
                >Aufgrund dieser Änderungen muss dein Benutzer durch den Landkreis neu geprüft und freigegeben werden. So lange stehen deine Inhalte nicht zur Verfügung.</v-alert
              >
              <div :class="[
              editInformations
                ? 'has-bg-light-red pt-5'
                : '',
            ]">
                <v-text-field
                v-model="item.email"
                :rules="[rules.required, rules.email]"
                label="E-Mail *"
                :disabled="!editInformations"
              />
              <v-text-field
                v-if="editInformations"
                v-model="emailConfirmation"
                label="E-Mail Bestätigung *"
                :disabled="!editInformations"
                :rules="[
                  item.email === emailConfirmation ||
                    'Passwörter stimmen nicht überein',
                  rules.required,
                  rules.email,
                ]"
              />
              </div>             
              <div class="my-5" >
                <span v-if="editInformations">
                  <v-btn variant="outlined" @click="editInformations = false" :disabled="!item.email.includes('@') || !emailConfirmation.includes('@') || item.email !== emailConfirmation">
                    Neue E-Mail-Adresse speichern
                  </v-btn>
                </span>
                <span v-else>
                  <v-btn variant="outlined" @click="confirmEditDialogOpen = true">
                    E-Mail-Adresse ändern
                  </v-btn>
                </span>
              </div>

              <EditItem
                :open="confirmEditDialogOpen"
                type="email"
                @accepted="
                  editInformations = true;
                  confirmEditDialogOpen = false;
                "
                @close="
                  confirmEditDialogOpen = false;
                  editInformations = false;
                "
              />
              <span class="general-font-size is-dark-grey font-weight-bold mb-4">Profilbild</span>
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
                :disabled="validateFrom"
              >
                Persönliche Daten Speichern
              </v-btn>
            </v-col>
          </v-row>
        </v-form>

        <v-divider class="my-10"></v-divider>
        <v-row>
          <v-col md="6">
            <span class="general-font-size is-dark-grey font-weight-bold mb-4">Passwort ändern</span>
            <v-text-field
              v-model="password"
              :append-inner-icon="PasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="PasswordVisible ? 'text' : 'password'"
              :rules="[rules.required, rules.password]"
              @click:append-inner="PasswordVisible = !PasswordVisible"
              label="Neues Passwort"
            />
            <v-text-field
              :append-inner-icon="
                PasswordConfirmationVisible ? 'mdi-eye-off' : 'mdi-eye'
              "
              :type="PasswordConfirmationVisible ? 'text' : 'password'"
              v-model="password_confirmation"
              label="Passwort Bestätigung"
              :rules="[
                password === password_confirmation ||
                  'Passwörter stimmen nicht überein',
                rules.required,
                rules.password,
              ]"
              @click:append-inner="
                PasswordConfirmationVisible = !PasswordConfirmationVisible
              "
            />
            <v-btn
              :disabled="
                !password.length ||
                !password_confirmation.length ||
                password !== password_confirmation ||
                password_confirmation.length < 6 ||
                password.length < 6
              "
              variant="flat"
              color="primary"
              @click="updatePassword()"
            >
              <span> Passwort ändern </span>
            </v-btn>
            <div class="mt-3" v-if="currentUser?.password_changed_at">
              <span
                ><i
                  >Letzte Änderung am:
                  {{
                    useDatetime().parseDatetime(
                      currentUser?.password_changed_at
                    )
                  }}</i
                >
              </span>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { rules } from "../../../data/validationRules";
import { useUserStore } from "@/store/user";
import { VForm } from "vuetify/lib/components/index.mjs";
import { tr } from "date-fns/locale";
definePageMeta({
  layout: "admin",
});

const loading = ref(false);
const router = useRouter();
const setupFinished = ref(false);

const editInformations = ref(false);

const confirmEditDialogOpen = ref(false);

const form = ref<VForm>();

const validateFrom = computed(() => {
  const allValid = form.value?.isValid;
  if (!allValid) {
    return true;
  }
  return false;
});

const currentUser = useUserStore().currentUser;
const item = ref({
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  file: "",
  image_url: null,
});

const emailConfirmation = ref("");

const password = ref("");
const password_confirmation = ref("");

const PasswordVisible = ref(false);
const PasswordConfirmationVisible = ref(false);

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
