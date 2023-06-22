<template>
  <div v-if="!edit" v-html="refinedData"></div>
  <v-textarea
    v-else
    v-model="refinedData"
    hide-details="auto"
    label="Beschreibung"
    :rules="[(v) => (v || '').length <= 160 || 'Die Beschreibung darf höchstens 160 Zeichen lang sein.']"
    @update:model-value="handleModelChange"
    @click.stop
  />
</template>

<script setup lang="ts">
import { CollapsibleListItemAdditionalData } from "~/types/collapsibleList";

const props = defineProps<{
  data: CollapsibleListItemAdditionalData;
  edit?: boolean;
  modelValue?: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const refinedData = ref();

const handleModelChange = () => {
  emit("update:modelValue", refinedData.value);
};

const getAdditionalData = async () => {
  if (!props.data || props.data.type !== "api") return "nothing";

  const api = useCollectionApi();
  api.setBaseApi(usePrivateApi());
  api.setEndpoint(props.data.endpoint);

  const options = {
    page: 1,
    per_page: 999,
    sort_by: "menu_order",
    sort_order: "asc",
    searchQuery: null as any,
    concat: false,
    filters: [] as any,
  };

  const { data } = await api.retrieveCollection(options);

  const result = pathInto(data, props.data.path);

  refinedData.value = result === props.data.path ? "" : result;
};

onMounted(() => {
  getAdditionalData();
});
</script>

<style lang="scss" scoped></style>
