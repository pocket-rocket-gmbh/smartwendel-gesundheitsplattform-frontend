<template>
  <v-select
    v-if="!disableEdit"
    class="table-dropdown"
    :class="selectedFieldClass"
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
  <div v-else :class="selectedFieldClass">
    {{ selectedEnum.find((item) => item.value === model)?.name || model }}
  </div>
</template>
<script lang="ts" setup>
import { type Enums, useEnums } from "@/composables/data/enums";

const snackbar = useSnackbar();

const props = defineProps<{
  item: any;
  endpoint: string;
  fieldName: string;
  enumName: keyof Enums;
  fieldClass: string;
  disableEdit?: boolean;
}>();

const enums = useEnums();
const selectedEnum = enums.getEnum(props.enumName);
const selectedFieldClass = ref("");

const model = ref(null);
const updateApi = useCollectionApi();
updateApi.setBaseApi(usePrivateApi());

onMounted(() => {
  model.value = props.item[props.fieldName];
  selectedFieldClass.value = props.fieldClass;
});

const save = async () => {
  updateApi.setEndpoint(`${props.endpoint}/${props.item.id}`);
  let data: any = {};
  data[props.fieldName] = model.value;
  snackbar.showSuccess("Nutzer wurde aktualisiert.");
  await updateApi.updateItem(data, null);

  selectedFieldClass.value = useEnums().getClassName(props.enumName, model.value);
};
</script>

<style lang="sass" scoped>
.table-dropdown
  width: 50%
</style>
