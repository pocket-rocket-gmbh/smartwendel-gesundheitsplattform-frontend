<template>
  <div v-if="!edit" class="break-title" v-html="refinedData"></div>
  <template v-else>
    <v-text-field
      @click.stop
      v-if="data.type === 'raw'"
      v-model="refinedData"
      hide-details="auto"
      label="Zusatzangaben"
    />
    <v-textarea
      v-else
      v-model="refinedData"
      hide-details="auto"
      label="Beschreibung"
      @update:model-value="handleModelChange"
      @click.stop
    />
  </template>
</template>

<script setup lang="ts">
import type { CollapsibleListItemAdditionalData } from "~/types/collapsibleList";

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
  if (!props.data) return;

  if (props.data.type === "raw") {
    refinedData.value = props.data.value;

    return;
  }

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

watch(
  () => props.data,
  () => {
    getAdditionalData();
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.sass";
</style>
