<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ props }">
        <div class="field">
          <label class="label is-white">
            <div class="search-term">{{ filterTitle }}</div>
          </label>
          <div class="field" v-bind="props" @click="handleClearTermSearch()">
            <div class="input">
              {{ selectedFilter?.name || placeholderText }}
            </div>
          </div>
        </div>
      </template>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Filter</v-toolbar-title>
          <v-btn variant="text" @click="dialog = false"> Schließen </v-btn>
        </v-toolbar>
        <div class="all-filters">
          <div v-if="!loadingFilters" class="filters">
            <div v-for="filter in mainFilters" :key="filter.id">
              <div v-if="hasActiveOptions(filter.id)" class="filter-name ml-2">
                {{ filter.name }}
              </div>
              <div class="filter-options">
                <label
                  class="option ma-n1"
                  v-for="option in filterOptions.find(
                    ({ parentId }) => parentId === filter.id
                  ).options"
                >
                <div v-if="option?.care_facilities_count > '0'">
                  <v-btn
                    :model-value="modelValue.includes(option.id)"
                    @click.prevent="
                      handleOptionSelect(option);
                      dialog = false;
                    "
                    hide-details
                    density="compact"
                    class="options-select general-font-size ma-2 text-none font-weight-light"
                    :class="{
                      'is-selected': selectedFilter?.id === option.id,
                    }"
                  >
                    {{ option.name }}
                  </v-btn>
                </div>
                </label>
                <v-divider v-if="hasActiveOptions(filter.id)" class="my-2"></v-divider>
              </div>
            </div>
          </div>
          <LoadingSpinner v-else> Filter werden geladen ... </LoadingSpinner>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import { type FilterKind, useFilterStore } from "~/store/searchFilter";

const props = defineProps<{
  modelValue: string[];
  filterKind: FilterKind;
  filterTitle: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", values: string[]): void;
}>();

watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue.length) {
      selectedFilter.value = null;
    }
  }
);

type Filter = {
  id: string;
  name: string;
  parent_id?: string;
  care_facilities_count: string;
  care_facilities_active_count: string;
};
type FilterOption = {
  parentId: string;
  options: Filter[];
};

const dialog = ref(false);

const filterStore = useFilterStore();
const loadingFilters = ref(false);
const mainFilters = ref([]);
const filterOptions = ref<FilterOption[]>([]);
const selectedFilter = ref<Filter>();

const handleClearTermSearch = () => {
  if (filterStore.currentSearchTerm) {
    filterStore.clearTermSearch();
  }
  return;
};

const handleOptionSelect = (option: Filter) => {
  if (selectedFilter.value && selectedFilter.value.id !== option.id) {
    const indexOfAlreadySetFilter = props.modelValue.findIndex(
      (item) => item === selectedFilter.value.id
    );

    if (indexOfAlreadySetFilter !== -1) {
      props.modelValue.splice(indexOfAlreadySetFilter, 1);
    }
  }

  const previousIndex = props.modelValue.findIndex(
    (item) => item === option.id
  );

  if (previousIndex !== -1) {
    props.modelValue.splice(previousIndex, 1);
    selectedFilter.value = null;
  } else if (option) {
    props.modelValue.push(option.id);
    selectedFilter.value = option;
  }

  emit("update:modelValue", props.modelValue);
};

const hasActiveOptions = (filterId:string) => {
  const options = filterOptions.value.find(({ parentId }) => parentId === filterId)?.options;
  return options && options.some(option => (option?.care_facilities_active_count) > '0');
};


const placeholderText = ref("Laden...");
const setPlaceholderText = () => {
  if (props.filterKind === "facility") {
    placeholderText.value = "Branche wählen";
  }
};

onMounted(async () => {
  setPlaceholderText();
  loadingFilters.value = true;
  mainFilters.value = await getMainFilters("filter_facility", props.filterKind);
  const allFilters = await filterStore.loadAllFilters();

  const allOptions = mainFilters.value.map((filter) =>
    allFilters.filter((item) => item.parent_id === filter.id)
  );

  allOptions.forEach((options, index) => {
    filterOptions.value.push({
      parentId: mainFilters.value[index].id,
      options,
    });
  });
  loadingFilters.value = false;

  const allAvailableOptions = filterOptions.value.reduce((prev, curr) => {
    return [...prev, ...curr.options];
  }, [] as Filter[]);

  const foundFilter = allAvailableOptions.find((option) => {
    const doesInclude = props.modelValue.find(
      (item: string) => item === option.id
    );
    return doesInclude;
  });

  selectedFilter.value = foundFilter;
});
</script>

<style lang="scss">
@import "@/assets/sass/main.sass";

.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}

.all-filters {
  padding: 0.5rem;

  .filters {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .filter-options {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;

      .option-label {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }
  }
}
.filter-name {
  font-size: 1.4rem;
  margin-bottom: 0.75rem;
  color: red;
}

.options-select {
  gap: 0.5rem;
  min-height: 3rem;
}
.is-selected {
  background-color: #8ab61d !important;
  color: white !important;
}
</style>
