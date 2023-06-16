<template>
 <v-select
    variant="underlined"
    hide-details="auto"
    v-model="item.status"
    :items="ItemStatus"
    item-title="name"
    item-value="id"
    label="Status"
    single-line
    
  />
</template>
<script lang="ts">
import SendNotification from '@/components/SendNotification.vue'
export default defineComponent({
  components: { SendNotification },
  props: {
    item: Object,
    endpoint: String,
    fieldToSwitch: String,
  },
  setup (props) {
    const switchValue = ref(props.item[props.fieldToSwitch])
    const updateApi = useCollectionApi()
    updateApi.setBaseApi(usePrivateApi())
    const sendNotificationDialogOpen = ref(false)

    onMounted(() => {
      switchValue.value = props.item[props.fieldToSwitch]
    })

    const ItemStatus = ref([
      { name: 'In Prüfung', id: 'is_checked'},
      { name: 'Freigegeben', id: 'confirmed'},
      { name: 'Abgelehnt', id: 'rejected'}
    ])

    const save = async () => {
      updateApi.setEndpoint(`${props.endpoint}/${props.item.id}`)
      let data = {}
      data[props.fieldToSwitch] = switchValue.value

      await updateApi.updateItem(data, null)
    }

    return {
      switchValue,
      sendNotificationDialogOpen,
      save,
      ItemStatus
    }
  }
})
</script>
