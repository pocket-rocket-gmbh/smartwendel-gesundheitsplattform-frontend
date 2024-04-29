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
      v-if="hasToken && !owner_requested_maintenance"
    >
      <div>
        <div
          class="d-flex justify-center align-center text-primary thank-you font-weight-medium"
          v-if="!registerSuccessful"
        >
          <span>Einrichtung "{{ careFacilityName }}" übernehmen</span>
          <v-btn color="primary" class="ml-5" @click="showPreview">Vorschau</v-btn>
        </div>
        <div class="mt-5 d-flex flex-column general-font-size" v-if="!registerSuccessful">
          <span class="">
            Du bist ein im Landkreis Sankt Wendel ansässiger Gesundheitsanbieter und
            möchtest dein Angebot auf einer unabhängigen und kostenfreien Plattform
            veröffentlichen? Dann laden wir dich herzlich zur Registrierung ein! Als
            Anbieter kannst du dich und deine Gesundheitsleistung ganz einfach und in
            wenigen Schritten auf der Plattform darstellen und veröffentlichen.
          </span>
          <span class="mt-5">
            Hierdurch erzielst du eine größere Reichweite sowie mehr Aufmerksamkeit für
            dein Angebot und steigerst deine Bekanntheit bei der einheimischen
            Bevölkerung. Ganz gleich ob es sich um ein behördliches, gemeinnütziges,
            ehrenamtliches oder gewerbliches Angebot handelt: Auf gesundesWND sind alle
            Gesundheitsanbieter willkommen, deren Angebote zum Erhalt und zur Verbesserung
            der Gesundheit der Landkreisbevölkerung beitragen!
          </span>
          <span class="mt-5">
            Durch die Vervollständigung deiner Daten übernimmst du die importierten Daten
            deiner Einrichtung und kannst weitere Inhalte pflegen.
          </span>
        </div>
      </div>
      <v-form ref="registerForm" v-show="!registerSuccessful" class="mt-3">
        <div class="my-5">
          <div class="d-flex align-center">
            <span class="mr-3 general-font-size text-h4font-weight-medium"
              >Mein Benutzerkonto</span
            >
            <v-tooltip location="top" width="300px">
              <template v-slot:activator="{ props }">
                <v-icon class="is-clickable mr-10" v-bind="props"
                  >mdi-information-outline</v-icon
                >
              </template>
              <span
                >Sollte das von dir erstellte Benutzerkonto von mehreren Nutzern verwendet
                werden, trage bitte eine allg. E-Mail Adresse ein, auf die jeder Nutzer
                Zugriff hat</span
              >
            </v-tooltip>
          </div>
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
              v-model="email"
              type="email"
              label="E-Mail Adresse *"
              :rules="[rules.required, rules.email]"
              hide-details="auto"
              :error-messages="useErrors().checkAndMapErrors('email', errors)"
            />
          </div>
          <div class="my-5">
            <span class="mb-3 general-font-size font-weight-medium"
              >Meine Einrichtung</span
            >
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
              <v-text-field
                v-model="careFacilityStreet"
                type="text"
                label="Straße und Nummer *"
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
                :disabled="careFacilityCommunityId?.length === 0"
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
            <span class="mb-3 general-font-size text-h4 font-weight-medium"
              >Impressumsangaben</span
            >

            <div class="field">
              <v-text-field
                v-model="careFacilityAuthorizedRepresentName"
                type="text"
                label="Vertretungsberechtigte Person *"
                :rules="[rules.required]"
                hide-details="auto"
              />
            </div>

            <span class="my-3 general-font-size text-h6 font-weight-medium"
              >Weitere Angaben gemäß § 5 TMG</span
            >

            <div class="field">
              <v-text-field
                v-model="careFacilityCommercialRegisterNumber"
                type="text"
                label="Registernummer"
                hide-details="auto"
              />
            </div>

            <div class="field">
              <v-text-field
                v-model="careFacilityRegisterCourt"
                type="text"
                label="Registergericht"
                hide-details="auto"
              />
            </div>

              <div class="field d-flex align-center">
                <v-text-field
                  v-model="careFacilityManagementName"
                  type="text"
                  label="Geschäftsführung"
                  hide-details="auto"
                  class="pr-3"
                />
                <v-tooltip location="top" width="300px">
                  <template v-slot:activator="{ props }">
                    <v-icon class="is-clickable mr-10" v-bind="props"
                      >mdi-information-outline</v-icon
                    >
                  </template>
                  <span
                    >Bitte bei Mehreren Personen die Namen mit Komma trennen. Beispiel: Max
                    Mustermann, Dr. Martina Mustermann.</span
                  >
                </v-tooltip>
              </div>
            <div class="d-flex align-center">
              <span class="general-font-size text-h6 font-weight-medium pr-3"
                >Für bestimmte Berufe</span
              >
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
                </template>
                <span
                  >Die Angaben in diesen Feldern betreffen sogenannte reglementierte
                  Berufe. Der Berufszugang- bzw. die Ausübung ist rechtlich an qualitative
                  Nachweise gebunden bzw. gesetzlich geschützt. Gilt z. B. für Ärzte,
                  Physiotherapeuten, Masseure, Heilpraktiker etc.</span
                >
              </v-tooltip>
            </div>

            <div class="field d-flex align-center">
              <v-text-field
                v-model="careFacilityProfessionalTitle"
                type="text"
                label="Gesetzliche Berufsbezeichnung"
                hide-details="auto"
                class="pr-3"
              />
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
                </template>
                <span
                  >Bitte die Berufsbezeichnung mit Komma trennen. Beispiel: Facharzt für
                  Allgemeinmedizin, Fachärztin für Innere Medizin.</span
                >
              </v-tooltip>
            </div>

            <div class="field">
              <v-text-field
                v-model="careFacilityAwardedIn"
                type="text"
                label="Verliehen in "
                hide-details="auto"
              />
            </div>

            <div class="field">
              <v-text-field
                v-model="careFacilityResponsibleSupervisoryAuthority"
                type="text"
                label="Zuständige Aufsichtsbehörde"
                hide-details="auto"
              />
            </div>

            <div class="field">
              <v-text-field
                v-model="careFacilityAssociatedChamber"
                type="text"
                label="Zuständige Kammer"
                hide-details="auto"
              />
            </div>

            <div class="field d-flex align-center">
              <v-text-field
                v-model="careFacilityProfessionalRegulations"
                type="text"
                label="Berufsrechtliche Regelung"
                hide-details="auto"
                class="pr-3"
              />
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
                </template>
                <span
                  >Hier kannst du den Link eintragen, unter dem die Regelungen zu finden
                  sind und wie diese heißen. Beispiel: Berufsordnung für Ärzte, zu finden
                  unter www.bundesaerztekammer.de.</span
                >
              </v-tooltip>
            </div>

            <div class="field d-flex align-center">
              <v-text-field
                v-model="careFacilityTaxIdentificationNumber"
                type="text"
                label="Umsatzsteueridentifikationsnummer"
                hide-details="auto"
                class="pr-3"
              />
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
                </template>
                <span>Entfällt für einige Berufe.</span>
              </v-tooltip>
            </div>
          </div>
        </div>
        <v-checkbox v-model="privacyAccepted" :rules="[rules.required]" class="check">
          <template #label>
            <div class="general-font-size">
              Ich stimme der
              <a class="is-dark-grey" target="_blank" href="/privacy_policy" @click.stop>
                <u>Datenschutzerklärung</u>
              </a>
              <span> und den </span>
              <a
                class="is-dark-grey"
                target="_blank"
                href="/rules_of_conduct"
                @click.stop
              >
                <u>Nutzungsbedingungen</u>
              </a>
              zu
            </div>
          </template>
        </v-checkbox>

        <v-btn
          color="primary"
          class="mt-5 general-font-size"
          size="large"
          block
          depressed
          :disabled="submitButtonDisabledCondition"
          @click="register"
          >Übernehmen</v-btn
        >
      </v-form>
      <div align="center" class="mt-5" v-if="registerSuccessful">
        <div class="d-flex flex-column align-center justify-center">
          <span class="thank-you text-primary font-weight-medium mb-10">
            Vielen Dank für deine Registrierung!
          </span>
          <span class="general-font-size">
            Wir haben dir soeben eine E-Mail mit weiteren Anweisungen und einem temporären
            Passwort geschickt (bitte prüfe auch deinen Spam-Ordner).
          </span>
        </div>
        <div class="mt-5">
          <v-btn color="primary" @click="toLogin" block depressed>Jetzt anmelden</v-btn>
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

    <span
      v-if="registerSuccessful"
      class="thank-you is-dark-grey font-weight-medium d-flex justify-center"
      >So geht es weiter:</span
    >
    <div v-if="registerSuccessful" class="steps-wrapper">
      <template v-for="step in steps">
        <div class="item" elevation="0">
          <div class="background-icon">
            <img :src="step.icon" />
          </div>

          <div class="text background-text general-font-size text-center">
            {{ step.description }}
          </div>
        </div>
        <span v-if="step.next" class="arrow register">
          <img :src="arrow" />
        </span>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ResultStatus, ServerCallResult } from "@/types/serverCallResult";
