<template>
  <v-dialog
    v-model="dialog"
    width="500"
    transition="dialog-bottom-transition"
    @click:outside="emitClose()"
  >
    <v-card class="dialog-500">
      <v-card-title class="text-h5">
        {{ conceptName }}
      </v-card-title>
      
      <slot :item="item" :errors="errors" />

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
    itemId: String,
    endpoint: String,
    conceptName: String
  },
  setup (props, { emit }) {
    const loadingItem = ref(false)
    const dialog = ref(true)
    const errors = ref([])
    const item = ref({})

    const showApi = useCollectionApi()
    showApi.setBaseApi(usePrivateApi())

    const createUpdateApi = useCollectionApi()
    createUpdateApi.setBaseApi(usePrivateApi())

    const getItem = async () => {
      showApi.setEndpoint(`${props.endpoint}/${props.itemId}`)

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
      createUpdateApi.setEndpoint(`${props.endpoint}`)
      loadingItem.value = true
      const result = await createUpdateApi.createItem(item.value, `Erfolgreich erstellt`)
      loadingItem.value = false
      if (result.status === ResultStatus.SUCCESSFUL) {
        useNuxtApp().$bus.$emit('triggerGetItems', null)
        emit('close')
      } else {
        errors.value = result.data
      }
    }

    const save = async () => {
      createUpdateApi.setEndpoint(`${props.endpoint}/${props.itemId}`)
      loadingItem.value = true
      const result = await createUpdateApi.updateItem(item.value, 'Erfolgreich aktualisiert')
      loadingItem.value = false
      if (result.status === ResultStatus.SUCCESSFUL) {
        useNuxtApp().$bus.$emit('triggerGetItems', null)
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
      errors
    }
  }
})
</script>