<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-top-transition"
    width="1200"
    v-auto-animate
    @click:outside="emitClose()"
    :persistent="!!historyContent.length"
  >
    <v-card  height="auto" style="overflow: hidden">
      <v-card-title class="text-h5 d-flex align-center pa-0 ma-0 my-2 mx-3"
        ><v-icon
          v-if="actionsDialogOpen"
          @click="
            actionsDialogOpen = false;
            openedActions = false;
          "
          size="small"
          >mdi-chevron-left</v-icon
        >
        <span v-if="actionsDialogOpen">
          Inhalt {{ selectedAction === "block" ? "sperren" : "löschen" }}
        </span>
        <span v-else>Inhalt melden</span>
      </v-card-title>
      <v-card-text v-auto-animate>
        <div v-if="!actionsDialogOpen && !openedActions && !saved">
          <div class="field">
            <v-select
              v-model="currentStatus"
              label="Status"
              :items="status"
              item-title="name"
              item-value="id"
              single-line
              hide-details="auto"
              :disabled="successFullySent"
            />
          </div>

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
          <div class="field">
            <v-text-field
              label="Name"
              hide-details="auto"
              disabled
              :model-value="item?.reporter_name"
            />
          </div>
          <div class="field d-flex align-center ga-5">
            <v-text-field
              label="E-Mail"
              hide-details="auto"
              disabled
              :model-value="item?.reporter_email"
            />
            <v-icon @click="openMail(item?.reporter_email)">mdi-at</v-icon>
          </div>
          <v-textarea
            :model-value="item?.reason"
            disabled
            counter
            maxlength="300"
            hide-details="auto"
            label="Beschreibung"
          />
        </div>

        <div v-if="openedActions && !actionsDialogOpen">
          <v-alert
            key="1"
            color="warning"
            elevation="2"
            icon="mdi-alert"
            outlined
            class="my-3"
            >Sicher?</v-alert
          >
          <v-row>
            <v-col class="d-flex justify-center">
              <v-btn
                color="warning"
                variant="outlined"
                dark
                @click="openActionsDialog('blockContent')"
              >
                Inhalt sperren
              </v-btn>
            </v-col>
            <v-col class="d-flex justify-center">
              <v-btn
                color="warning"
                variant="outlined"
                dark
                @click="openActionsDialog('blockUser')"
              >
                Benutzer sperren
              </v-btn>
            </v-col>
            <v-col class="d-flex justify-center">
              <v-btn
                color="red darken-1"
                variant="outlined"
                dark
                @click="openActionsDialog('deleteContent')"
                :loading="loadingItem"
              >
                Inhalt Löschen
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <div v-if="actionsDialogOpen">
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
              :disabled="successFullySent"
            />
          </div>
        </div>
        <div v-if="successFullySent">
          <v-alert type="success" elevation="2" icon="mdi-check">
            <v-row>
              <v-col class="d-flex align-center justify-start">
                Beschwerde erfolgreich gesendet
              </v-col>
              <v-col class="d-flex align-center justify-end">
                <v-btn prepend-icon="mdi-file-pdf-box">
                  <template v-slot:prepend>
                    <v-icon size="x-large" color="red"></v-icon>
                  </template>

                  Download Protokoll
                </v-btn>
                {{ selectedAction }}
              </v-col>
            </v-row>
          </v-alert>
        </div>
        <div v-if="saved">
          <v-alert type="success" elevation="2" icon="mdi-check">
            gespeichert
          </v-alert>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-row>
          <v-col class="d-flex justify-start">
            <v-btn
              color="blue darken-1"
              variant="outlined"
              dark
              @click="emitClose()"
              :loading="loadingItem"
            >
              Schließen
            </v-btn>
          </v-col>
          <v-col class="d-flex justify-end" v-if="!successFullySent">
            <v-btn
              v-if="currentStatusChanged && !saved"
              color="success"
              variant="outlined"
              dark
              @click="save()"
            >
              <span> Speichern </span>
            </v-btn>
            <v-btn
              v-else-if="!saved"
              :color="historyContent && !successFullySent ? 'success' : 'red darken-1'"
              variant="outlined"
              dark
              @click="historyContent ? (successFullySent = true) : openActions()"
            >
              <span v-if="historyContent && !successFullySent"> Aktion bestätigen </span>
              <span v-else-if="openedActions && !successFullySent"> abbrechen </span>
              <span v-else-if="!successFullySent"> Maßnahmen </span>
              <span v-else-if="saved"> beenden </span>  
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts" setup>
const emit = defineEmits(["close", "refreshCollection"]);
const props = defineProps<{
  itemId: string;
}>();

const item = ref<any>({});
const openedActions = ref(false);
const loadingItem = ref(false);
const dialog = ref(true);
const actionsDialogOpen = ref(false);
const selectedAction = ref("");

const loading = ref(false);

const historyContent = ref("");
const historyAction = ref("");

const currentStatus = ref("Offen");

const saved = ref(false);

const currentStatusChanged = ref(false);

const successFullySent = ref(false);

const showApi = useCollectionApi();
showApi.setBaseApi(usePrivateApi());

const createUpdateApi = useCollectionApi();
createUpdateApi.setBaseApi(usePrivateApi());

const allRoles = [
  { name: "sexuellem Missbrauch", id: "law_break" },
  { name: "sexueller Ausbeutung", id: "harassment" },
  { name: "Kinderpornografie", id: "spam" },
  { name: "sexuelle Zwecke", id: "terms_violation" },
  { name: "Anstiftung", id: "other" },
];

const status = [
  { name: "Offen", id: "open" },
  { name: "Abgelehnt", id: "rejected" },
  { name: "In Bearbeitung", id: "pending" },
  { name: "Geschlossen", id: "completed" },
];

const save = async () => {
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
      saved.value = true;
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



const getItem = async () => {
  showApi.setEndpoint(`complaints/${props.itemId}`);
  loadingItem.value = true;
  await showApi.getItem();
  loadingItem.value = false;
  item.value = showApi.item.value;
};

const openActionsDialog = (action: string) => {
  actionsDialogOpen.value = true;
  selectedAction.value = action;
};

const openActions = () => {
  openedActions.value = !openedActions.value;
  if (selectedAction.value) {
    actionsDialogOpen.value = false;
  }
  if (currentStatus.value) {
    console.log("saved");
  }
};

const emitClose = () => {
  if (historyContent.value && !successFullySent.value) {
    return;
  }
  emit("close");
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
    console.log("changed");
    currentStatusChanged.value = true;
  }
);

onMounted(() => {
  getItem();
});
</script>
<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
</style>
