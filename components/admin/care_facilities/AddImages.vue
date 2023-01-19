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
        Bilder hinzufügen
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col v-for="(image, index) in item.sanitized_images" :key="index" md="4">
            <v-card>
              <v-img
                :lazy-src="image.url"
                :src="image.url"
              />
              <div @click="deleteImage(image.signed_id)" class="text-error ml-1 mt-1 is-clickable">Bild löschen</div>
            </v-card>
          </v-col>
        </v-row>
        
        <div class="field mt-3">
          <v-file-input
            :disabled="item.sanitized_images.length >= 6"
            hide-details="auto"
            v-model="image"
            label="Neues Bild wählen"
            filled
            prepend-icon="mdi-camera"
            @change="handleFile()"
          />
          <div class="text-error" v-if="item.sanitized_images.length >= 6">Es können maximal 6 Bilder hinzugefügt werden</div>
          <div v-if="errorFileSizeTooLarge" class="text-error mt-3">Das gewählte Bild ist zu groß. Es darf eine Größe von 5MB nicht überschreiten.</div>
        </div>
        <ImageCropper
          v-if="imgUrl"
          :imgUrl="imgUrl"
          cta="Bild speichern"
          @close="imgUrl = null; image = {}"
          @crop="setImage"
        />
        <div class="img-container" v-else-if="item.file">
          <v-img :src="item.file" />
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