import { rules } from "../data/validationRules";
import { VForm } from "vuetify/lib/components/index.mjs";

import LogoStep1 from "@/assets/icons/registerIcons/icon_step1.png";
import LogoStep2 from "@/assets/icons/registerIcons/icon_step2.png";
import LogoStep3 from "@/assets/icons/registerIcons/icon_step3.png";
import LogoStep4 from "@/assets/icons/registerIcons/icon_step4.png";
import LogoStep5 from "@/assets/icons/registerIcons/icon_step5.png";

import arrow from "@/assets/icons/registerIcons/arrow.png";

const firstname = ref("");
const lastname = ref("");
const email = ref("");
const careFacilityName = ref("");
const careFacilityCommunityId = ref("");
const careFacilityZip = ref("");
const careFacilityTown = ref("");
const careFacilityStreet = ref("");

//new fields
const careFacilityAuthorizedRepresentName = ref("");
const careFacilityCommercialRegisterNumber = ref("");
const careFacilityAssociatedChamber = ref("");
const careFacilityProfessionalTitle = ref("");
const careFacilityTaxIdentificationNumber = ref("");
const careFacilityProfessionalRegulations = ref("");

const careFacilityRegisterCourt = ref("");
const careFacilityAwardedIn = ref("");
const careFacilityResponsibleSupervisoryAuthority = ref("");
const careFacilityManagementName = ref("");

