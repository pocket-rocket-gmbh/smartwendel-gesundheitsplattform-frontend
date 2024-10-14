<template>
  <div>
    <Loading v-if="loadingItem" />
    <div class="field split">
      <v-file-input
        :disabled="
          tagName === 'insurance' &&
          (itemId
            ? item?.sanitized_documents.filter((doc) => doc.tag === 'insurance').length >= 1
            : offlineDocuments.filter((doc) => doc.tag === 'insurance').length >= 1)
        "
        class="text-field file-input general-font-size"
        label="Datei auswählen"
        v-model="file"
        @change="handleFile"
        accept="application/pdf,application/vnd.ms-excel"
        show-size
      />
      <v-text-field
        class="text-field is-dark-grey"
        :disabled="
          tagName === 'insurance' &&
          (itemId
            ? item?.sanitized_documents.filter((doc) => doc.tag === 'insurance').length >= 1
            : offlineDocuments.filter((doc) => doc.tag === 'insurance').length >= 1)
        "
        label="Bezeichnung*"
        v-model="filename"
      />
    </div>
    <div class="errors">
      <div v-if="errorInvalidFileType">
        <span class="warning">
          <v-alert
            type="error"
            density="compact"
            closable
            class="mt-2 general-font-size"
            >nur (.pdf) Dateien sind erlaubt</v-alert
          >
        </span>
      </div>
      <div v-if="errorFileSizeTooLarge">
        <v-alert
          type="warning"
          density="compact"
          closable
          class="mt-2 general-font-size"
          >die ausgewählte Datei ist zu groß, es sind nur Dateien von maximal 10 MB erlaubt</v-alert
        >
      </div>
    </div>
    <v-btn
      class="mt-5"
      @click="save"
      v-if="!loadingItem"
      :disabled="(filename === '' && !errorInvalidFileType && !errorFileSizeTooLarge) || !fileUrl?.length"
    >
      Hinzufügen
    </v-btn>
    <div class="text-caption is-dark-grey">* Maximal 10 MB, PDF erlaubt</div>
    <span
      class="mr-3 is-red is-dark-grey"
      v-if="loadingItem"
      >wird hochgeladen ....</span
    >

    <v-list
      class="mt-5"
      v-if="tagName === 'insurance'"
    >
      <template v-if="itemId">
        <v-list-item
          v-for="document in item.sanitized_documents.filter((doc) => doc.tag === 'insurance')"
          :key="document.id"
          :title="document.title"
          item-props
          class="general-font-size is-dark-grey"
        >
          <template v-slot:prepend>
            <v-btn
              class="mx-3"
              size="large"
              color="red"
              :href="document.url"
              target="_blank"
              density="compact"
              icon="mdi-file-pdf-box"
            >
            </v-btn>
          </template>
          <span class="general-font-size is-dark-grey">
            <i>{{ document.name.replace("-insurance", ".pdf") }}</i>
          </span>
          <v-divider></v-divider>
          <span
            v-if="documentAcepted"
            class="d-flex align-center text-primary"
          >
            <v-icon>mdi-check-decagram-outline</v-icon>
            <span class="general-font-size is-dark-grey">
              <i>Genehmigt</i>
            </span>
          </span>
          <span
            v-else
            class="d-flex align-center text-warning"
          >
            <v-icon>mdi-alert-outline</v-icon>
            <span class="general-font-size is-dark-grey">
              <i>Datei wird überprüft</i>
            </span>
          </span>

          <template v-slot:append>
            <v-btn
              icon="mdi-delete"
              variant="text"
              @click="deleteFile(document.signed_id)"
            ></v-btn>
          </template>
        </v-list-item>
      </template>
      <template v-else>
        <v-list-item
          v-for="(document, index) in offlineDocuments.filter((doc) => doc.tag === 'insurance')"
          :key="index"
          :title="document.documentname"
          item-props
          class="general-font-size is-dark-grey"
        >
          <template v-slot:prepend>
            <v-btn
              class="mx-3"
              size="large"
              color="red"
              :href="getUrlToDocument(document.document)"
              target="_blank"
              density="compact"
              icon="mdi-file-pdf-box"
            >
            </v-btn>
          </template>
          <v-divider></v-divider>
          <span
            v-if="documentAcepted"
            class="d-flex align-center text-primary"
          >
            <v-icon>mdi-check-decagram-outline</v-icon>
            <span class="general-font-size is-dark-grey">
              <i>Genehmigt</i>
            </span>
          </span>
          <span
            v-else
            class="d-flex align-center text-warning"
          >
            <v-icon>mdi-alert-outline</v-icon>
            <span class="general-font-size is-dark-grey">
              <i>Datei wird überprüft</i>
            </span>
          </span>
          <template v-slot:append>
            <v-btn
              icon="mdi-delete"
              variant="text"
              @click="deleteOfflineFile('insurance', index)"
            ></v-btn>
          </template>
        </v-list-item>
      </template>
    </v-list>
    <v-list
      class="mt-5"
      v-else
    >
      <template v-if="itemId">
        <v-list-item
          v-for="document in item.sanitized_documents.filter((doc) => doc.tag !== 'insurance')"
          :key="document.id"
          :title="document.title"
          item-props
          class="general-font-size is-dark-grey"
        >
          <template v-slot:prepend>
            <v-btn
              class="mx-3"
              size="large"
              color="red"
              :href="document.url"
              target="_blank"
              density="compact"
              icon="mdi-file-pdf-box"
            >
            </v-btn>
          </template>
          <span class="general-font-size is-dark-grey">
            <i>{{ document.name.replace("-documents", ".pdf") }}</i>
          </span>
          <v-divider></v-divider>
          <template v-slot:append>
            <v-btn
              icon="mdi-delete"
              variant="text"
              @click="deleteFile(document.signed_id)"
            ></v-btn>
          </template>
        </v-list-item>
      </template>
      <template v-else>
        <v-list-item
          v-for="(document, index) in offlineDocuments.filter((doc) => doc.tag !== 'insurance')"
          :key="index"
          :title="document.documentname"
          item-props
          class="general-font-size is-dark-grey"
        >
          <template v-slot:prepend>
            <v-btn
              class="mx-3"
              size="large"
              color="red"
              :href="getUrlToDocument(document.document)"
              target="_blank"
              density="compact"
              icon="mdi-file-pdf-box"
            >
            </v-btn>
          </template>
          <v-divider></v-divider>
          <template v-slot:append>
            <v-btn
              icon="mdi-delete"
              variant="text"
              @click="deleteOfflineFile('documents', index)"
            ></v-btn>
          </template>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts" setup>
