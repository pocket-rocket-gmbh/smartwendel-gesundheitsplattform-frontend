<template>
  <v-row class="my-15">
    <v-col cols="12" sm="8" md="6" offset-md="3" offset-sm="2" >
      <v-form @submit.prevent="auth">
        <v-card :class="['pa-6', { shake: animated }]">
          <img class="is-fullwidth" src="~/assets/images/logo.png" />
          <div class="mb-3">
            <v-text-field
              v-model="email"
              class="pt-6"
              label="E-Mail Adresse"
              hide-details="auto"
              @keyup.enter="auth"
            />
          </div>
          <div class="mb-3">
            <v-text-field
              v-model="password"
              label="Passwort"
              :append-inner-icon="PasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="PasswordVisible ? 'text' : 'password'"
              @click:append-inner="PasswordVisible = !PasswordVisible"
              :error-messages="useErrors().checkAndMapErrors('email', errors)"
            />
          </div>
          <v-btn color="primary" block depressed type="submit">Login</v-btn>
          <div
            @click="emailAlreadyGiven()"
            align="center"
            class="mt-2 is-clickable"
          >
            Passwort vergessen?
          </div>

          <nuxt-link to="/register"
            ><div align="center" class="mt-6">
              Noch keinen Account? Jetzt registrieren!
            </div></nuxt-link
          >
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { useUserStore } from "@/store/user";
import { ResultStatus, ServerCallResult } from "@/types/serverCallResult";
import axios from "axios";

export default defineComponent({
  name: "Login",
  setup() {
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    const animated = ref(false);
    const errors = ref({});
    const lastRoute = ref(null);

    const router = useRouter();
    const privateApi = usePrivateApi();
    const userStore = useUserStore();
    const PasswordVisible = ref(false);

    const emailAlreadyGiven = () => {
      if (email.value?.length > 0) {
        router.push({
          path: "/password_forgotten",
          query: { email: email.value },
        });
      } else {
        return router.push({
          path: "/password_forgotten",
          query: null,
        });
      }
    };

    const auth = async () => {
      loading.value = true;
      errors.value = "";
      const data = { email: email.value, password: password.value, scope: 'health' };

      const { data: result } = await axios.post<ServerCallResult>(
        "/api/login",
        { data }
      );

      if (result.status === ResultStatus.SUCCESSFUL) {
        const jwt = result.data.jwt_token;

        localStorage.setItem("auth._token.jwt", jwt);
        localStorage.setItem(
          "smartwendelerland_gesundheitsplattform._remembered_email",
          email.value
        );

        // set user
        userStore.currentUser = result.data.user;
        userStore.loggedIn = true;

        if (userStore.currentUser) {
          // move to Dashboard
          if (
            lastRoute.value &&
            !lastRoute.value.includes("/password_forgotten") &&
            lastRoute.value !== "/password_reset" &&
            lastRoute.value !== "/register"
          ) {
            router.push({ path: lastRoute.value });
          } else if (result.data.user.role === "user") {
            router.push({ path: "/" });
          } else if (result.data.user.role === "admin") {
            router.push({ path: "/admin" });
          } else {
            router.push({ path: "/admin/care_facilities" });
          }
        }
      } else {
        loading.value = false;
        errors.value = {
          errors: [{ field_name: "email", code: "ERR_BAD_REQUEST" }],
        };
        // animate shake
        animated.value = true;
        setTimeout(() => {
          animated.value = false;
        }, 2000);
      }
    };

    onMounted(() => {
      lastRoute.value = router.options.history.state.back as null;
      if (process.client) {
        const rememberedEmail = localStorage.getItem(
          "smartwendelerland_gesundheitsplattform._remembered_email"
        );
        if (rememberedEmail) {
          setTimeout(() => {
            email.value = rememberedEmail;
          }, 300);
        }
      }
      if (lastRoute.value.includes("/password_reset")) {
        lastRoute.value = "/";
      }
    });

    return {
      email,
      password,
      loading,
      animated,
      errors,
      auth,
      emailAlreadyGiven,
      lastRoute,
      PasswordVisible,
    };
  },
});
</script>

<style lang="sass">
@import "@/assets/sass/main.sass"

.shake
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both
  transform: translate3d(0, 0, 0)

@keyframes shake
  10%,
  90%
    transform: translate3d(-1px, 0, 0)
  
  20%,
  80% 
    transform: translate3d(2px, 0, 0)
  
  30%,
  50%,
  70% 
    transform: translate3d(-4px, 0, 0)

  40%,
  60% 
    transform: translate3d(4px, 0, 0)
  
.login
  width: 50%
  @includes md
    width: 50%
  @includes sm
    width: 50%

  
</style>
