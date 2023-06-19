<template>
 <v-select
    class="table-dropdown"
    variant="underlined"
    hide-details="auto"
    v-model="model"
    :items="selectedEnum"
    item-title="name"
    item-value="value"
    label="Status"
    single-line
    @update:model-value="save"
  />
</template>
<script lang="ts" setup>
import { useEnums } from '@/composables/data/enums'

const props = defineProps({ 
  item: Object,
  endpoint: String,
  fieldName: String,
  enumName: String
})

const enums = useEnums();
const selectedEnum = enums[props.enumName];

const model = ref(null)
const value = ref(props.item[props.fieldName])
const updateApi = useCollectionApi()
updateApi.setBaseApi(usePrivateApi())

onMounted(() => {
  model.value = props.item[props.fieldName]
})

const save = async () => {
  updateApi.setEndpoint(`${props.endpoint}/${props.item.id}`)
  let data = {}
  data[props.fieldName] = model.value

  await updateApi.updateItem(data, null)
}
</script>

<style lang="sass" scoped>
.table-dropdown
  width: 50%
</style>
