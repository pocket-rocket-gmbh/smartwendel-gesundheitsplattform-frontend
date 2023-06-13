<template>
  <div :class="['field select', color]">
    <label class="label" v-if="label">{{ label }}</label>
    <select @change="setSelectValue" v-model="selected" :disabled="disabled">
      <option value="">Bitte wählen</option>
      <option v-for="item in items" :key="item.id" :value="item.id">{{ item.name }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { CategoriesFilter, useFilterStore } from "~/store/facilitySearchFilter";

const props = defineProps<{
  label: string;
  endpoint: string;
  filterName: CategoriesFilter;
  preSelectedValue?: string;
  color?: string;
  disabled?: boolean;
}>();

const filterStore = useFilterStore();

const selected = ref("");
const items = ref([]);

const setSelectValue = (e: Event) => {
  filterStore.updateCategoriesFilter(props.filterName, (e.target as HTMLSelectElement).value);
};

const getItems = async () => {
  const api = useCollectionApi();
  api.setBaseApi(usePublicApi());
  api.setEndpoint(props.endpoint);

  const options = {
    page: 1,
    per_page: 25,
    sort_by: "name",
    sort_order: "asc",
    searchQuery: null as any,
    concat: false,
    filters: [] as any[],
  };
  await api.retrieveCollection(options);
  items.value = api.items.value as any;
};

onMounted(async () => {
  if (!props.disabled) {
    await getItems();
  }

  // pre set values
  if (props.filterName === "category" && filterStore.currentCategoryId) {
    selected.value = useFilterStore().currentCategoryId;
  }

  if (props.filterName === "subCategory" && useFilterStore().currentSubCategoryId) {
    selected.value = useFilterStore().currentSubCategoryId;
  }
});
</script>

<style lang="sass" scoped></style>
