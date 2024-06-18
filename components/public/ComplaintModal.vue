<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-top-transition"
    width="1000"
    v-auto-animate
    :class="loading ? 'blurred-background' : ''"
    persistent
  >
    <v-card :class="[{ shake: animated }]" height="auto" style="overflow: hidden">
      <v-card-title class="d-flex align-center justify-space-between pa-0 ma-0 my-2 mx-3">
        <div class="text-h5 d-flex justify-center">
          <v-icon size="small" v-if="reportKind && !successFullySent" @click="goBack()"
            >mdi-chevron-left</v-icon
          >
          <div>
            <span v-if="reportKind">
              {{ reportKind?.text }} <span v-if="successFullySent">gemeldet</span
              ><span v-else>melden</span></span
            >
            <span v-else>Inhalt melden</span>
          </div>
        </div>
        <div class="text-h5 d-flex">
          <v-icon @click="emitClose()" size="small">mdi-close</v-icon>
        </div>
      </v-card-title>
      <v-card-text v-auto-animate>
        <div v-if="!reportKind && !successFullySent">
          <v-row
            v-for="(option, index) in listOptions"
            :key="index"
            class="general-font-size options-select mb-2 is-clickable"
            @click="optionSelect(option)"
          >
            <v-col class="d-flex justify-start align-center">
              <span>{{ option.text }}</span>
            </v-col>
            <v-col md="1" class="d-flex justify-end align-center">
              <v-icon>mdi-chevron-right</v-icon>
            </v-col>
          </v-row>
        </div>
        <v-form ref="complaintForm" v-if="reportKind && !successFullySent" class="mt-3">
          <div
            class="mt-2 d-flex flex-column is-dark-grey general-font-size ml-2"
            v-if="!showForm"
          >
            {{ reportKind?.description }}
          </div>
          <div class="d-flex align-center justify-center my-2">
            <v-btn color="primary" variant="outlined" dark @click="toogleForm">
              <span
                ><span class="d-flex align-center" v-if="showForm"
                  >Zurück<v-icon>mdi-chevron-double-up</v-icon></span
                >
                <span class="d-flex align-center" v-else
                  >Weiter<v-icon>mdi-chevron-double-down</v-icon></span
                ></span
              >
            </v-btn>
          </div>
          <div class="mt-3" v-if="showForm" v-auto-animate>
            <div class="field">
              <v-text-field
                label="Titel"
                v-model="reportKind.text"
                :error-messages="useErrors().checkAndMapErrors('title', errors)"
                hide-details="auto"
                disabled
              />
            </div>
            <div class="field">
              <v-text-field
                label="Titel"
                :model-value="title"
                :error-messages="useErrors().checkAndMapErrors('title', errors)"
                hide-details="auto"
                disabled
              />
            </div>
            <div class="field" v-if="needAdditionalInformation">
              <v-text-field
                v-model="reporterName"
                label="Name (erforderlich)"
                hide-details="auto"
                :rules="[rules.required]"
                :error-messages="useErrors().checkAndMapErrors('name', errors)"
              />
            </div>
            <div class="field" v-else>
              <v-text-field
                v-model="reporterName"
                label="Name (optional)"
                hide-details="auto"
                :error-messages="useErrors().checkAndMapErrors('name', errors)"
              />
            </div>
            <div class="field" v-if="needAdditionalInformation">
              <v-text-field
                v-model="reporterEmail"
                label="E-Mail (erforderlich)"
                hide-details="auto"
                id="mail"
                :rules="[rules.required, rules.email]"
                :error-messages="useErrors().checkAndMapErrors('email', errors)"
              />
            </div>
            <div class="field" v-else>
              <v-text-field
                v-model="reporterEmail"
                label="E-Mail (optional)"
                hide-details="auto"
                id="mail"
                :rules="reporterEmail.length ? [rules.email] : []"
                :error-messages="useErrors().checkAndMapErrors('email', errors)"
              />
            </div>
            <div class="field" v-if="needAdditionalInformation">
              <v-textarea
                v-model="reportDescription"
                counter
                maxlength="300"
                hide-details="auto"
                label="Beschreibung (erforderlich)"
                :error-messages="useErrors().checkAndMapErrors('description', errors)"
                :rules="[rules.required]"
              />
            </div>

            <div class="field" v-else>
              <v-textarea
                v-model="reportDescription"
                counter
                maxlength="300"
                hide-details="auto"
                label="Beschreibung (optional)"
                :error-messages="useErrors().checkAndMapErrors('description', errors)"
              />
            </div>

            <v-checkbox
              v-if="!checkboxRules"
              label="Meine Angaben sind vollständig"
              class=""
              v-model="informationsAreCompleted"
              :disabled="checkboxRules"
              :rules="needAdditionalInformation ? [rules.required] : []"
            />
            <v-checkbox
              v-if="!checkboxRules"
              v-model="privacyAccepted"
              :disabled="checkboxRules"
              :rules="needAdditionalInformation ? [rules.required] : []"
            >
              <template #label>
                <div class="">
                  Ich stimme der
                  <a
                    class="is-dark-grey"
                    target="_blank"
                    href="/privacy_policy"
                    @click.stop
                  >
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
                  zu.
                </div>
              </template>
            </v-checkbox>
          </div>
        </v-form>

        <div v-else-if="successFullySent">
          <v-alert type="success" elevation="2" icon="mdi-check">
            Beschwerde erfolgreich gesendet
          </v-alert>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-row>
          <v-col class="d-flex justify-start">
            <v-btn variant="outlined" dark @click="emitClose()"> Schließen </v-btn>
          </v-col>
          <v-col class="d-flex justify-end">
            <v-btn
              v-if="reportKind && !successFullySent && showForm"
              color="blue darken-1"
              variant="outlined"
              dark
              :disabled="submitRules"
              @click="sendComplaint()"
            >
              senden
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
    <Loading v-if="loading" />
  </v-dialog>
