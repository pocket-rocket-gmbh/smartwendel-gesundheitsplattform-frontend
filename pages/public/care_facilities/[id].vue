<template>
  <v-alert
    v-if="previewToken && careFacility && careFacility?.user?.onboarding_token"
    prominent
    class="ma-15 has-bg-darken-grey facility-alert"
  >
    <v-row align="center">
      <v-col
        md="8"
        class="grow d-flex general-font-size text-center text-white justify-end"
      >
        <div class="alert-text">
          Hier dargestellt siehst du die von uns angelegte Profilseite deiner Einrichtung
          bzw. deinem Dienstleistungsangebot. Um Änderungen vorzunehmen, musst du die
          Inhaberschaft deines Einrichtungsprofils beantragen. Dadurch bist du inhaltlich
          für die Seite verantwortlich und kannst auch Kurse, Veranstaltungen und Beiträge
          erstellen.
        </div>
      </v-col>
      <v-col
        class="d-flex align-end justify-end"
        v-if="careFacility?.user?.onboarding_token"
      >
        <div class="d-flex flex-column align-center justify-center">
          <span class="get-facility-owner" @click="goToOnboarding"
            >INHABERSCHAFT <br />
            BEANTRAGEN</span
          >
          <div
            class="d-flex text-center mt-3 text-decoration-underline text-white is-clickable"
            @click="notWanted()"
          >
            Die Inhaberschaft meiner Profilseite soll <br />
            auf den Landkreis übertragen werden.
          </div>
        </div>
      </v-col>
    </v-row>
  </v-alert>
  <v-alert
    v-else-if="careFacility && careFacility?.is_active === false"
    class="ma-15 facility-alert general-font-size"
    type="info"
  >
    Hier kannst du sehen, wie die Profilseite deiner Einrichtung für die Besucher:innen
    der Gesundheits- und Pflegeplattform aussieht. Bitte beachte: Es handelt sich hierbei
    nur um eine Vorschau. Wenn du möchtest, dass dein Angebot auf der Plattform erscheint,
    musst du dein Profil online schalten.
  </v-alert>
  <div class="facility-wrapper limited offset content-wrapper" v-if="!loading">
    <div
      v-if="
        (showErrorMessages && !careFacility?.is_active && !previewToken) || !careFacility
      "
    >
      <v-row>
        <v-col class="d-flex align-center justify-center">
          <v-card
            class="pa-10 d-flex flex-column align-center"
            max-width="344"
            elevation="3"
          >
            <div
              v-if="!currentUser && previewToken"
              class="general-font-size text-center"
            >
              Du hast keine Berechtigung, diese Seite zu sehen.
            </div>
            <div v-else class="general-font-size">ungültig token ID</div>
            <v-btn
              class="general-font-size mt-3"
              size="large"
              color="primary"
              @click="goToHome()"
            >
              Zur Startseite
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div v-else-if="checkCurrentUserAndToken">
      <v-btn
        prepend-icon="mdi-chevron-left"
        class="general-font-size"
        size="large"
        @click="goBack()"
      >
        Zurück zur Suche
      </v-btn>
      <div v-if="careFacility?.kind === 'news'" class="mt-8">
        <img :src="careFacility?.image_url" class="news-image" />
        <div class="mb-3">
          <v-row>
            <v-col
              cols="12"
              md="4"
              sm="12"
              class="bar-content d-flex justify-space-between pa-0 mb-3"
            >
              <div class="d-flex align-center">
                <img class="icon mb-1" :src="eventIcon" />
                <span class="general-font-size is-dark-grey pl-3">{{
                  useDatetime().parseDatetime(careFacility.created_at)
                }}</span>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="12"
              class="bar-content d-flex justify-space-between pa-0 mb-3"
            >
              <div
                class="d-flex align-center facility-name is-clickable"
                v-if="careFacility?.user_care_facility?.name"
              >
                <a
                  :href="`/public/care_facilities/${careFacility?.user_care_facility?.id}`"
                  class="is-clickable d-flex general-font-size is-dark-grey"
                >
                  <img class="icon mb-1" :src="facilityIcon" />
                  <span
                    class="break-title facility-name pl-3"
                    v-html="careFacility?.user_care_facility?.name"
                  ></span>
                </a>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="12"
              class="bar-content d-flex justify-space-between pa-0 mb-3"
            >
              <div class="bar-item" v-if="careFacility?.name_responsible_person">
                <div class="d-flex align-center">
                  <img class="icon mb-1" :src="personIcon" />
                  <span class="general-font-size is-dark-grey pl-3 break-title">{{
                    careFacility?.name_responsible_person
                  }}</span>
                </div>
              </div>
            </v-col>
            <v-divider class="my-1 mb-3"></v-divider>
          </v-row>
        </div>
        <p
          class="general-font-size text-description"
          v-html="careFacility.description"
        ></p>
        <div>
          <div
            class="is-primary general-font-size is-uppercase font-weight-medium my-6 is-clickable"
          >
            <v-btn
              variant="outlined"
              class="general-font-size"
              size="large"
              rounded="pill"
              color="primary"
              v-auto-animate
              @click="showImprint = !showImprint"
            >
              Impressum <v-icon v-if="showImprint">mdi-chevron-up</v-icon>
              <v-icon v-else>mdi-chevron-down</v-icon>
            </v-btn>
          </div>
          <div v-auto-animate v-if="showImprint" class="general-font-size">
            <div v-for="(facility, index) in facilityDetails" :key="index">
              <div v-if="facility.authorized_represent_name">
                <span class="is-primary font-weight-bold"
                  >Vor- und Nachname der vertretungsberechtigen und verantwortlichen
                  Person</span
                >
                <div>{{ facility.authorized_represent_name }}</div>
              </div>
              <v-divider
                v-if="facility.commercial_register_number"
                class="my-2"
              ></v-divider>
              <div v-if="facility.commercial_register_number">
                <span class="is-primary font-weight-bold"
                  >Registernummer (z.B. Handelsregister)</span
                >
                <div>{{ facility.commercial_register_number }}</div>
              </div>
              <v-divider v-if="facility.associated_chamber" class="my-2"></v-divider>
              <div v-if="facility.associated_chamber">
                <span class="is-primary font-weight-bold">Zugehörige Kammer</span>
                <div>{{ facility.associated_chamber }}</div>
              </div>
              <v-divider v-if="facility.doctor_associations" class="my-2"></v-divider>
              <div v-if="facility.doctor_associations">
                <span class="is-primary font-weight-bold"
                  >Kassenärztliche Vereinigung</span
                >
                <div>{{ facility.doctor_associations }}</div>
              </div>
              <v-divider v-if="facility.professional_title" class="my-2"></v-divider>
              <div v-if="facility.professional_title">
                <span class="is-primary font-weight-bold"
                  >Gesetzliche Berufsbezeichnung</span
                >
                <div>{{ facility.professional_title }}</div>
              </div>
              <v-divider
                v-if="facility.tax_identification_number"
                class="my-2"
              ></v-divider>
              <div v-if="facility.tax_identification_number">
                <span class="is-primary font-weight-bold"
                  >Umsatzsteueridentifikationsnummer</span
                >
                <div>{{ facility.tax_identification_number }}</div>
              </div>
              <v-divider
                v-if="facility.professional_regulations"
                class="my-2"
              ></v-divider>

              <div v-if="facility.professional_regulations">
                <span class="is-primary font-weight-bold"
                  >Bezeichnung der berufsrechtlichen Regelungen und wie diese zugänglich
                  sind</span
                >
                <div>{{ facility.professional_regulations }}</div>
              </div>
              <v-divider
                v-if="facility.professional_designation"
                class="my-2"
              ></v-divider>
              <div v-if="facility.professional_designation">
                <span class="is-primary font-weight-bold">
                  Berufsrechtliche Regelungen (z.B. Berufsordnung für Ärzte als
                  Link)</span
                >
                <div>{{ facility.professional_designation }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PublicCareFacilitiesImages
        :care-facility="careFacility"
        v-if="careFacility?.kind !== 'news'"
      />
      <div
        class="d-md-none d-sm-block"
        :class="[careFacility?.logo_url ? ' mt-10 pt-15' : 'mt-5']"
      >
        <span class="general-font-size font-weight-medium is-dark-grey">{{
          careFacility?.name
        }}</span>
        <v-divider class="my-5"></v-divider>
      </div>

      <v-row class="row">
        <v-col sm="12" md="8" class="order-last order-md-first">
          <PublicCareFacilitiesMain
            v-if="careFacility?.kind !== 'news'"
            :care-facility="careFacility"
          />
          <div class="hidden-md-and-up">
            <div class="mt-5" v-if="(careFacility?.kind === 'course', 'event')">
              <PublicCareFacilitiesDates :care-facility="careFacility" />
            </div>
            <div class="mt-5">
              <PublicCareFacilitiesDocuments :care-facility="careFacility" />
            </div>
          </div>
        </v-col>
        <v-col md="4" sm="12" v-if="careFacility?.kind !== 'news'">
          <PublicCareFacilitiesRight :care-facility="careFacility" />
          <div class="hidden-sm-and-down">
            <div class="mt-5" v-if="(careFacility?.kind === 'course', 'event')">
              <PublicCareFacilitiesDates :care-facility="careFacility" />
            </div>
            <div class="mt-5">
              <PublicCareFacilitiesDocuments :care-facility="careFacility" />
            </div>
          </div>
        </v-col>
      </v-row>
      <PublicCareFacilitiesEvents
        v-if="careFacility?.kind !== 'event'"
        :care-facility="careFacility"
      />
      <PublicCareFacilitiesCourses
        v-if="careFacility?.kind !== 'course'"
        :care-facility="careFacility"
      />
      <PublicCareFacilitiesNews
        v-if="careFacility?.kind !== 'news'"
        :care-facility="careFacility"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Facility } from "~/store/searchFilter";
