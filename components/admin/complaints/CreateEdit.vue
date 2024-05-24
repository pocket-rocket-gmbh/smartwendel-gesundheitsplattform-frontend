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
    <v-card height="auto" style="overflow: hidden">
      <v-card-title class="text-h5 d-flex align-center pa-0 ma-0 my-2 mx-3">
        <v-icon v-if="currentTab === 'three'" @click="currentTab = 'two'" size="small"
          >mdi-chevron-left</v-icon
        >
        <span>Inhalt melden</span>
        <v-col class="d-flex align-center justify-end">
          <v-btn prepend-icon="mdi-file-pdf-box" disabled>
            <template v-slot:prepend>
              <v-icon size="x-large" color="red"></v-icon>
            </template>
            Download Protokoll
          </v-btn>
        </v-col>
      </v-card-title>
      <v-tabs v-model="currentTab" align-tabs="center" class="tabs mb-3">
        <v-tab value="one">Inhalt</v-tab>
        <v-tab :disabled="alreadyTakenActions" value="two">Maßnahmen</v-tab>
        <v-tab value="three">History</v-tab>
      </v-tabs>
      <v-card-text v-auto-animate>
        <v-alert v-if="alreadyTakenActions" type="warning" class="mb-2"
          >Schon bearbeitet</v-alert
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
                  disabled
                />
              </div>
              <div class="field">
                <v-text-field
                  label="Titel"
                  hide-details="auto"
                  disabled
                  :model-value="item.page_title"
                />
              </div>
              <div class="field d-flex align-center ga-5">
                <v-text-field
                  label="URL"
                  hide-details="auto"
                  disabled
                  :model-value="item?.url"
                />
                <v-icon @click="goToLink(item?.url)">mdi-open-in-new</v-icon>
              </div>
              <div class="field" v-if="item?.reporter_name">
                <v-text-field
                  label="Name"
                  hide-details="auto"
                  disabled
                  :model-value="item?.reporter_name"
                />
              </div>
              <div class="field d-flex align-center ga-5" v-if="item?.reporter_email">
                <v-text-field
                  label="E-Mail"
                  hide-details="auto"
                  disabled
                  :model-value="item?.reporter_email"
                />
                <v-icon @click="openMail(item?.reporter_email)">mdi-at</v-icon>
              </div>
              <v-textarea
                v-if="item?.reason"
                :model-value="item?.reason"
                disabled
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
                :disabled="alreadyTakenActions"
                @update:model-value="currentStatus = $event"
              />
            </div>
            <div v-auto-animate>
              <v-alert v-if="currentStatus === 'rejected'" type="warning">
                Maßnahmen nicht möglich
              </v-alert>
              <v-row v-if="currentStatus !== 'rejected' && currentStatus !== 'open'">

                <div class="my-15 d-flex align-center">
                  <div class="general-font-size is-dark-grey font-weight-bold mr-3"
                    >Maßnahmen</div
                  >
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
                    :disabled="alreadyTakenActions"
                    :class="selectedAction === action.value ? 'selected' : ''"
                    @click="setCurrentAction(action.value)"
                  >
                    {{ action.label }}
                  </v-btn>
                </v-col>
              </v-row>
              <div v-if="currentStatus !== 'open' && selectedAction !== 'unchanged'">
                <div class="my-2 d-flex align-center">
                  <span class="general-font-size is-dark-grey font-weight-bold mr-3"
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
                    :disabled="!currentStatusChanged && alreadyTakenActions"
                  />
                </div>
              </div>
              <div
                class="d-flex align-center justify-start my-1"
                v-if="item?.reporter_email && currentStatus !== 'open' && selectedAction !== 'unchanged'"
              >
                <v-checkbox
                  v-model="sendNotification"
                  :disabled="!currentStatusChanged"
                  :value="true"
                  label="Email Senden"
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
              <div v-for="(history, index) in sortedHistory" :key="history.timestamp">
                <div class="history">
                  <v-row>
                    <v-col class="d-flex align-start justify-start">
                      <span class="is-dark-grey font-weight-bold">{{
                        useDatetime().parseDateAndTime(history?.timestamp)
                      }}</span>
                    </v-col>
                    <v-col class="d-flex flex-column align-end justify-end">
                      <div class="is-dark-grey font-weight-bold">
                        {{ translateAction(history.action) }}
                      </div>
                      <div>
                        <i>{{ history?.user?.name }}</i>
                      </div>
                    </v-col>
                  </v-row>
                  <div class="general-font-size">Grund: {{ history.content }}</div>
                  <div class="general-font-size">
                    Status: {{ translateSatus(history.status) }}
                    <div class="general-font-size" v-auto-animate>
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
        class="d-flex align-center justify-center my-1 comfirm-actions ga-1"
        v-if="currentStatusChanged && !alreadyTakenActions && currentTab === 'two' && selectedAction !== 'unchanged'"
      >
        <v-icon>mdi-alert-circle-outline</v-icon>
        <div>Bestätigen</div>
        <div>
          <v-checkbox v-model="confirmActions" :value="true" hide-details />
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
  { name: "Offen", value: "open" },
  { name: "In Bearbeitung", value: "pending" },
  { name: "Geschlossen", value: "complete" },
  { name: "Abgelehnt", value: "rejected" },
];

const actions = [
  { label: "keine maßnahmen", value: "unchanged" },
  { label: "Inhalt sperren", value: "blockContent" },
  { label: "Benutzer sperren", value: "blockUser" },
  { label: "Inhalt Löschen", value: "deleteContent" },
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
  const result = await privateApi.call("put", `/complaints/${item.value.id}`, data);
  if (result.status === ResultStatus.SUCCESSFUL) {
    getItem();
    saved.value = true;
    setTimeout(() => {
      saved.value = false;
    }, 3000);
    sendNotification.value = false;
    currentStatusChanged.value = false;
    selectedAction.value = "unchanged";
    notificationMessage.value = "";
    historyContent.value = "";
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
/* 
  const saveAction = async () => {
  updateApi.setEndpoint(`${care_facility}/${props.item.id}`);
  let data = {};
  data[props.fieldToSwitch] = switchValue.value;

  await updateApi.updateItem(data, null);
}; */

  const result = await showApi.retrieveCollection(options);
  loading.value = false;

  item.value = result.data.resource;
  selectedAction.value = item.value.last_action || "unchanged";

  if (selectedAction.value !== "unchanged" && item.value.status === "complete") {
    alreadyTakenActions.value = true;
  }

  currentStatus.value = item.value.status;
};

const expandedItems = ref({});

const showEmail = (index: any) => {
  expandedItems.value[index] = !expandedItems.value[index];
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

const saveConditions = computed(() => {
  if (currentStatus.value === "pending" && selectedAction.value === "unchanged" || currentStatus.value === "rejected") {
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
    default:
      return "Unbekannt";
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
  margin: 20px 20px
</style>
