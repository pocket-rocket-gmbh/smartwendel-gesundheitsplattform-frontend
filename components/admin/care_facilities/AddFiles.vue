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
          
              <b>Downloads</b> (Laden Sie Dokumente wie bspw. Transparenzberichte, Jobangebote oder Formulare hoch. Bitte hinterlegen Sie zu jedem Dokument einen Titel und eine kurze Beschreibung)
                <div class="field split">
                <v-text-field
                
                  hide-details="auto"
                  label="Titel*"
                
                />
                <v-text-field
                
                  hide-details="auto"
                  label="Beschreibung (max. 120 Zeichen)"
                 
                />
              </div>
              <div class="field">
                <v-file-input clearable label="Datei Hochladen"></v-file-input>
              </div>
              <div>
                <v-icon>mdi-plus</v-icon>
                <span class="is-clickable">Weitere Downloads</span>
              </div>
            
          </div>
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

<script lang="ts">
import { ResultStatus } from '@/types/serverCallResult'

export default defineComponent({
  emits: ['close'],
  props: {
    itemId: String
  },
  setup (props, { emit }) {
    const loadingItem = ref(false)
    const imgUrl = ref(null)
    const dialog = ref(true)
    const errors = ref([])
    const image = ref({})
    const errorFileSizeTooLarge = ref(false)
    const item = ref({
      sanitized_images: [],
      file: ''
    })

    const emitClose = () => {
      emit('close')
    }

    const setImage = (image:any) => {
      imgUrl.value = null
      item.value.file = image
      save()
    }

    const toBase64 = (file:any) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

    const handleFile = async () => {
      if (image && image.value[0] && image.value[0].size / 1000000 > 5) {
        errorFileSizeTooLarge.value = true
        image.value = {}
        return
      } else if (image && image.value[0]) {
        errorFileSizeTooLarge.value = false
        imgUrl.value = await toBase64(image.value[0])
      }
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
      api.setEndpoint(`care_facilities/${props.itemId}/images`)
      loadingItem.value = true

      const data = {
        file: item.value.file
      }

      const result = await api.createItem(data, 'Bild erfolgreich hinzugefügt')
      imgUrl.value = null
      
      if (result.status === ResultStatus.SUCCESSFUL) {
        loadingItem.value = false
        item.value.file = ''
        getCareFacility()
      } else {
        errors.value = result.data
        loadingItem.value = false
        item.value.file = ''
      }
    }

    const deleteImage = async (signedId:string) => {
      api.setEndpoint(`care_facilities/${props.itemId}/images/${signedId}`)
      loadingItem.value = true
      const result = await api.deleteItem('Bild erfolgreich gelöscht')
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

    return {
      emitClose,
      dialog,
      loadingItem,
      errors,
      save,
      handleFile,
      setImage,
      imgUrl,
      item,
      image,
      getCareFacility,
      deleteImage,
      errorFileSizeTooLarge
    }
  }
})
</script>
<style lang="sass">
.close
  position: absolute
  top: -10px
  right: -10px
  cursor: pointer
</style>