import { useBreakpoints } from "~/composables/ui/breakPoints";
import facilityIcon from "~/assets/icons/facilityTypes/facilities_green.svg";
import eventIcon from "~/assets/icons/facilityTypes/events_green.svg";
import personIcon from "~/assets/icons/icon_person.svg";
import { useUserStore } from "@/store/user";

const breakPoints = useBreakpoints();

const currentUser = useUserStore().currentUser;

const checkCurrentUserAndToken = () => {
  if (!currentUser || careFacility.value?.user?.onboarding_token) {
    return true;
  }
};

const showImprint = ref(false);

const facilityDetails = computed(() => {
  if (!careFacility?.value?.user?.care_facilities) return [];
  return careFacility?.value?.user?.care_facilities
    .filter((item: any) => item.kind === "facility")
    .map((item: any) => ({
      authorized_represent_name: item.authorized_represent_name,
      commercial_register_number: item.commercial_register_number,
      associated_chamber: item.associated_chamber,
      doctor_associations: item.doctor_associations,
      professional_title: item.professional_title,
      tax_identification_number: item.tax_identification_number,
      professional_regulations: item.professional_regulations,
      professional_designation: item.professional_designation,
    }));
});

const snackbar = useSnackbar();

const notWanted = async () => {
  router.push({
    path: "/confirm_not_wanted",
    query: {
      token_id: careFacility.value?.user?.onboarding_token,
      previewToken: previewToken.value,
    },
  });
};
const route = useRoute();
const router = useRouter();
const careFacility = ref<Facility>();
const loading = ref(true);

