<template>
  <div>
    <v-checkbox
      class="mb-n10"
      v-for="(tag, index) in limitedTags"
      :key="tag.id"
      :label="tag.name"
      v-model="filterStore.currentTags"
      :value="tag.id"
    />
  </div>
  <v-btn class="my-5" variant="outlined" size="small" rounded="pill" @click="showMoreTags()" v-if="showMoreButton">
    <span> ... mehr laden </span>
  </v-btn>
</template>

<script setup lang="ts">
import { useFilterStore } from "~/store/facilitySearchFilter";

const filterStore = useFilterStore();
const api = useCollectionApi();

const availableTags = ref([]);

const maxTagsToShow = ref(5);
const showMoreButton = ref(true);

const limitedTags = computed(() => {
  return availableTags.value.slice(0, maxTagsToShow.value);
});

const showMoreTags = () => {
  maxTagsToShow.value += 5;
  if (maxTagsToShow.value >= availableTags.value.length) {
    showMoreButton.value = false;
  }
};

const getTags = async () => {
  const options = {
    page: 1,
    per_page: 25,
    sort_by: "menu_order",
    sort_order: "ASC",
    searchQuery: null as any,
    concat: false,
    filters: null as any,
  };

  api.setBaseApi(usePublicApi());
  api.setEndpoint(`tags?scope=care_facility`);

  await api.retrieveCollection(options as any);

  availableTags.value = api.items.value;
};

onMounted(() => {
  getTags();
});

watch(
  () => filterStore.currentTags,
  () => {
    filterStore.loadCareFacilities();
  }
);
</script>

<style lang="sass" scoped></style>
