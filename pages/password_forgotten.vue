<template>
  <v-row class="my-10 general-font-size">
    <v-col cols="12" sm="8" md="6" offset-md="3" offset-sm="2">
      <v-card :class="['pa-6', { shake: animated }]">
        <img class="is-fullwidth" src="~/assets/images/logo.png" />

        <div v-if="resetSuccessful" class="mt-3" align="center">
          <span class="general-font-size is-secondary-color"
            >Das Zurücksetzen Deines Passworts wurde angefragt.<br />Bitte folge
            den Anweisungen in der E-Mail.</span
          >
          <div class="mt-5">
            <v-btn
              color="primary"
              @click="toLogin"
              class="general-font-size"
              size="large"
              block
              depressed
              >Jetzt anmelden</v-btn
            >
          </div>
        </div>
        <div v-else>
          <div class="field">
            <v-text-field
              v-model="email"
              class="pt-6"
              label="E-Mail Adresse"
              hide-details="auto"
              @keyup.enter="auth"
              :error-messages="useErrors().checkAndMapErrors('email', errors)"
            />
          </div>
          <v-btn
            class="mb-6 general-font-size"
            color="primary"
            size="large"
            block
            depressed
            @click="auth"
          >
            Neues Passwort anfordern
          </v-btn>
          <v-btn class="general-font-size" block depressed @click="goBack">
            zurück
          </v-btn>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { ResultStatus } from "@/types/serverCallResult";

export default defineComponent({
  name: "Login",
  setup() {
    const email = ref("");
    const loading = ref(false);
    const animated = ref(false);
    const errors = ref({});
    const resetSuccessful = ref(false);
    const publicApi = usePublicApi();
    const router = useRouter();
    const route = useRoute();

    const givenEmail = computed(() => {
      return route.query.email as any;
    });

    const toLogin = () => {
      router.push({ path: "/login" });
    };

    const auth = async () => {
      loading.value = true;
      errors.value = {};
      const data = { email: email.value };

      const result = await publicApi.call(
        "post",
        "/users/reset-password",
        data
      );

      if (result.status === ResultStatus.SUCCESSFUL) {
        localStorage.setItem("project_platform._remembered_email", email.value);
        resetSuccessful.value = true;
      } else {
        errors.value = {
          errors: [{ field_name: "email", code: "reset_password.failed" }],
        };
        loading.value = false;

        // animate shake
        animated.value = true;
        setTimeout(() => {
          animated.value = false;
        }, 1000);
      }
    };

    const goBack = () => {
      router.push({ path: "/login" });
    };

    onMounted(() => {
      const rememberedEmail = localStorage.getItem(
        "smartwendelerland_gesundheitsplattform._remembered_email"
      );
      if (rememberedEmail && !givenEmail) {
        setTimeout(() => {
          email.value = rememberedEmail;
        }, 300);
      }
      if (givenEmail) {
        email.value = "";
        email.value = givenEmail.value;
      }
    });

    return {
      email,
      loading,
      animated,
      errors,
      resetSuccessful,
      auth,
      goBack,
      toLogin,
    };
  },
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