const loading = ref(true);
const animated = ref(false);
const errors = ref({});
const registerSuccessful = ref(false);
const privacyAccepted = ref(false);
const registerForm = ref<VForm>();
const router = useRouter();
const currentToken = ref("");
const hasToken = ref(false);
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
      "Sobald alle Pflichtangaben hinterlegt sind, kannst du dein Profil für alle Besucher:innen der Plattform sichtbar veröffentlichen.",
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

const owner_requested_maintenance = ref(false);

const getToken = () => {
  currentToken.value = String(router.currentRoute.value.query.token);
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
    console.log(data);
    if (data) {
      hasToken.value = true;
      firstname.value = data?.data?.user?.firstname;
      lastname.value = data?.data?.user?.lastname;
      email.value = data?.data?.user?.email;
      careFacilityId.value = data?.data?.care_facility?.id;
      careFacilityName.value = data?.data?.care_facility?.name;
      careFacilityZip.value = data?.data?.care_facility?.zip;
      careFacilityTown.value = data?.data?.care_facility?.town;
      careFacilityCommunityId.value = data?.data?.care_facility?.community_id;
      careFacilityStreet.value = data?.data?.care_facility?.street;
      owner_requested_maintenance.value =
        data?.data?.care_facility?.owner_requested_maintenance;
      careFacilityAuthorizedRepresentName.value =
        data?.data?.care_facility?.authorized_represent_name;
      careFacilityCommercialRegisterNumber.value =
        data?.data?.care_facility?.commercial_register_number;
      careFacilityAssociatedChamber.value = data?.data?.care_facility?.associated_chamber;
      careFacilityProfessionalTitle.value = data?.data?.care_facility?.professional_title;
      careFacilityRegisterCourt.value = data?.data?.care_facility?.register_court;
      careFacilityAwardedIn.value = data?.data?.care_facility?.awarded_in;
      careFacilityResponsibleSupervisoryAuthority.value =
        data?.data?.care_facility?.responsible_supervisory_authority;
      careFacilityManagementName.value = data?.data?.care_facility?.management_name;
    }
    loading.value = false;
  } else {
    hasToken.value = false;
    loading.value = false;
  }
};

