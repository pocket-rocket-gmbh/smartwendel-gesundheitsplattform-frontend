<template>
  <v-dialog
    v-model="dialog"
    :width="size"
    transition="dialog-bottom-transition"
    @click:outside="emitClose()"
    persistent
  >
    <v-card :class="`dialog-${size}`" :height="`${height}`">
      <v-form ref="form">
        <v-card-title class="text-h5 has-bg-primary py-5 text-white">
          <span v-if="itemId">{{ conceptName }} bearbeiten</span>
          <span v-else>{{ conceptName }} erstellen</span>
        </v-card-title>

        <slot :item="item" :errors="errors" />

        <v-card-actions class="card-actions">
          <v-btn @click="emitClose()"> Schließen </v-btn>
          <v-btn color="blue darken-1" variant="outlined" dark @click="handleCta()" :loading="loadingItem">
            Speichern
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { ResultStatus } from '@/types/serverCallResult'
import { useAdminStore } from '~/store/admin'

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
    const form = ref()

    const snackbar = useSnackbar();
    const adminStore = useAdminStore();

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

    const handleCta = async () => {
      const { valid } = await form.value.validate();

      if (!valid) {
        const formErrors = await form.value.errors;
        errors.value = formErrors.map(err => err.errorMessages[0]);
        snackbar.showError("Speichern fehlgeschlagen! Es gibt ungültige Felder!")
        return;
      }
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
      adminStore.loading = true;
      const result = await createUpdateApi.createItem(item.value, `Erfolgreich erstellt`)
      adminStore.loading = false;
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
      adminStore.loading = true;
      const result = await createUpdateApi.updateItem(item.value, 'Erfolgreich aktualisiert')
      adminStore.loading = false;
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

      document.addEventListener('keyup', function(e) {
        if (e.key === 'Escape') {
          const confirmed = confirm('Wenn Sie fortfahren, werden Ihre Änderungen verworfen.')
          if (confirmed) {
            emit('close')
          }
        }
      })
    })

    const emitClose = () => {
      const confirmed = confirm('Wenn Sie fortfahren, werden Ihre Änderungen verworfen.')
      if (confirmed) {
        emit('close')
      }
    }

    return {
      loadingItem,
      dialog,
      item,
      handleCta,
      emitClose,
      errors,
      setLogo,
      form
    }
  }
})
</script>