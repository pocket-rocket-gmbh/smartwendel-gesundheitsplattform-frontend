<template>
  <div>
    <Loading v-if="loadingItem" />
    <div class="field split">
      <v-file-input
        :disabled="
          tagName === 'insurance' && item?.sanitized_documents.filter((doc) => doc.tag === 'insurance').length >= 1
        "
        class="mt-5"
        variant="underlined"
        clearable
        label="Datei auswählen"
        v-model="file"
        @change="handleFile"
      />
      <v-text-field
        :disabled="
          tagName === 'insurance' && item?.sanitized_documents.filter((doc) => doc.tag === 'insurance').length >= 1
        "
        variant="underlined"
        hide-details="auto"
        label="Bezeichnung*"
        v-model="filename"
      />
    </div>
    <div class="errors">
      <div v-if="errorInvalidFileType">
        <span class="warning">
          <v-alert type="error" density="compact" closable class="mt-2">nur (.pdf) Dateien sind erlaubt</v-alert>
        </span>
      </div>
      <div v-if="errorFileSizeTooLarge">
        <v-alert type="warning" density="compact" closable class="mt-2"
          >die ausgewählte Datei ist zu groß, es sind nur Dateien von maximal 5 MB erlaubt</v-alert
        >
      </div>
    </div>
    <v-btn
      class="mt-5"
      @click="save"
      v-if="!loadingItem"
      :disabled="filename === '' && !errorInvalidFileType && !errorFileSizeTooLarge && file"
    >
      Hinzufügen
    </v-btn>
    <div class="text-caption">* Maximal 5 MB, PDF erlaubt</div>
    <span class="mr-3 is-red" v-if="loadingItem">wird hochgeladen ....</span>

    <v-list class="mt-5" v-if="tagName === 'insurance'">
      <template v-if="itemId">
        <v-list-item
          v-for="document in item.sanitized_documents.filter((doc) => doc.tag === 'insurance')"
          :key="document.id"
          :title="document.title"
          item-props
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
          <p>{{ document.name }}</p>
          <v-divider></v-divider>
          <template v-slot:append>
            <v-btn icon="mdi-delete" variant="text" @click="deleteFile(document.signed_id)"></v-btn>
          </template>
        </v-list-item>
      </template>
      <template v-else>
        <v-list-item
          v-for="(document, index) in offlineDocuments.filter((doc) => doc.tag === 'insurance')"
          :key="index"
          :title="document.documentname"
          item-props
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
          <p>{{ document.documentname }}</p>
          <v-divider></v-divider>
          <template v-slot:append>
            <v-btn icon="mdi-delete" variant="text" @click="deleteOfflineFile('insurance', index)"></v-btn>
          </template>
        </v-list-item>
      </template>
    </v-list>
    <v-list class="mt-5" v-else>
      <template v-if="itemId">
        <v-list-item
          v-for="document in item.sanitized_documents.filter((doc) => doc.tag !== 'insurance')"
          :key="document.id"
          :title="document.title"
          item-props
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
          <p>{{ document.name }}</p>
          <v-divider></v-divider>
          <template v-slot:append>
            <v-btn icon="mdi-delete" variant="text" @click="deleteFile(document.signed_id)"></v-btn>
          </template>
        </v-list-item>
      </template>
      <template v-else>
        <v-list-item
          v-for="(document, index) in offlineDocuments.filter((doc) => doc.tag !== 'insurance')"
          :key="index"
          :title="document.documentname"
          item-props
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
          <p>{{ document.documentname }}</p>
          <v-divider></v-divider>
          <template v-slot:append>
            <v-btn icon="mdi-delete" variant="text" @click="deleteOfflineFile('documents', index)"></v-btn>
          </template>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts" setup>
import { ResultStatus } from "@/types/serverCallResult";
import { CreateEditFacility } from "~/types/facilities";

const emit = defineEmits<{
  (event: "offline", docs: CreateEditFacility["offlineDocuments"]): void;
}>();

const props = defineProps<{
  itemId: string;
  tagName: "documents" | "insurance";

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

const errorFileSizeTooLarge = ref(false);
const item = ref({
  sanitized_documents: [],
});

const handleFile = async () => {
  if (file.value && file.value[0] && file.value[0].size / 1000000 > 5) {
    errorFileSizeTooLarge.value = true;
    file.value = {};
    return;
  } else if (file.value && file.value[0]) {
    const selectedFile = file.value[0];
    errorFileSizeTooLarge.value = false;
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    if (fileExtension !== "pdf") {
      errorInvalidFileType.value = true;
      file.value = {};
      return;
    } else {
      errorInvalidFileType.value = false;
      fileUrl.value = await getBase64File();
    }
  }
};

const getBase64File = async () => {
  const data = await file.value[0].arrayBuffer();
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
  loadingItem.value = false;
  item.value = api.item.value;
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

  emit("offline", [
    ...props.offlineDocuments,
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
  } else {
    errors.value = result.data;
    loadingItem.value = false;
  }
};

const deleteOfflineFile = async (tag: typeof props.tagName, docIndex: number) => {
  const relevantDocs = props.offlineDocuments.filter((doc) => doc.tag === tag);
  const otherDocs = props.offlineDocuments.filter((doc) => doc.tag !== tag);

  relevantDocs.splice(docIndex, 1);

  emit("offline", [...relevantDocs, ...otherDocs]);
};

const handleMount = () => {
  if (props.itemId) {
    getCareFacility();
    return;
  }

  console.log("We offline");
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
