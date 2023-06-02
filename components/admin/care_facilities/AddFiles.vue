<template>
  <v-dialog
    v-model="dialog"
    width="500"
    transition="dialog-bottom-transition"
    @click:outside="emitClose()"
  > 
    <Loading v-if="loadingItem" />
    <v-card class="dialog-500">
      <v-card-title class="text-h5">
        Datei hinzufügen
      </v-card-title>
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
        </div>
        <v-btn
          @click="save"
          :disabled="filename === ''"
        >
          Hochladen
        </v-btn>

        {{ item.sanitized_documents }}
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          text
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
    errorFileSizeTooLarge.value = false
    fileUrl.value = await getBase64File()
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
    getCareFacility()
  } else {
    errors.value = result.data
    loadingItem.value = false
  }
}

const deleteImage = async (signedId:string) => {
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