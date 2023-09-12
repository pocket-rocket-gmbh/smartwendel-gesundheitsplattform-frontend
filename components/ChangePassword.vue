<template>
  <div></div>
  <v-dialog
    width="500"
    v-model="opened"
    v-if="modalOpen"
    transition="dialog-bottom-transition"
    class="mt-10"
    persistent
  >
    <v-card class="dialog">
      <v-card-text class="card-text">
        <v-row>
          <v-col>
            <h3 class="mb-4">Bitte ändere aus Sicherheitsgründen dein Passwort!</h3>
            <v-text-field
              v-model="password"
              label="Neues Passwort"
              :append-inner-icon="PasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="PasswordVisible ? 'text' : 'password'"
              :rules="[rules.required, rules.password]"
              @click:append-inner="PasswordVisible = !PasswordVisible"
            />
            <v-text-field
              :append-inner-icon="PasswordConfirmationVisible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="PasswordConfirmationVisible ? 'text' : 'password'"
              v-model="password_confirmation"
              label="Passwort Bestätigung"
              @click:append-inner="
                PasswordConfirmationVisible = !PasswordConfirmationVisible
              "
              :rules="[
                password === password_confirmation || 'Passwörter stimmen nicht überein',
                rules.required,
                rules.password,
              ]"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-row no-gutters>
          <v-col class="d-flex justify-center">
            <v-btn
              :disabled="password !== password_confirmation"
              variant="flat"
              color="primary"
              @click="updatePassword()"
            >
              <span> Passwort ändern </span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/store/user";
import { rules } from "../data/validationRules";
const emit = defineEmits(["close", "changed"]);
const props = defineProps({
  open: Boolean,
});

const PasswordVisible = ref(false);
const PasswordConfirmationVisible = ref(false);

const opened = ref(props.open);
const currentUser = useUserStore().currentUser;
const router = useRouter();
const password = ref("");
const password_confirmation = ref("");

const modalOpen = ref(true);
const snackbar = useSnackbar();

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());

const getUser = async () => {
  api.setEndpoint(`users/me`);
  await api.getItem();
};

const updatePassword = async () => {
  api.setEndpoint(`users/${currentUser.value}/update-password`);
  const data = {
    password: password.value,
    password_confirmation: password_confirmation.value,
  };
  const result = await api.updateItem(data, "Passwort erfolgreich geändert");
  modalOpen.value = false;
  snackbar.showSuccess("Passwort aktualisert");
  emit("changed", true);
  getUser();
};

onMounted(() => {
  getUser();
});
</script>

<style lang="sass">
.dialog
  overflow: hidden !important

.card-text
  text-align: center

.confetti-effect
  padding-top: 20px
  text-align: center
</style>