import { ResultStatus } from "@/types/serverCallResult";
import type { CreateEditFacility } from "~/types/facilities";

const emit = defineEmits<{
  (event: "offline", docs: CreateEditFacility["offlineDocuments"]): void;
  (event: "documentDeleted"): void;
  (event: "updatedFiles", docs: CreateEditFacility["sanitized_documents"]): void;
  (event: "areDocumentsSet", isSet: boolean, type: string): void;
}>();

const props = defineProps<{
  itemId: string;
  tagName: "documents" | "insurance";
  documentAcepted?: boolean;
  offlineDocuments?: CreateEditFacility["offlineDocuments"];
}>();

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());

const file = ref({}) as any;
const filename = ref("");
const tag = ref("");
const errorInvalidFileType = ref(false);
const loadingItem = ref(false);
const fileUrl = ref(null);
const errors = ref([]);
const fileSelected = ref(false);

const errorFileSizeTooLarge = ref(false);
const item = ref({
  sanitized_documents: [],
});

const handleFile = async () => {
  const selectedFile = Array.isArray(file.value) ? file.value[0] : file.value;
  if (selectedFile) {
    fileSelected.value = true;
  }

  if (selectedFile && selectedFile.size / 1000000 > 10) {
    errorFileSizeTooLarge.value = true;
    file.value = {};
    return;
  }

  const fileExtension = selectedFile?.name.split(".").pop().toLowerCase();
  if (fileExtension !== "pdf") {
    errorInvalidFileType.value = true;
    file.value = {};
    return;
  }

  errorInvalidFileType.value = false;
  errorFileSizeTooLarge.value = false;

  fileUrl.value = await getBase64File(selectedFile);
};

