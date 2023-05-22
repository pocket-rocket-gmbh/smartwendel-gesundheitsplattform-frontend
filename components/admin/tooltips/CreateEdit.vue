<template>
  <v-dialog
    v-model="dialog"
    width="500"
    transition="dialog-bottom-transition"
    @click:outside="emitClose()"
  >
    <v-card class="dialog-500">
      <v-card-title class="text-h5">
        Tooltip
      </v-card-title>
      <v-card-text>
        <div class="field">
          <v-text-field
            v-model="item.name"
            hide-details="auto"
            label="Name"
            :error-messages="useErrors().checkAndMapErrors('name', errors)"
          />
        </div>
        <div class="field">
          <v-text-field
            v-model="item.content"
            hide-details="auto"
            label="Inhalt"
          />
        </div>
        <div>
          <v-switch
            color="primary"
            v-model="tooltipHasLink"
            label="Link ?"
          />
        </div>
        <div class="field" v-if="tooltipHasLink">
          <v-text-field
            v-model="item.url"
            hide-details="auto"
            label="Link"
          />
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
        <v-btn
          color="blue darken-1"
          variant="outlined"
          dark
          text
          @click="handleCta()"
          :loading="loadingItem"
        >
          Speichern
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ResultStatus } from '@/types/serverCallResult'
export default defineComponent({
  emits: ['close'],
  props: {
    itemId: String
  },
  setup (props, { emit }) {
    const loadingItem = ref(false)
    const dialog = ref(true)
    const errors = ref([])
    const item = ref({
      name: ''
    })

    const tooltipHasLink =  ref(false)

    const showApi = useCollectionApi()
    showApi.setBaseApi(usePrivateApi())

    const createUpdateApi = useCollectionApi()
    createUpdateApi.setBaseApi(usePrivateApi())

    const getItem = async () => {
      showApi.setEndpoint(`tooltips/${props.itemId}`)
      loadingItem.value = true
      await showApi.getItem()
      loadingItem.value = false
      item.value = showApi.item.value
    }

    const handleCta = () => {
      if (props.itemId) {
        save()
      } else {
        create()
      }
    }

    const create = async () => {
      createUpdateApi.setEndpoint(`tooltips`)
      loadingItem.value = true
      const result = await createUpdateApi.createItem(item.value, 'Tooltip erfolgreich erstellt')
      loadingItem.value = false
      if (result.status === ResultStatus.SUCCESSFUL) {
        emit('refreshCollection')
        emit('close')
      } else {
        errors.value = result.data
      }
    }

    const save = async () => {
      createUpdateApi.setEndpoint(`tooltips/${props.itemId}`)
      loadingItem.value = true
      const result = await createUpdateApi.updateItem(item.value, 'Tooltip erfolgreich aktualisiert')
      loadingItem.value = false
      if (result.status === ResultStatus.SUCCESSFUL) {
        emit('refreshCollection')
        emit('close')
      } else {
        errors.value = result.data
      }
    }

    onMounted(() => {
      if (props.itemId) {
        getItem()
      }
    })
    
    const emitClose = () => {
      emit('close')
    }

    return {
      loadingItem,
      dialog,
      item,
      handleCta,
      emitClose,
      errors,
      tooltipHasLink,
    }
  }
})
</script>

<style>

</style>