const currentPreviewToken = ref("");

const getPreviewToken = async () => {
  const token = String(router.currentRoute.value.query.previewToken);
  if (token) {
    currentPreviewToken.value = token;
  }
};

const currentUser = ref<any>(null);

const showPreview = () => {
  router.push({
    path: "/public/care_facilities/" + careFacilityId.value,
    query: { token_id: currentPreviewToken.value },
  });
};

const submitButtonDisabledCondition = computed(() => {
  return (
    !firstname.value ||
    !lastname.value ||
    !email.value ||
    !careFacilityName.value ||
    !careFacilityCommunityId.value ||
    !careFacilityZip.value ||
    !careFacilityTown.value ||
    !careFacilityStreet.value ||
    !privacyAccepted.value ||
    !careFacilityAuthorizedRepresentName.value
  );
});

const register = async () => {
  const { valid } = await registerForm.value.validate();

  if (!valid) return;
  const data = {
    email: email.value,
    firstname: firstname.value,
    lastname: lastname.value,
    care_facility_name: careFacilityName.value,
    care_facility_zip: careFacilityZip.value,
    care_facility_town: careFacilityTown.value,
    care_facility_community_id: careFacilityCommunityId.value,
    care_facility_street: careFacilityStreet.value,
    care_facility_authorized_represent_name: careFacilityAuthorizedRepresentName.value,
    care_facility_commercial_register_number: careFacilityCommercialRegisterNumber.value,
    care_facility_associated_chamber: careFacilityAssociatedChamber.value,
    care_facility_professional_title: careFacilityProfessionalTitle.value,
    care_facility_tax_identification_number: careFacilityTaxIdentificationNumber.value,
    care_facility_professional_regulations: careFacilityProfessionalRegulations.value,
    care_facility_register_court: careFacilityRegisterCourt.value,
    care_facility_awarded_in: careFacilityAwardedIn.value,
    care_facility_responsible_supervisory_authority:
      careFacilityResponsibleSupervisoryAuthority.value,
    care_facility_management_name: careFacilityManagementName.value,
  };
  const result = await publicApi.call(
    "post",
    `/users/onboarding-health/${currentToken.value}`,
    data
  );
  if (result.status === ResultStatus.SUCCESSFUL) {
    registerSuccessful.value = true;
  } else {
    errors.value = {
      errors: [{ field_name: "email", code: "register.failed" }],
    };
    loading.value = false;

    // animate shake
    animated.value = true;
    setTimeout(() => {
      animated.value = false;
    }, 1000);
  }
};

useHead({
  title: "Einrichtung übernehmen",
  meta: [
    { property: "og:type", content: "Webseite" },
    {
      name: "title",
      content: careFacilityName.value + "Einrichtung übernehmen",
    },
  ],
});

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

const api = useCollectionApi();
api.setBaseApi(usePublicApi());

const scrollToTop = () => {
  window.scrollTo(0, 0);
};
onMounted(async () => {
  getToken();
  await validateToken();
  getPreviewToken();
  scrollToTop();
  getCommunities();
  const rememberedEmail = localStorage.getItem("health_platform._remembered_email");
  if (rememberedEmail) {
    setTimeout(() => {
      email.value = rememberedEmail;
    }, 300);
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

  .check .v-label {
    padding-left: 1rem;
    width: 100%;
  }
}

.thank-you {
  font-size: 55px;
}
</style>