const getBase64File = async (file: any) => {
  const data = await file.arrayBuffer();
  const base64 = arrayBufferToBase64(data, "application/octet");
  return base64;
};

const arrayBufferToBase64 = (buffer: any, mimetype: string) => {
  let binary = "";
  let bytes = new Uint8Array(buffer);
  let length = bytes.byteLength;

  for (let i = 0; i < length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return `data:${mimetype};base64,${window.btoa(binary)}`;
};

const getCareFacility = async () => {
  api.setEndpoint(`care_facilities/${props.itemId}`);
  loadingItem.value = true;
  await api.getItem();
  emit("updatedFiles", api.item.value?.sanitized_documents);
  loadingItem.value = false;
  item.value = api.item.value;
  const typeSet = item.value?.sanitized_documents?.some((item) => item.tag === props.tagName);
  emit("areDocumentsSet", typeSet, props.tagName);
};

const save = async () => {
  if (props.itemId) {
    api.setEndpoint(`care_facilities/${props.itemId}/documents`);
    loadingItem.value = true;
    const data = {
      document: fileUrl.value,
      documentname: filename.value,
      tag: props.tagName,
    };
    const result = await api.createItem(data, "Dokument erfolgreich hinzugefügt");
    fileUrl.value = null;
    if (result.status === ResultStatus.SUCCESSFUL) {
      loadingItem.value = false;
      filename.value = "";
      tag.value = props.tagName;
      file.value = {};
      getCareFacility();
    } else {
      errors.value = result.data;
      loadingItem.value = false;
    }
  }

  handleEmitOffline([
    ...(props.offlineDocuments || []),
    {
      document: fileUrl.value,
      documentname: filename.value,
      tag: props.tagName,
    },
  ]);

  fileUrl.value = null;
  filename.value = "";
  tag.value = props.tagName;
  file.value = {};
};

const handleEmitOffline = (docs: CreateEditFacility["offlineDocuments"]) => {
  emit("offline", docs);
  const typeSet = docs?.some((item) => item.tag === props.tagName);
  emit("areDocumentsSet", typeSet, props.tagName);
};

const getUrlToDocument = (document: string) => {
  const byteCharacters = atob(document.split(";base64,")[1]);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
    const slice = byteCharacters.slice(offset, offset + 1024);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: "application/pdf" });

  // Create a URL from the Blob
  const url = URL.createObjectURL(blob);
  return url;
};

const deleteFile = async (signedId: string) => {
  api.setEndpoint(`care_facilities/${props.itemId}/documents/${signedId}`);
  loadingItem.value = true;
  const result = await api.deleteItem("Dokument erfolgreich gelöscht");
  if (result.status === ResultStatus.SUCCESSFUL) {
    loadingItem.value = false;
    getCareFacility();
    emit("documentDeleted");
  } else {
    errors.value = result.data;
    loadingItem.value = false;
  }
};

const deleteOfflineFile = async (tag: typeof props.tagName, docIndex: number) => {
  const relevantDocs = props.offlineDocuments.filter((doc) => doc.tag === tag);
  const otherDocs = props.offlineDocuments.filter((doc) => doc.tag !== tag);

  relevantDocs.splice(docIndex, 1);

  handleEmitOffline([...relevantDocs, ...otherDocs]);
};

const handleMount = () => {
  if (props.itemId) {
    getCareFacility();
    return;
  }
};

watch(
  () => props.itemId,
  () => handleMount()
);

onMounted(() => {
  handleMount();
});
</script>
<style lang="sass">
.close
  position: absolute
  top: -10px
  right: -10px
  cursor: pointer
</style>