</template>
<script lang="ts" setup>
import { ResultStatus, ServerCallResult } from "@/types/serverCallResult";
import { rules } from "~/data/validationRules";
import { VForm } from "vuetify/lib/components/index.mjs";

const emit = defineEmits(["close"]);

const props = defineProps<{
  title: {
    type: String;
    required: true;
  };
  kind: {
    type: String;
    required: true;
  };
  facilityId: {
    type: String;
    required: true;
  };
}>();

const dialog = ref(true);
const successFullySent = ref(false);
const loading = ref(false);
const informationsAreCompleted = ref(false);
const errors = ref({});
const complaintForm = ref<VForm>();
const animated = ref(false);
const reportKind = ref(null);
const reportedUrl = ref("");
const reporterName = ref("");
const reporterEmail = ref("");
const reportDescription = ref("");
const privacyAccepted = ref(false);
const showForm = ref(false);

const createUpdateApi = useCollectionApi();
createUpdateApi.setBaseApi(usePublicApi());

const sendComplaint = async () => {
  createUpdateApi.setEndpoint("complaints");
  try {
    loading.value = true;
    const data = {
      page_title: props.title,
      reporter_name: reporterName.value,
      reporter_email: reporterEmail.value,
      reason: reportDescription.value,
      url: reportedUrl.value,
      kind: reportKind.value.value,
      last_action: "unchanged",
      action: "unchanged",
      meta_data: {
        id: props.facilityId,
        kind: props.kind,
      },
    };
    const result = await createUpdateApi.createItem(
      data,
      "Beschwerde erfolgreich gesendet"
    );
    if (result.status === ResultStatus.SUCCESSFUL) {
      successFullySent.value = true;
      loading.value = false;
    }
  } catch (error) {
    loading.value = false;
    animated.value = false;
    console.log(error);
    setTimeout(() => {
      animated.value = false;
    }, 1000);
  }
};

