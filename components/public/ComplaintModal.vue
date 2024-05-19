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
          <v-icon size="small" v-if="reportKind && !successFullySent" @click="reportKind = null"
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
        <v-form
          ref="complaintForm"
          v-if="reportKind && !successFullySent && needAdditionalInformation"
          class="mt-3"
        >
          <div>
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
            <div class="field">
              <v-text-field
                v-model="reporterName"
                label="Name"
                hide-details="auto"
                :rules="[rules.required]"
                :error-messages="useErrors().checkAndMapErrors('name', errors)"
              />
            </div>
            <div class="field">
              <v-text-field
                v-model="reporterEmail"
                label="E-Mail"
                hide-details="auto"
                :rules="[rules.required, rules.email]"
                :error-messages="useErrors().checkAndMapErrors('email', errors)"
              />
            </div>
            <div class="field">
              <v-textarea
                v-model="reportDescription"
                counter
                maxlength="300"
                hide-details="auto"
                label="Beschreibung"
                :error-messages="useErrors().checkAndMapErrors('description', errors)"
                :rules="[rules.required]"
              />
            </div>
            <v-checkbox
              label="Meine Angabe ist vollständig"
              class=""
              v-model="informationsAreCompleted"
              :rules="[rules.required]"
            />
            <v-checkbox v-model="privacyAccepted" :rules="[rules.required]">
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
              v-if="reportKind && !successFullySent"
              color="blue darken-1"
              variant="outlined"
              dark
              :disabled="submitButtonDisabledCondition"
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
    animated.value = true;
    console.log(error);
    setTimeout(() => {
      animated.value = false;
    }, 1000);
  }
};

const submitButtonDisabledConditionForm = computed(() => {
  return (
    !reportKind.value ||
    !reportedUrl.value ||
    !reporterName.value ||
    !reporterEmail.value ||
    !reportDescription.value ||
    !informationsAreCompleted.value ||
    !privacyAccepted.value
  );
});

const submitButtonDisabledCondition = computed(() => {
  if (submitButtonDisabledConditionForm.value && needAdditionalInformation.value) {
    return true;
  } else {
    return false;
  }
});

const needAdditionalInformation = computed(() => {
  if (
    (reportKind?.value && reportKind?.value?.value === 3) ||
    reportKind?.value?.value === 4
  ) {
    return true;
  } else {
    return false;
  }
});

const listOptions = ref([
  { text: "Straftaten im Zusammenhang mit sexuellem Missbrauch", value: 0 },
  { text: "Straftaten im Zusammenhang mit sexueller Ausbeutung", value: 1 },
  { text: "Straftaten im Zusammenhang mit Kinderpornografie", value: 2 },
  { text: "Kontaktaufnahme zu Kindern für sexuelle Zwecke", value: 3 },
  { text: "Anstiftung, Beihilfe und Versuch", value: 4 },
]);

const optionSelect = (option: any) => {
  reportKind.value = option;
};

const getCurrentUrl = () => {
  reportedUrl.value = window.location.href;
};

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
