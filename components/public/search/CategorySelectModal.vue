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
            <div class="search-term">
              Branche
            </div>
          </label>
          <div class="field" v-bind="props" @click="handleClearTermSearch()">
            <div class="input">{{ selectedFilter?.name || placeholderText }}</div>
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
              <div class="filter-name">
                {{ filter.name }}
              </div>
              <div class="filter-options">
                <label
                  class="option"
                  v-for="option in filterOptions.find(
                    ({ parentId }) => parentId === filter.id
                  ).options"
                >
                  <v-radio
                    :model-value="modelValue.includes(option.id)"
                    @click.prevent="handleOptionSelect(option)"
                    hide-details
                    density="compact"
                    :label="option.name"
                    color="#8AB61D"
                  />
                </label>
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
import { FilterKind, useFilterStore } from "~/store/searchFilter";

const props = defineProps<{
  modelValue: string[];
  filterKind: FilterKind;
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

type Filter = { id: string; name: string; parent_id?: string };
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
  if(filterStore.currentSearchTerm) {
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

const placeholderText = ref("Laden...");
const setPlaceholderText = () => {
  if (props.filterKind === "facility") {
    placeholderText.value = "Branche wählen";
  } else if (props.filterKind === "course") {
    placeholderText.value = "Themengebiet wählen";
  }
};

onMounted(async () => {
  setPlaceholderText();
  loadingFilters.value = true;
  mainFilters.value = await getMainFilters("filter_facility", props.filterKind);
  const allFilters = await getAllFilters();

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

      .option {
        border: 1px solid black;
        border-radius: 0.5rem;
        padding: 0.25rem 0.5rem;
        display: flex;
        gap: 1rem;
      }
    }
  }
}
</style>
