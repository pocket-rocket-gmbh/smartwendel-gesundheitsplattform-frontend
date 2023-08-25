<template>
  <div></div>
  <v-dialog
    width="500"
    v-model="open"
    v-if="modalOpen"
    transition="dialog-bottom-transition"
    class="mt-10"
    persistent
  >
    <v-card class="dialog">
      <v-card-text class="card-text">
        <v-row>
          <v-col>
            <h3 class="mb-4">Passwort ändern</h3>
            <v-text-field v-model="password" type="password" label="Neues Passwort"
                />
            <v-text-field
              v-model="password_confirmation"
              type="password"
              label="Passwort Bestätigung"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-row no-gutters>
          <v-col class="d-flex justify-center">
            <v-btn
              elevation="0"
              variant="outlined"
              class="text-success"
              @click="updatePassword()"
            >
              Passwort ändern
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { useUserStore } from "@/store/user";
import { rules } from "../data/validationRules";
export default defineComponent({
  emits: ["close", "accepted"],
  props: {
    open: Boolean,
  },

  setup(props, { emit }) {
    const emitClose = async () => {
      emit("close");
    };

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
      useUser().logout();
      reload();
      snackbar.showSuccess("bitten melden Sie sich erneut an");
    };

    const reload = () => {
      router.push({ path: "/login" });
    };

    onMounted(() => {
      getUser();
    });

    return {
      emitClose,
      rules,
      password,
      getUser,
      updatePassword,
      password_confirmation,
      modalOpen,
    };
  },
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
