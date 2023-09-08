<template>
  <v-row class="my-15">
    <v-col sm="3" md="8" xl="8" offset-xl="2" offset-md="2" offset-sm="2">
      <v-card elevation="10" :class="['card', { shake: animated }]">
        <div>
          <div
            class="d-flex justify-center align-center text-primary text-h2 font-weight-bold"
            v-if="!registerSuccessful"
          >
            <span>Jetzt registrieren!</span>
          </div>
          <div class="mt-5 d-flex flex-column" v-if="!registerSuccessful">
            <span class="">
              Du bist im Landkreis ansässige(r) Gesundheitsanbieter:in und möchtest dein
              Angebot auf einer unabhängigen und kostenfreien Plattform veröffentlichen?
              Dann laden wir dich herzlich ein, dich zu registrieren!</span
            >
            <span class="mt-5">
              Als Anbieter kannst du dich und deine Gesundheitsleistung ganz einfach und
              in wenigen Schritten auf der Plattform darstellen und veröffentlichen.
              Hierdurch erzielst du eine größere Reichweite sowie mehr Aufmerksamkeit für
              dein Angebot und steigerst deine Bekanntheit bei der einheimischen
              Bevölkerung.
            </span>
            <span class="mt-5">
              Ganz gleich ob es sich um ein behördliches, gemeinnütziges, ehrenamtliches oder
              gewerbliches Angebot handelt: Auf der Gesundheits- und Pflegeplattform sind
              alle Gesundheitsanbieter willkommen, deren Angebote zum Erhalt und zur
              Verbesserung der Gesundheit der Landkreisbevölkerung beitragen!
            </span>
          </div>
        </div>
        <v-form ref="registerForm" v-show="!registerSuccessful" class="mt-3">
          <div class="my-5">
            <h2 class="mb-3">Meine Einrichtung</h2>
            <div class="field">
              <v-text-field
                v-model="careFacilityName"
                type="text"
                label="Name der Einrichtung/Unternehmen/Verband/Verein/Behörde *"
                :error-messages="useErrors().checkAndMapErrors('firstname', errors)"
                :rules="[rules.required]"
                hide-details="auto"
              />
            </div>
            <div class="field">
              <v-select
                hide-details="auto"
                v-model="careFacilityCommunityId"
                :items="communities"
                item-title="name"
                item-value="id"
                label="Gemeinde *"
                :rules="[rules.required]"
              />
            </div>
            <div class="field split">
              <v-text-field
                v-model="careFacilityZip"
                hide-details="auto"
                label="PLZ *"
                :type="'number'"
                :rules="[rules.required, rules.zip]"
                :error-messages="useErrors().checkAndMapErrors('zip', errors)"
                disabled
              />
              <v-select
                :disabled="careFacilityCommunityId.length === 0"
                hide-details="auto"
                v-model="careFacilityTown"
                :items="getTownsByCommunityId(careFacilityCommunityId)"
                item-title="name"
                item-value="name"
                label="Ort *"
                :rules="[rules.required]"
              />
            </div>
          </div>
          <div class="my-5">
            <h2 class="mb-3">Mein Benutzerkonto</h2>
            <div class="field">
              <v-text-field
                v-model="firstname"
                type="text"
                label="Vorname *"
                :error-messages="useErrors().checkAndMapErrors('firstname', errors)"
                :rules="[rules.required]"
                hide-details="auto"
              />
            </div>
            <div class="field">
              <v-text-field
                v-model="lastname"
                type="text"
                label="Nachname *"
                :error-messages="useErrors().checkAndMapErrors('lastname', errors)"
                :rules="[rules.required]"
                hide-details="auto"
              />
            </div>
            <div class="field">
              <v-text-field
                v-model="phone"
                type="tel"
                label="Telefonnummer *"
                hide-details="auto"
                :rules="[rules.required, rules.validateNumber]"
                :error-messages="useErrors().checkAndMapErrors('phone', errors)"
              />
            </div>
            <div class="field">
              <v-text-field
                v-model="email"
                type="email"
                label="E-Mail Adresse *"
                :rules="[rules.required, rules.email]"
                hide-details="auto"
                :error-messages="useErrors().checkAndMapErrors('email', errors)"
              />
            </div>
          </div>
          <v-checkbox v-model="privacyAccepted" :rules="[rules.required]">
            <template v-slot:label>
              <div>
                Ich stimme der
                <v-tooltip bottom>
                  <template v-slot:activator="{ props }">
                    <a target="_blank" href="/privacy_policy" @click.stop v-bind="props">
                      <u>Datenschutzerklärung</u>
                    </a>
                  </template>
                  Datenschutzerklärung öffnen
                </v-tooltip>
                <span> und den </span>
                <v-tooltip bottom>
                  <template v-slot:activator="{ props }">
                    <a
                      target="_blank"
                      href="/rules_of_conduct"
                      @click.stop
                      v-bind="props"
                    >
                      <u>Nutzungsbedingungen</u>
                    </a>
                  </template>
                  Nutzungsbedingungen öffnen
                </v-tooltip>
                zu
              </div>
            </template>
          </v-checkbox>
          <v-btn color="primary" class="mt-5" block depressed @click="register"
            >Registrieren</v-btn
          >
        </v-form>
        <div align="center" class="mt-5" v-if="registerSuccessful">
          <div class="d-flex flex-column align-center justify-center">
            <span class="text-h2 text-primary font-weight-bold mb-10">
              Vielen Dank für deine Registrierung!
            </span>
            <span class="text-h6">
              Wir haben dir soeben eine E-Mail mit weiteren Anweisungen und einem
              temporären Passwort geschickt (bitte prüfe auch deinen Spam-Ordner).
            </span>
          </div>
          <div class="mt-5">
            <v-btn color="primary" @click="toLogin" block depressed>Jetzt anmelden</v-btn>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
  <div
    class="d-flex flex-column align-center justify-center mt-10"
    v-if="registerSuccessful"
  >
    <span class="text-h3 is-dark-grey font-weight-bold text-uppercase mb-5"
      >So geht es weiter:</span
    >
    <v-row>
      <v-col v-for="step in steps" gap="3" class="d-flex flex-grow-1 align-center justify-center">
        <v-card
          class="d-flex flex-grow-1 flex-column align-center justify-center"
          max-width="200"
          elevation="0"
        >
          <v-card-item>
            <div class="d-flex flex-column flex-grow-1">
              <div
                class="d-flex align-center justify-center flex-grow-1 bg-primary background-icon"
              >
                <img :src="step.icon" />
              </div>
              <div
                class="d-flex align-center justify-center text-center text background-text"
              >
                {{ step.description }}
              </div>
            </div>
          </v-card-item>
        </v-card>
        <span v-if="step.next" class="register">
          <img :src="arrow" />
        </span>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { ResultStatus, ServerCallResult } from "@/types/serverCallResult";
