<template>
  <v-dialog
    v-model="dialog"
    width="900"
    transition="dialog-bottom-transition"
    @click:outside="emitClose()"
  > 
    <Loading v-if="loadingItem" />
    <v-card class="dialog-900" height="900">
      <v-card-title class="text-h5">
        Datei hinzufügen
      </v-card-title>
      <v-list>
      <v-list-item
        v-for="document in item.sanitized_documents"
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
            density="compact" icon="mdi-file-pdf-box"
            >
          </v-btn>
        </template>
          <p>{{ document.name }}</p>
          <v-divider></v-divider>
        <template v-slot:append>
          <v-btn
            color="red"
            icon="mdi-delete"
            variant="text"
            @click="deleteFile(document.signed_id)"
          ></v-btn>
        </template>
      </v-list-item>
    </v-list>
      <v-card-text>
        <div class="field mb-15">
          <b>Downloads</b> (Laden Sie Dokumente wie bspw. Transparenzberichte, Jobangebote oder Formulare hoch. Bitte hinterlegen Sie zu jedem Dokument einen Titel)
          <div class="field">
            <v-text-field
              hide-details="auto"
              label="Name*"
              v-model="filename"
            />
          </div>
          <div class="field">
            <v-file-input clearable label="Datei auswählen" v-model="file" @change="handleFile"></v-file-input>
          </div>
          <div class="errors">
            <div v-if="errorInvalidFileType">
              <span class="warning">
                <v-alert type="error" density="compact" closable class="mt-2">nur (.pdf) Dateien sind erlaubt</v-alert>
              </span>
            </div>
            <div v-if="errorFileSizeTooLarge">
              <v-alert type="warning" density="compact" closable class="mt-2">die ausgewählte Datei ist zu groß, es sind nur Dateien von maximal 5 MB erlaubt</v-alert>
            </div>
          </div>
        </div>
        <v-btn
          @click="save"
          v-if="!loadingItem"
          :disabled="filename === '' && !errorInvalidFileType && !errorFileSizeTooLarge && file"
        >
          Hochladen
        </v-btn>
        <span class="mr-3 is-red" v-if="loadingItem">wird hochgeladen ....</span>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          @click="emitClose()"
        >
          Schließen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ResultStatus } from '@/types/serverCallResult'
const emit = defineEmits(['close'])
const props = defineProps({
  itemId: String
})

const file = ref({}) as any
const filename = ref('')
const errorInvalidFileType = ref(false)
const loadingItem = ref(false)
const fileUrl = ref(null)
const dialog = ref(true)
const errors = ref([])

const errorFileSizeTooLarge = ref(false)
const item = ref({
  sanitized_documents: []
})

const emitClose = () => {
  emit('close')
}

const handleFile = async () => {
  if (file.value && file.value[0] && file.value[0].size / 1000000 > 5) {
    errorFileSizeTooLarge.value = true
    file.value = {}
    return
  } else if (file.value && file.value[0]) {
    const selectedFile = file.value[0]
    errorFileSizeTooLarge.value = false
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase()
    if (fileExtension !== "pdf") {
      errorInvalidFileType.value = true
      file.value = {}
      return
    } else {
      errorInvalidFileType.value = false
      fileUrl.value = await getBase64File()
    }
  }
}

const getBase64File = async () => {
  const data = await file.value[0].arrayBuffer()
  const base64 = arrayBufferToBase64(data, 'application/octet')
  return base64
}

const arrayBufferToBase64 = (buffer:any, mimetype:string) => {
  let binary = ''
  let bytes = new Uint8Array(buffer)
  let length = bytes.byteLength

  for (let i=0; i<length; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  return `data:${mimetype};base64,${window.btoa(binary)}`
}

const api = useCollectionApi()
api.setBaseApi(usePrivateApi())

const getCareFacility = async () => {
  api.setEndpoint(`care_facilities/${props.itemId}`)
  loadingItem.value = true
  await api.getItem()
  loadingItem.value = false
  item.value = api.item.value
}

const save = async () => {
  api.setEndpoint(`care_facilities/${props.itemId}/documents`)
  loadingItem.value = true
  const data = {
    document: fileUrl.value,
    documentname: filename.value
  }
  const result = await api.createItem(data, 'Dokument erfolgreich hinzugefügt')
  fileUrl.value = null
  if (result.status === ResultStatus.SUCCESSFUL) {
    loadingItem.value = false
    filename.value = ''
    file.value = {}
    getCareFacility()
  } else {
    errors.value = result.data
    loadingItem.value = false
  }
}

const deleteFile = async (signedId:string) => {
  api.setEndpoint(`care_facilities/${props.itemId}/documents/${signedId}`)
  loadingItem.value = true
  const result = await api.deleteItem('Dokument erfolgreich gelöscht')
  if (result.status === ResultStatus.SUCCESSFUL) {
    loadingItem.value = false
    getCareFacility()
  } else {
    errors.value = result.data
    loadingItem.value = false
  }
}

onMounted(() => {
  getCareFacility()
})
</script>
<style lang="sass">
.close
  position: absolute
  top: -10px
  right: -10px
  cursor: pointer
</style>