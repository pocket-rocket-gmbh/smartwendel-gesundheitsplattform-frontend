<template>
  <v-row>
    <v-col sm="3" md="4" class="my-15" offset-sm="4">
      <v-card :class="['pa-6', { shake: animated }]">
        <img class="is-fullwidth" src="~/assets/images/logo.png" />
        <div v-if="userId">
          <div v-if="success" align="center">
            <div class="mb-2">Das Passwort wurde erfolgreich geändert</div>
            <v-btn
              class="button is-primary-gradient mb-3"
              @click="useRouter().push('login')"
            >
              Zum Login
            </v-btn>
          </div>
          <div v-else>
            <h3 class="mb-4">Bitte ändere Dein Passwort</h3>
            <v-text-field
              v-model="password"
              :append-inner-icon="PasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="PasswordVisible ? 'text' : 'password'"
              :rules="[rules.required, rules.password]"
              @click:append-inner="PasswordVisible = !PasswordVisible"
              label="Neues Passwort"
            />
            <v-text-field
              :append-inner-icon="PasswordConfirmationVisible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="PasswordConfirmationVisible ? 'text' : 'password'"
              v-model="password_confirmation"
              label="Passwort Bestätigung"
              :rules="[
                password === password_confirmation || 'Passwörter stimmen nicht überein',
                rules.required,
                rules.password,
              ]"
              @click:append-inner="
                PasswordConfirmationVisible = !PasswordConfirmationVisible
              "
            />
            <v-btn
              :disabled="password !== password_confirmation"
              elevation="0"
              variant="outlined"
              class="text-success"
              @click="updatePassword()"
            >
              Passwort ändern
            </v-btn>
          </div>
        </div>

        <div v-else align="center" class="mt-3 mb-3">
          <i>Benutzer nicht gefunden oder Token ungültig.</i>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { ResultStatus } from "@/types/serverCallResult";
import { rules } from "../data/validationRules";

const password = ref("");
const password_confirmation = ref("");
const animated = ref(false);
const publicApi = usePublicApi();
const route = useRoute();
const userId = ref(null);
const success = ref(false);
const error = ref(false);
const router = useRouter();
const snackbar = useSnackbar();

const PasswordVisible = ref(false);
const PasswordConfirmationVisible = ref(false);

const passwordToken = computed(() => {
  return route.query.token;
});

const getUserByToken = async () => {
  const result = await publicApi.call(
    "get",
    `/users/find-by-token/${passwordToken.value}`
  );

  if (result.status === ResultStatus.SUCCESSFUL) {
    userId.value = result.data.user_id;
  }

  // router.push("/password_forgotten")
};

const updatePassword = async () => {
  const data = {
    password: password.value,
    password_confirmation: password_confirmation.value,
  };
  const result = await publicApi.call(
    "put",
    `/users/update-password/${passwordToken.value}`,
    data
  );
  if (result.status === ResultStatus.SUCCESSFUL) {
    snackbar.showSuccess("Passwort erfolgreich geändert");
    success.value = true;
    router.push("/login");
  } else {
    error.value = true;
  }
};

onMounted(() => {
  getUserByToken();
});
</script>

<style lang="css" scoped>
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