const submitRules = computed(() => {
  if (needAdditionalInformation.value) {
    if (
      !reportKind.value ||
      !reportedUrl.value ||
      !reporterName.value ||
      !reporterEmail.value ||
      !reportDescription.value ||
      !informationsAreCompleted.value ||
      !privacyAccepted.value ||
      !complaintForm?.value?.isValid
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    const hasReportDetails =
      reportDescription.value.length > 0 ||
      reporterEmail.value.length > 0 ||
      reporterName.value.length > 0;

    const isInformationIncomplete = !(
      informationsAreCompleted.value && privacyAccepted.value
    );

    if (hasReportDetails && isInformationIncomplete) {
      return true;
    }
  }

  return false;
});

const needAdditionalInformation = computed(() => {
  if (reportKind.value.value === 0) {
    return false;
  } else {
    return true;
  }
});

const toogleForm = () => {
  showForm.value = !showForm.value;
  cleanForm();
};

const listOptions = ref([
  {
    text: "Verstoß gegen geltendes Recht",
    description:
      "Ein Verstoß gegen geltendes Recht liegt vor, wenn eine Handlung oder ein Unterlassen gegen bestehende gesetzliche Bestimmungen verstößt. Dies kann in verschiedenen Rechtsbereichen geschehen: Im Strafrecht handelt es sich um Delikte wie Diebstahl, Betrug oder Körperverletzung. Im Zivilrecht betrifft es Vertragsverletzungen oder unerlaubte Handlungen. Im Verwaltungsrecht sind es Verstöße gegen Bauvorschriften oder Umweltauflagen. Im Arbeitsrecht umfassen sie Verstöße gegen das Arbeitszeitgesetz oder das Mindestlohngesetz. Konsequenzen können Geldbußen, Schadensersatz, Freiheitsstrafen oder administrative Maßnahmen sein. Ein Beispiel ist ein Unternehmen, das gegen Umweltauflagen verstößt, indem es gefährliche Abfälle unsachgemäß entsorgt.",
    value: 0,
  },
  {
    text: "Belästigung",
    description:
      "Belästigung bezeichnet ein Verhalten, das eine Person in unangemessener Weise bedrängt, stört oder erniedrigt. Dies kann verbal, physisch oder psychisch geschehen und zielt darauf ab, das Opfer zu verunsichern oder zu verletzen. Im beruflichen Umfeld umfasst Belästigung oft sexuelle Anspielungen, unerwünschte Berührungen oder anstößige Kommentare. Auch im öffentlichen Raum kann Belästigung auftreten, beispielsweise durch aufdringliche Ansprachen oder Drohungen. Die Konsequenzen von Belästigung reichen von Abmahnungen und Geldstrafen bis hin zu gerichtlichen Verfahren. Ein Beispiel ist ein Mitarbeiter, der eine Kollegin wiederholt mit unangemessenen Bemerkungen bedrängt.",
    value: 1,
  },
  {
    text: "Spam",
    description:
      "Spam bezeichnet unerwünschte und massenhaft versendete Nachrichten, die oft Werbung oder betrügerische Inhalte enthalten. Diese Nachrichten werden ohne Zustimmung des Empfängers verschickt und können per E-Mail, SMS oder über soziale Netzwerke verbreitet werden. Spam kann nicht nur lästig sein, sondern auch Sicherheitsrisiken bergen, da er oft Links zu schädlichen Websites oder Anhänge mit Malware enthält. Die Konsequenzen von Spam können von der Blockierung des Absenders bis hin zu rechtlichen Maßnahmen wie Geldstrafen reichen. Ein Beispiel ist das massenhafte Versenden von Werbe-E-Mails für fragwürdige Produkte an eine große Anzahl von Empfängern ohne deren Einwilligung.",
    value: 2,
  },
  {
    text: "Verstoß gegen die Nutzungsbedingungen",
    description:
      "Ein Verstoß gegen die Nutzungsbedingungen liegt vor, wenn eine Person die festgelegten Regeln und Richtlinien eines Dienstes oder einer Plattform missachtet. Dies kann verschiedene Formen annehmen, wie z.B. das Veröffentlichen unangemessener Inhalte, das Betreiben illegaler Aktivitäten oder das Missbrauchen von Diensten für Spam oder Betrug. Die Nutzungsbedingungen dienen dazu, ein sicheres und respektvolles Umfeld zu gewährleisten. Konsequenzen eines solchen Verstoßes können die Sperrung des Nutzerkontos, der Entzug von Zugangsrechten oder rechtliche Schritte sein. Ein Beispiel ist ein Nutzer, der auf einer Social-Media-Plattform wiederholt Hassreden postet, obwohl dies ausdrücklich verboten ist.",
    value: 3,
  },
  {
    text: "Andere",
    description:
      "Der Begriff 'Andere' bezeichnet Handlungen oder Verhaltensweisen, die nicht in die spezifischen Kategorien der geltenden Regelungen oder typischen Verstöße passen. Diese Kategorie dient als Sammelbegriff für diverse und nicht näher definierte Verstöße, die dennoch gegen bestimmte Richtlinien oder Normen verstoßen. Die Konsequenzen solcher Verstöße können je nach Schwere und Kontext variieren und reichen von milden Verwarnungen bis hin zu strengeren Sanktionen. Ein Beispiel ist das Missachten einer internen Richtlinie eines Unternehmens, die nicht ausdrücklich in den Hauptkategorien der Verhaltensregeln aufgeführt ist.",
    value: 4,
  },
]);

const optionSelect = (option: any) => {
  reportKind.value = option;
};

const goBack = () => {
  reportKind.value = null;
  reportDescription.value = "";
  reporterEmail.value = "";
  reporterName.value = "";
  informationsAreCompleted.value = false;
  privacyAccepted.value = false;
  showForm.value = false;
};

const cleanForm = () => {
  reportDescription.value = "";
  reporterEmail.value = "";
  reporterName.value = "";
  informationsAreCompleted.value = false;
  privacyAccepted.value = false;
};

const getCurrentUrl = () => {
  reportedUrl.value = window.location.href;
};

const checkboxRules = computed(() => {
  if (!needAdditionalInformation.value) {
    if (
      reportDescription.value.length ||
      reporterEmail.value.length ||
      reporterName.value.length
    ) {
      return false;
    } else {
      return true;
    }
  }
  if (
    reportDescription.value.length ||
    reporterEmail.value.length ||
    reporterName.value.length
  ) {
    return false;
  } else {
    return true;
  }
});

const emitClose = () => {
  emit("close");
};

onMounted(() => {
  getCurrentUrl();
});
</script>
<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.options-select
  border: 1px solid $dark-grey
  gap: 10px

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

.blurred-background
  filter: blur(3.5px)
</style>
