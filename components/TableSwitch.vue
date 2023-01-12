<template>
  <SendNotification
    v-if="askNotification && sendNotificationDialogOpen"
    :kind="notificationKind"
    :notification-kind-explicit="notificationKindExplicit"
    :notification-pre-filled-headline="notificationPreFilledHeadline"
    :notification-pre-filled-text="notificationPreFilledText"
    :notification-cta-link="notificationCtaLink"
    :item-name="item.name"
    :item-id="item.id"
    @close="sendNotificationDialogOpen = false"
  />
  <v-switch
    v-model="switchValue"
    color="success"
    hide-details
  ></v-switch>
</template>
<script lang="ts">
import SendNotification from '@/components/SendNotification.vue'
export default defineComponent({
  components: { SendNotification },
  props: {
    item: Object,
    endpoint: String,
    fieldToSwitch: String,
    askNotification: Boolean,
    notificationKind: String,
    notificationKindExplicit: String,
    notificationPreFilledHeadline: String,
    notificationPreFilledText: String,
    notificationCtaLink: String
  },
  setup (props) {
    const switchValue = ref(props.item[props.fieldToSwitch])
    const updateApi = useCollectionApi()
    updateApi.setBaseApi(usePrivateApi())
    const sendNotificationDialogOpen = ref(false)

    onMounted(() => {
      switchValue.value = props.item[props.fieldToSwitch]
    })

    const save = async () => {
      updateApi.setEndpoint(`${props.endpoint}/${props.item.id}`)
      let data = {}
      data[props.fieldToSwitch] = switchValue.value

      await updateApi.updateItem(data, null)
    }

    watch(switchValue, () => {
      save()
      if (props.askNotification && switchValue.value === true) {
        sendNotificationDialogOpen.value = true
      }
    })

    return {
      switchValue,
      sendNotificationDialogOpen,
      save
    }
  }
})
</script>
