<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-top-transition"
    v-auto-animate
    width="1000"
    @click:outside="emitClose()"
    :persistent="!!historyContent.length"
    :class="loading ? 'blurred-background' : ''"
  >
    <v-card height="auto">
      <v-card-title class="text-h5 d-flex align-center pa-0 ma-0 my-2 mx-3">
        <v-icon
          v-if="currentTab === 'three'"
          @click="currentTab = 'two'"
          size="small"
          >mdi-chevron-left</v-icon
        >
        <span>Beschwerde</span>
        <v-col class="d-flex align-center justify-end ga-5">
          <v-btn
            prepend-icon="mdi-form-select"
            @click="openFormPage(itemId)"
            :disabled="!alreadyTakenActions"
          >
            <template v-slot:prepend>
              <v-icon size="x-large" color="red"></v-icon>
            </template>
            Einspruchsformular
          </v-btn>

          <v-btn prepend-icon="mdi-file-pdf-box" @click="generatePdf(itemId)">
            <template v-slot:prepend>
              <v-icon size="x-large" color="red"></v-icon>
            </template>
            Download Protokoll
          </v-btn>
        </v-col>
      </v-card-title>

      <v-tabs v-model="currentTab" align-tabs="center" class="tabs mb-3">
        <v-tab value="one">Inhalt</v-tab>
        <v-tab value="two">Maßnahmen</v-tab>
        <v-tab value="three">History</v-tab>
      </v-tabs>
      <v-card-text v-auto-animate>
        <v-alert v-if="alreadyTakenActions" type="info" class="mb-2"
          ><span v-if="isBlockedFacility">
            Schon bearbeitet: Inhalt gesperrt
          </span>
          <span v-else> Schon bearbeitet: Benutzer gesperrt </span>
        </v-alert>
        <v-alert type="warning" class="mb-2" v-if="wereObjected"
          >Dieser Beschwerde wurde widersprochen</v-alert
        >
        <v-tabs-window v-model="currentTab" v-auto-animate>
          <v-tabs-window-item v-if="currentTab === 'one'" value="one">
            <div>
              <div class="field">
                <v-select
                  v-model="item.kind"
                  label="Titel"
                  :items="allRoles"
                  item-title="name"
                  item-value="id"
                  single-line
                  hide-details="auto"
                  readonly
                />
              </div>
              <div class="field">
                <v-text-field
                  label="Titel"
                  hide-details="auto"
                  readonly
                  :model-value="item.page_title"
                />
              </div>
              <div class="field d-flex align-center ga-5">
                <v-text-field
                  label="URL"
                  hide-details="auto"
                  readonly
                  :model-value="item?.url"
                />
                <v-icon @click="goToLink(item?.url)">mdi-open-in-new</v-icon>
              </div>
              <div class="field" v-if="item?.reporter_name">
                <v-text-field
                  label="Name"
                  hide-details="auto"
                  readonly
                  :model-value="item?.reporter_name"
                />
              </div>
              <div
                class="field d-flex align-center ga-5"
                v-if="item?.reporter_email"
              >
                <v-text-field
                  label="E-Mail"
                  hide-details="auto"
                  readonly
                  :model-value="item?.reporter_email"
                />
                <v-icon @click="openMail(item?.reporter_email)">mdi-at</v-icon>
              </div>
              <v-textarea
                v-if="item?.reason"
                :model-value="item?.reason"
                readonly
                counter
                maxlength="300"
                hide-details="auto"
                label="Beschreibung"
              />
            </div>
          </v-tabs-window-item>

          <v-tabs-window-item v-if="currentTab === 'two'" value="two">
            <div class="my-2 d-flex align-center">
              <span class="general-font-size is-dark-grey font-weight-bold mr-3"
                >Status</span
              >
            </div>
            <div class="field">
              <v-select
                v-model="currentStatus"
                label="Status"
                :items="status"
                item-title="name"
                item-value="value"
                single-line
                hide-details="auto"
                @update:model-value="currentStatus = $event"
              />
            </div>
            <div v-auto-animate>
              <v-alert v-if="currentStatus === 'rejected'" type="warning">
                Maßnahmen nicht möglich
              </v-alert>
              <v-row
                v-if="currentStatus !== 'rejected' && currentStatus !== 'open'"
              >
                <div class="my-15 d-flex align-center">
                  <div
                    class="general-font-size is-dark-grey font-weight-bold ml-3"
                  >
                    Maßnahmen
                  </div>
                </div>
                <v-col
                  class="d-flex justify-center my-15"
                  v-for="action in actions"
                  :key="action.value"
                >
                  <v-btn
                    variant="outlined"
                    dark
                    :loading="loading"
                    :class="selectedAction === action.value ? 'selected' : ''"
                    @click="setCurrentAction(action.value)"
                  >
                    {{ action.label }}
                  </v-btn>
                </v-col>
              </v-row>
              <div
                v-if="
                  currentStatus !== 'open' && selectedAction !== 'unchanged'
                "
              >
                <div class="my-2 d-flex align-center">
                  <span
                    class="general-font-size is-dark-grey font-weight-bold mr-3"
                    >Protokoll generieren</span
                  >
                </div>
                <div class="field">
                  <v-textarea
                    v-model="historyContent"
                    counter
                    maxlength="300"
                    hide-details="auto"
                    label="Grund"
                    :disabled="!currentStatusChanged"
                  />
                </div>
              </div>
              <div
                class="d-flex align-center justify-start my-1"
                v-if="
                  item?.reporter_email &&
                  currentStatus !== 'open' &&
                  selectedAction !== 'unchanged'
                "
              >
                <v-checkbox
                  v-model="sendNotification"
                  :disabled="!currentStatusChanged"
                  :value="true"
                  label="Soll eine zusätzliche Email gesendet werden?"
                  hide-details
                />
              </div>
              <div v-if="sendNotification" class="mt-5">
                <div class="field">
                  <v-textarea
                    v-model="notificationMessage"
                    counter
                    maxlength="300"
                    hide-details="auto"
                    label="Nachricht"
                  />
                </div>
              </div>
              <div v-if="saved" class="mt-2">
                <v-alert type="success" elevation="2" icon="mdi-check">
                  gespeichert
                </v-alert>
              </div>
            </div>
          </v-tabs-window-item>
          <v-tabs-window-item v-if="currentTab === 'three'" value="three">
            <div class="histories mt-n4">
              <div
                v-for="(history, index) in sortedHistory"
                :key="history.timestamp"
              >
                <div
                  class="history"
                  :class="history.status === 'objection' ? 'has-objection' : ''"
                >
                  <v-row>
                    <v-col class="d-flex align-start justify-start">
                      <span class="is-dark-grey font-weight-bold">{{
                        useDatetime().parseDateAndTime(history?.timestamp)
                      }}</span>
                    </v-col>
                    <v-col class="d-flex flex-column align-end justify-end">
                      <div class="is-dark-grey font-weight-bold">
                        <span v-if="!history.action">Erstellt</span>
                        <span v-else>
                          {{ translateAction(history.action) }}</span
                        >
                      </div>
                      <div>
                        <span v-if="history?.user?.name"
                          ><img :src="logo" width="20" class="mr-2" /><i>{{
                            history?.user?.name
                          }}</i></span
                        >
                        <span v-else-if="item?.reporter_name"
                          ><i>{{ item?.reporter_name }}</i></span
                        >
                        <span v-else>Unbekannt</span>
                      </div>
                    </v-col>
                  </v-row>
                  <div class="general-font-size">
                    Grund: {{ history.content }}
                  </div>
                  <div class="general-font-size">
                    Status: {{ translateSatus(history.status) }}
                    <span v-if="history.status === 'objection'"
                      ><v-icon color="warning">mdi-alert</v-icon></span
                    >
                    <div
                      class="general-font-size"
                      v-auto-animate
                      v-if="history?.user?.name"
                    >
                      Email gesendet:
                      {{ history.action_notification_sent ? "Ja" : "Nein" }}
                      <v-icon
                        @click="showEmail(index)"
                        v-if="history.action_notification_sent"
                      >
                        {{
                          expandedItems[index as keyof typeof expandedItems]
                            ? "mdi-chevron-up"
                            : "mdi-chevron-down"
                        }}
                      </v-icon>
                      <div
                        v-if="expandedItems[index as keyof typeof expandedItems]"
                        class="history-email"
                      >
                        {{ history.action_notification_message }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
      <div
        v-auto-animate
        class="d-flex align-center"
        v-if="
          currentStatusChanged &&
          !alreadyTakenActions &&
          currentTab === 'two' &&
          selectedAction !== 'unchanged'
        "
      >
        
        
        <div class="field ml-5">
          <v-checkbox v-model="confirmActions" label="Hiermit bestätige ich, dass meine Angaben zur getätigten Maßnahme korrekt sind" :value="true" hide-details />
        </div>
      </div>
      <v-card-actions>
        <v-row>
          <v-col class="d-flex justify-start">
            <v-btn
              color="blue darken-1"
              variant="outlined"
              dark
              @click="emitClose()"
              :loading="loading"
            >
              Schließen
            </v-btn>
          </v-col>
          <v-col class="d-flex justify-end">
            <v-btn
              color="success"
              variant="outlined"
              dark
              @click="save()"
              :disabled="saveConditions"
            >
              <span> Speichern </span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
    <Loading v-if="loading" />
  </v-dialog>
</template>
<script lang="ts" setup>
import { ResultStatus } from "@/types/serverCallResult";
import logo from "@/assets/images/lk-logo.png";

const emit = defineEmits(["close", "refreshCollection"]);
const props = defineProps<{
  itemId: string;
}>();

const item = ref<any>({});
const dialog = ref(true);
const selectedAction = ref("unchanged");
const currentTab = ref("one");
const notificationMessage = ref("");
const loading = ref(false);
const sendNotification = ref(false);
const historyContent = ref("");
const currentStatus = ref("");
const saved = ref(false);
const currentStatusChanged = ref(false);
const confirmActions = ref(false);

const isBlockedFacility = ref(null);
const isBlockedUser = ref(null);

const alreadyTakenActions = ref(false);

const snackbar = useSnackbar();

const showApi = useCollectionApi();
showApi.setBaseApi(usePrivateApi());
const privateApi = usePrivateApi();

const updateApi = useCollectionApi();
updateApi.setBaseApi(usePrivateApi());

const allRoles = [
  { name: "Verstoß gegen geltendes Recht", id: "law_break" },
  { name: "Belästigung", id: "harassment" },
  { name: "Spam", id: "spam" },
  { name: "Verstoß gegen die Nutzungsbedingungen", id: "terms_violation" },
  { name: "Andere", id: "other" },
];

const status = [
  { name: "Einspruch", value: "objection" },
  { name: "Offen", value: "open" },
  { name: "In Bearbeitung", value: "pending" },
  { name: "Geschlossen", value: "complete" },
  { name: "Abgelehnt", value: "rejected" },
];

const actions = [
  { label: "keine maßnahmen", value: "unchanged" },
  { label: "Inhalt sperren", value: "blockContent" },
  { label: "Benutzer sperren", value: "blockUser" },
];

const save = async () => {
  const data = {
    status: currentStatus.value,
    send_action_notification: sendNotification.value,
    last_action: selectedAction.value,
    action: selectedAction.value,
    content: historyContent.value,
    action_notification_sent: sendNotification.value,
    action_notification_message: notificationMessage.value,
  };
  loading.value = true;
  const result = await privateApi.call(
    "put",
    `/complaints/${item.value.id}`,
    data
  );
  if (result.status === ResultStatus.SUCCESSFUL) {
    await takeAction();
    await getItem();
    saved.value = true;
    setTimeout(() => {
      saved.value = false;
    }, 3000);
    sendNotification.value = false;
    currentStatusChanged.value = false;
    selectedAction.value = "unchanged";
    notificationMessage.value = "";
    historyContent.value = "";
    currentTab.value = "one";
    getItem();
  } else {
    snackbar.showError("Ein Fehler ist aufgetreten");
  }
  loading.value = false;
};

const getItem = async () => {
  showApi.setEndpoint(`complaints/${props.itemId}`);
  loading.value = true;
  const options = {
    page: 1,
    per_page: 999,
    sort_by: "updated_at",
    sort_order: "desc",
    searchQuery: null as any,
    concat: false,
    filters: [] as any,
  };

  const result = await showApi.retrieveCollection(options);
  loading.value = false;

  item.value = result.data.resource;
  selectedAction.value = item.value.last_action || "unchanged";

  if (
    selectedAction.value !== "unchanged" &&
    item.value.status === "complete"
  ) {
    alreadyTakenActions.value = true;
  }
  currentStatus.value = item.value.status;
};

const expandedItems = ref({});

const showEmail = (index: any) => {
  expandedItems.value[index] = !expandedItems.value[index];
};

const takeAction = async () => {
  if (selectedAction.value === "blockContent") {
    await blockFacility();
  } else if (selectedAction.value === "blockUser") {
    await blockUser();
  } else {
    return;
  }
};

const wereObjected = computed(() => {
  return item.value?.status === "objection";
});

const blockUser = async () => {
  updateApi.setEndpoint(`users/${item.value?.meta_data?.user_id}`);
  let data = {
    is_active_on_health_scope: false,
    status: "disabled",
  };
  await updateApi.updateItem(data, null);
  disableFacility();
};

const disableFacility = async () => {
  updateApi.setEndpoint(`care_facilities/${item.value.meta_data.facility_id}`);
  let data = {
    is_active: false,
  };
  await updateApi.updateItem(data, null);
};

const blockFacility = async () => {
  updateApi.setEndpoint(`care_facilities/${item.value.meta_data.facility_id}`);
  let data = {
    is_active: false,
    blocked: true,
  };
  await updateApi.updateItem(data, null);
};

const getFacility = async () => {
  const result = await privateApi.call(
    "get",
    `/care_facilities/${item.value.meta_data.facility_id}`
  );
  if (result.status === ResultStatus.SUCCESSFUL) {
    isBlockedFacility.value = result.data.resource.blocked;
  } else {
    snackbar.showError("Ein Fehler ist aufgetreten");
  }
};

const getUser = async () => {
  const result = await privateApi.call(
    "get",
    `/users/${item.value?.meta_data?.user_id}`
  );
  if (result.status === ResultStatus.SUCCESSFUL) {
    isBlockedUser.value = result.data.resource.is_active_on_health_scope;
  } else {
    snackbar.showError("Ein Fehler ist aufgetreten");
  }
};

const setCurrentAction = (action: string) => {
  if (selectedAction.value === action) {
    selectedAction.value = "unchanged";
  } else {
    selectedAction.value = action;
  }
};

const sortedHistory = computed(() => {
  return item.value.history.slice().sort((a: any, b: any) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
});

const pdfUrl = ref("");

const generatePdf = async (itemId: any) => {
  const result = await privateApi.call(
    "get",
    `/complaints/${itemId}/history_pdf`
  );
  if (result.status === ResultStatus.SUCCESSFUL) {
    pdfUrl.value = result.data.resource.history_pdf_url;
    openPdf();
  } else {
    snackbar.showError("Ein Fehler ist aufgetreten");
  }
};

const openFormPage = (itemId: any) => {
  return window.open(`/complaints?token=${itemId}`, "_blank");
};

const openPdf = () => {
  return window.open(pdfUrl.value, "_blank");
};

const saveConditions = computed(() => {
  if (
    (currentStatus.value === "pending" &&
      selectedAction.value === "unchanged") ||
    currentStatus.value === "rejected" ||
    currentStatus.value === "objection"
  ) {
    return false;
  } else {
    return (
      !historyContent.value ||
      (sendNotification.value && !notificationMessage.value) ||
      !confirmActions.value ||
      !currentStatusChanged.value
    );
  }
});

const emitClose = () => {
  emit("close");
};

const translateAction = (action: string) => {
  switch (action) {
    case "blockContent":
      return "Inhalt gesperrt";
    case "blockUser":
      return "Benutzer gesperrt";
    case "deleteContent":
      return "Inhalt gelöscht";
    case "unchanged":
      return "Unverändert";
  }
};

const translateSatus = (status: string) => {
  switch (status) {
    case "open":
      return "Offen";
    case "rejected":
      return "Abgelehnt";
    case "pending":
      return "In Bearbeitung";
    case "complete":
      return "Geschlossen";
    case "objection":
      return "Einspruch";
    default:
      return "Unbekannt";
  }
};

const openMail = (email: string) => {
  window.open(`mailto:${email}`);
};

const goToLink = (item: any) => {
  const link = item;
  return window.open(link, "_blank");
};

watch(
  () => currentStatus.value,
  () => {
    currentStatusChanged.value = true;
  }
);

onMounted(async () => {
  await getItem();
  await getFacility();
  await getUser();
});
</script>
<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.history
  background-color: #f5f5f5
  padding: 15px
  border-radius: 25px
  margin: 20px 0

.selected
  background-color: $primary-color
  color: white

.histories
  max-height: 900px
  overflow-y: auto

.blurred-background
  filter: blur(3.5px)

.history-email
  border: 1px solid $dark-grey
  padding: 15px
  border-radius: 25px
  margin: 20px 0
  max-height: 100px
  overflow-y: auto

.comfirm-actions
  background-color: $yellow
  padding: 10px
  border-radius: 25px
  margin: 5px 5px

.has-objection
  background-color: #FFCDCD
  padding: 15px
  border-radius: 25px
  margin: 20px 0
</style>