const showErrorMessages = ref(false);

const previewToken = ref<string | null>(null);

const careFacilityId = computed(() => {
  return route.params.id;
});

const getPreviewToken = async () => {
  const token = route.query.token_id as string;
  if (token) {
    previewToken.value = token;
  }
  return;
};

const goBack = () => {
  const backLink = router.options.history.state.back as string;
  if (backLink) {
    router.push({ path: backLink });
  } else {
    router.push({ path: "/public/search/facilities" });
  }
};

const goToHome = () => {
  router.push({ path: "/" });
};

const showApi = useCollectionApi();
showApi.setBaseApi(usePublicApi());

const getCareFacility = async () => {
  if (previewToken.value) {
    showApi.setEndpoint(`care_facilities/preview/${previewToken.value}`);
  } else {
    showApi.setEndpoint(`care_facilities/${careFacilityId.value}`);
  }
  await showApi.getItem();
  careFacility.value = showApi.item.value;
};

const goToOnboarding = () => {
  router.push({
    path: `/onboarding`,
    query: {
      token: careFacility.value?.user?.onboarding_token,
      previewToken: previewToken.value,
    },
  });
};

onMounted(async () => {
  loading.value = true;
  await getPreviewToken();
  await getCareFacility();
  loading.value = false;
});
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main";

.facility-wrapper {
  margin-top: 4rem;

  .row {
    .column {
      @include md {
        display: flex;
        flex-direction: column;
      }
    }
  }
}

.news-image {
  margin: 0 1.25em 0 0;
  width: 50%;
  object-fit: cover;
  border-radius: 20px;
  float: left;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15);
  @include md {
    width: 100%;
    margin-bottom: 2rem;
  }
}

.text-description {
  text-align: justify;
}

.content-wrapper {
  margin: 5rem;
  @include md {
    margin: 1rem;
  }
}

.bar-content {
  gap: 1rem;
  @include md {
    gap: 1rem;
    display: flex;
    flex-direction: column;
  }
}

.icon {
  width: 1.7rem;
}

.get-facility-owner {
  cursor: pointer;
  font-weight: 500;
  color: white;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 1rem;
  background-color: $primary-color;
  padding: 10px 30px;
  border-radius: 20px;
  font-size: 1.8rem;
}

.facility-alert {
  border-radius: 20px;
}
</style>
