<template>
  <v-dialog
    v-model="dialog"
    :width="size"
    transition="dialog-bottom-transition"
    @click:outside="emitClose()"
  >
    <v-card :class="`dialog-${size}`" :height="`${height}`">
      <v-card-title class="text-h5 has-bg-primary py-5 text-white">
        <span v-if="itemId">{{ conceptName }} bearbeiten</span>
        <span v-else>{{ conceptName }} erstellen</span>
      </v-card-title>
      
      <slot :item="item" :errors="errors" />
      <v-card-actions class="card-actions">
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
    itemId: {
      type: String
    },
    endpoint: {
      type: String,
      required: true
    },
    conceptName: {
      type: String
    },
    size: {
      type: Number,
      default: 500
    },
    height: {
      type: Number,
    },
    itemPlaceholder: {
      type: Object
    },
    overwriteGetItemEndpoint: {
      type: String
    },
    overwriteUpdateItemEndpoint: {
      type: String
    }
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

      let endpoint = `${props.endpoint}/${props.itemId}`
      if (props.overwriteGetItemEndpoint) {
        endpoint = props.overwriteGetItemEndpoint
      }

      showApi.setEndpoint(endpoint)

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
    const setLogo = (image) => {
      useNuxtApp().$bus.$emit('setPayloadFromSlotChild', { name: 'logo', value: image })
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
      let endpoint = `${props.endpoint}/${props.itemId}`
      if (props.overwriteUpdateItemEndpoint) {
        endpoint = props.overwriteUpdateItemEndpoint
      }

      createUpdateApi.setEndpoint(endpoint)
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

    useNuxtApp().$bus.$on("setPayloadFromSlotChild", (payload) => {
      item.value[payload.name] = payload.value
    })

    onMounted(() => {
      if (props.itemId) {
        getItem()
      }
      if (props.itemPlaceholder && !item.value.id) {
        item.value = props.itemPlaceholder
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
      setLogo
    }
  }
})
</script>