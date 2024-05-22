<template>
  <div class="register-wrapper is-dark-grey" v-if="loading">
    <div
      class="register-now elevation-10 d-flex flex-column justify-center align-center text-primary text-h4 font-weight-medium"
    >
      <span class="mb-10">Token wird überprüft</span>
      <v-progress-linear
        color="primary"
        indeterminate
        rounded
        height="10"
      ></v-progress-linear>
    </div>
  </div>
  <div class="register-wrapper is-dark-grey" v-else>
    <div
      class="register-now elevation-10"
      :class="['card', { shake: animated }]"
      v-if="hasToken"
    >
      <div v-if="!notWantedSuccessful">
        <div
          class="d-flex justify-center align-center text-primary thank-you font-weight-medium"
          lang="de"
        >
          <span
            >Profilinhaberschaft für die Einrichtung "{{ careFacilityName }}"
            übertragen</span
          >
        </div>

        <div>
          <v-row class="my-5">
            <v-col class="general-font-size d-flex ga-8 mt-0 pt-0">
              <div class="pa-0 ma-0">
                <v-checkbox
                  v-model="owner_requested_maintenance"
                  class="ma-0 pa-0"
                  @click="submitButtonDisabledCondition = !submitButtonDisabledCondition"
                >
                </v-checkbox>
              </div>
              <div class="general-font-size">
                Hiermit erteile ich dem Landkreis Sankt Wendel meine Zustimmung zur
                Veröffentlichung und Aktualisierung der Profilseite zu meiner Einrichtung
                und der von mir angebotenen Leistungen auf der Gesundheits- und
                Pflegeplattform (<a href="www.gesundes-wnd.de">www.gesundes-wnd.de</a>).
                Eine Vorschau meines Profils inklusive aller dort eingepflegten
                Informationen und Bilder wurde mir im Vorfeld zur Ansicht zur Verfügung
                gestellt. Ich habe zur Kenntnis genommen, dass der Landkreis im Falle der
                Inhaberschaftsübertragung keinerlei Gewähr für die Richtigkeit,
                Vollständigkeit oder Aktualität der Profildaten übernimmt. Ich habe das
                Recht meine Einwilligung jederzeit zu widerrufen und dem Landkreis die
                zugehörige Verarbeitung meiner personenbezogenen Daten zu untersagen.
                <div class="mt-5">
                  Du möchtest nicht, dass dein Profil auf der GPP erscheint? Dann setze
                  dich bitte zwecks Löschung der Daten mit uns in Verbindung:
                  <a href="mailto:smartcity@lkwn.de">smartcity@lkwnd.de</a>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                class="mt-5 general-font-size"
                size="large"
                block
                depressed
                @click="goBack"
                >Abbrechen</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                color="primary"
                class="mt-5 general-font-size"
                size="large"
                block
                depressed
                :disabled="!submitButtonDisabledCondition"
                @click="confirmOwnerWantedMaintenance"
                >Bestätigen</v-btn
              >
            </v-col>
          </v-row>
        </div>
      </div>

      <div align="center" class="mt-5" v-if="notWantedSuccessful">
        <div class="d-flex flex-column align-center justify-center">
          <span class="thank-you text-primary font-weight-medium mb-10"> Danke </span>
          <span class="general-font-size">
            Deine Entscheidung wurde erfolgreich übermittelt.
          </span>
        </div>
        <div class="mt-5">
          <v-btn color="primary" @click="toHome" block depressed>Zur Startseite</v-btn>
        </div>
      </div>
    </div>

    <div
      class="register-now elevation-10 d-flex flex-column justify-center align-center text-primary text-h4 font-weight-medium"
      :class="['card', { shake: animated }]"
      v-else
    >
      <div class="d-flex align-center">
        <v-icon class="mr-3">mdi-alert-circle-outline</v-icon
        ><span>Das Token ist ungültig.</span>
      </div>
      <v-btn
        color="primary"
        class="mt-5 general-font-size"
        size="large"
        block
        depressed
        @click="router.push({ path: '/login' })"
        >Zum Login</v-btn
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ResultStatus, ServerCallResult } from "@/types/serverCallResult";
import errorCodes from "~/data/errorCodes";
const careFacilityName = ref("");
const loading = ref(true);
const animated = ref(false);
const router = useRouter();
const currentToken = ref("");
const hasToken = ref(false);
const notWantedSuccessful = ref(false);

const getToken = () => {
  currentToken.value = String(router.currentRoute.value.query.token_id);
};

const toHome = () => {
  router.push({ path: "/" });
};

const careFacilityId = ref("");

const publicApi = usePublicApi();
const validateToken = async () => {
  loading.value = true;
  const result = await publicApi.call(
    "get",
    `/users/find-by-onboarding-token/${currentToken.value}`
  );
  if (result.status === ResultStatus.SUCCESSFUL) {
    const data = result;
    if (data) {
      hasToken.value = true;
      careFacilityId.value = data?.data?.care_facility?.id;
      careFacilityName.value = data?.data?.care_facility?.name;
      owner_requested_maintenance.value =
        data?.data?.care_facility?.owner_requested_maintenance;
    }
    loading.value = false;
  } else {
    hasToken.value = false;
    loading.value = false;
  }
};

const owner_requested_maintenance = ref(false);
const submitButtonDisabledCondition = ref(false);

const confirmOwnerWantedMaintenance = async () => {
  const data = {
    owner_requested_maintenance: owner_requested_maintenance.value,
  };
  const result = await publicApi.call(
    "post",
    `/users/onboarding-health/${currentToken.value}`,
    data
  );
  if (result.status === ResultStatus.SUCCESSFUL) {
    notWantedSuccessful.value = true;
  } else {
    loading.value = false;
    animated.value = true;
    setTimeout(() => {
      animated.value = false;
    }, 1000);
  }
};

const goBack = () => {
  router.push({
    path: "/public/care_facilities/" + careFacilityId.value,
    query: { token_id: router.currentRoute.value.query.previewToken },
  });
};

const scrollToTop = () => {
  window.scrollTo(0, 0);
};

onMounted(async () => {
  getToken();
  await validateToken();
  scrollToTop();
  if (owner_requested_maintenance.value) {
    notWantedSuccessful.value = true;
  }
});
</script>

<style lang="scss">
@import "@/assets/sass/main.sass";

.register-wrapper {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 5rem;

  @include md {
    padding: 0;
    gap: 3rem;
  }

  .register-now {
    @include md {
      box-shadow: none !important;
    }
  }

  .register {
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  .text {
    min-height: 350px;
  }

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

  .register-now {
    background-color: white;
    padding: 1rem;
  }

  .steps-wrapper {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;

    @include md {
      flex-direction: column;

      .arrow {
        transform: rotate(90deg);
      }

      .item {
        align-self: stretch;
      }
    }

    .item {
      flex: 1;
      min-height: 100%;

      .background-text {
        background-color: #f5f5f5;
        padding: 1rem;
      }

      .background-icon {
        background-color: #8ab61d;
        padding: 20px;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        height: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.thank-you {
  font-size: 55px;
}

</style>