import { rules } from "../data/validationRules";
import axios from "axios";
import { VForm } from "vuetify/lib/components/index.mjs";

import LogoStep1 from "@/assets/icons/registerIcons/icon_step1.png";
import LogoStep2 from "@/assets/icons/registerIcons/icon_step2.png";
import LogoStep3 from "@/assets/icons/registerIcons/icon_step3.png";
import LogoStep4 from "@/assets/icons/registerIcons/icon_step4.png";
import LogoStep5 from "@/assets/icons/registerIcons/icon_step5.png";

import arrow from "@/assets/icons/registerIcons/arrow.png";

const careFacilityName = ref("");
const email = ref("");
const careFacilityZip = ref("");
const careFacilityTown = ref("");
const careFacilityCommunityId = ref("");
const firstname = ref("");
const lastname = ref("");
const phone = ref("");
const loading = ref(false);
const animated = ref(false);
const errors = ref({});
const registerSuccessful = ref(false);
const privacyAccepted = ref(false);
const registerForm = ref<VForm>();
const router = useRouter();
const icons = ref([LogoStep1, LogoStep2, LogoStep3, LogoStep4, LogoStep5]);

const steps = {
  step1: {
    description:
      "Melde dich mit dem zugesandten Zugangscode an (E-Mail-Postfach) und ändere zunächst dein Passwort.",
    icon: LogoStep1,
    next: true,
  },
  step2: {
    description:
      "Wir verifizieren deine Anmeldung zu den üblichen Geschäftszeiten von Montag bis Freitag.",
    icon: LogoStep2,
    next: true,
  },
  step3: {
    description:
      "In der Zwischenzeit kannst du dein Profil ergänzen und dein(e) Angebot(e) einstellen (“Meine Einrichtung”).",
    icon: LogoStep3,
    next: true,
  },
  step4: {
    description:
      "Sobald alle Pflicht-angaben hinterlegt sind, kannst du dein Profil für alle Besucher:innen der Plattform sichtbar veröffentlichen.",
    icon: LogoStep4,
    next: true,
  },
  step5: {
    description:
      "Vervollständige deinen Account und lege deine Kursangebote an, teile Veranstaltungen oder verfasse Newsbeiträge.",
    icon: LogoStep5,
    next: false,
  },
};

const toLogin = () => {
  router.push({ path: "/login" });
};

const register = async () => {
  const { valid } = await registerForm.value.validate();

  if (!valid) return;

  loading.value = true;
  errors.value = {};
  const data = {
    email: email.value,
    firstname: firstname.value,
    lastname: lastname.value,
    phone: phone.value,
    commercial_register_number: " ",
    care_facility_name: careFacilityName.value,
    care_facility_zip: careFacilityZip.value,
    care_facility_town: careFacilityTown.value,
    care_facility_community_id: careFacilityCommunityId.value,
  };

  const { data: result } = await axios.post<ServerCallResult>(
    "/api/register_with_facility",
    { data }
  );

  if (result.status === ResultStatus.SUCCESSFUL) {
    localStorage.setItem("health_platform._remembered_email", email.value);
    registerSuccessful.value = true;
    scrollToTop();
  } else {
    errors.value = { errors: [{ field_name: "email", code: "register.failed" }] };
    loading.value = false;

    // animate shake
    animated.value = true;
    setTimeout(() => {
      animated.value = false;
    }, 1000);
  }
};

const communitiesApi = useCollectionApi();
communitiesApi.setBaseApi(usePublicApi());
communitiesApi.setEndpoint(`communities`);
const communities = communitiesApi.items;

const getCommunities = async () => {
  await communitiesApi.retrieveCollection();
};

const getTownsByCommunityId = (communityId: string) => {
  const found = communities.value.find((community: any) => community.id === communityId);
  if (found) {
    careFacilityZip.value = found.zip;
    return found.towns;
  } else {
    [];
  }
};

const scrollToTop = () => {
  window.scrollTo(0, 0);
};

onMounted(() => {
  scrollToTop();
  getCommunities();
  const rememberedEmail = localStorage.getItem("health_platform._remembered_email");
  if (rememberedEmail) {
    setTimeout(() => {
      email.value = rememberedEmail;
    }, 300);
  }

  // registerForm.value?.validate()
});
</script>

<style lang="css" scoped>
.card {
  padding: 1rem;
}

.register {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

.text {
  min-height: 150px;
}

.background-text {
  background-color: #f5f5f5;
}

.background-icon {
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
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
</style>
