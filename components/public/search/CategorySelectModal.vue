<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-toolbar dense fixed dark color="primary" style="position: stiky">
        <v-toolbar-title>Branche auswählen</v-toolbar-title>
        <v-btn variant="text" @click="dialog = false"> Fertig </v-btn>
      </v-toolbar>
      <template v-slot:activator="{ props }">
        <div class="field">
          <label class="label is-white">
            <div class="search-term">
              {{ filterTitle }}
              <span v-if="multipleSelections?.length >= 1"
                >({{ multipleSelections?.length }})</span
              >
            </div>
          </label>
          <div class="field" v-bind="props" @click="handleClearTermSearch()">
            <div class="input break-title">
              {{ multipleSelections?.map((s) => s.name)?.join(", ") || placeholderText }}
            </div>
          </div>
        </div>
      </template>
      <v-card>
        <div class="all-filters">
          <div v-if="!loadingFilters" class="filters">
            <div
              v-for="filter in filterStore.filteredFacilityMainFilters"
              :key="filter.id"
            >
              <div v-if="hasActiveOptions(filter.id)" class="filter-name ml-2">
                {{ filter.name }}
                <v-btn
                  @click="handleToggleAll(filter)"
                  hide-details
                  :color="areAllSelected(filter) ? 'primary' : 'grey'"
                  density="compact"
                  class="ma-2"
                  :append-icon="areAllSelected(filter) ? 'mdi-delete' : ''"
                >
                  <span>
                    {{
                      areAllSelected(filter) ? "Alle abwählen" : "Alle auswählen"
                    }}</span
                  >
                </v-btn>
              </div>
              <div class="filter-options ml-1">
                <label
                  class="option ma-n1"
                  v-for="option in filter.options"
                  :key="option.id"
                >
                  <v-btn
                    v-if="option?.care_facilities_active_count > 0"
                    :model-value="modelValue.includes(option.id)"
                    @click.prevent="handleOptionSelect(option)"
                    hide-details
                    density="compact"
                    class="options-select general-font-size ma-2 text-none font-weight-light"
                    :class="{
                      'is-selected': modelValue.includes(option.id),
                    }"
                  >
                    <p v-if="loadingFilters" class="waiting general-font-size">
                      <span>.</span><span>.</span><span>.</span>
                    </p>

                    <span v-else>
                      {{ option.name }}
                    </span>
                  </v-btn>
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
import { onClickOutside } from "@vueuse/core";
import { useFilterStore, type FilterKind } from "~/store/searchFilter";

type Filter = {
  id: string;
  name: string;
  care_facilities_active_count: number;
};

const props = defineProps<{
  modelValue: string[];
  filterKind: FilterKind;
  filterTitle: string;
}>();

const dialog = ref(false);

const emit = defineEmits<{
  (event: "update:modelValue", values: string[]): void;
}>();

const placeholderText = ref("Laden...");
const setPlaceholderText = () => {
  if (props.filterKind === "facility") {
    placeholderText.value = "Branche wählen";
  } else if (props.filterKind === "course") {
    placeholderText.value = "Themengebiet wählen";
  }
};

const hasActiveOptions = (filterId: string) => {
  const options = filterStore.allFacilityMainFilters.find(
    ({ id }) => id === filterId
  )?.options;
  return (
    options &&
    options.some((option) => Number(option?.care_facilities_active_count) > 0)
  );
};

const showPopover = ref(false);
const popoverParentRef = ref<HTMLDivElement>();
const multipleSelections = ref<Filter[]>([]);

onClickOutside(popoverParentRef, () => (showPopover.value = false));

const loadingFilters = ref(false);
const filterStore = useFilterStore();
const handleClearTermSearch = () => {
  if (filterStore.currentSearchTerm) {
    filterStore.clearTermSearch();
  }
  return;
};
const handleOptionSelect = (option: Filter) => {
  const indexOfAlreadySetFilter = props.modelValue.findIndex(
    (item) => item === option.id
  );

  if (indexOfAlreadySetFilter !== -1) {
    props.modelValue.splice(indexOfAlreadySetFilter, 1);
    multipleSelections.value = multipleSelections.value?.filter(
      (item) => item.id !== option.id
    );
  } else {
    props.modelValue.push(option.id);
    multipleSelections.value.push(option);
  }

  emit("update:modelValue", props.modelValue);
};

const handleToggleAll = (filter: any) => {
  const options = filterStore.allFacilityMainFilters.find(
    ({ id }) => id === filter.id
  )?.options;
  const relevantOptions = options.filter(
    (option) => !!option?.care_facilities_active_count
  );

  const selectAll = !areAllSelected(filter);

  if (selectAll) {
    relevantOptions.forEach((option) => {
      if (!props.modelValue.includes(option.id)) {
        multipleSelections.value.push(option);
      }
    });
  } else {
    relevantOptions.forEach((option) => {
      const indexOfAlreadySetFilter = props.modelValue.findIndex(
        (item) => item === option.id
      );
      if (indexOfAlreadySetFilter !== -1) {
        props.modelValue.splice(indexOfAlreadySetFilter, 1);
      }
    });

    multipleSelections.value = multipleSelections.value.filter(
      (item) => !relevantOptions.find((option) => option.id === item.id)
    );
  }

  emit(
    "update:modelValue",
    multipleSelections.value.map((item) => item.id)
  );
};

const areAllSelected = (filter: any) => {
  const options = filterStore.allFacilityMainFilters.find(
    ({ id }) => id === filter.id
  )?.options;
  const relevantOptions = options.filter(
    (option) => !!option?.care_facilities_active_count
  );

  return relevantOptions.every((option) =>
    multipleSelections.value.find((item) => item.id === option.id)
  );
};

watch(
  () => props.modelValue,
  () => {
    multipleSelections.value = filterStore.allFacilityMainFilters.reduce(
      (prev, curr) => {
        const foundOptions = curr.options.filter((option) =>
          props.modelValue.includes(option.id)
        );
        return [...prev, ...foundOptions];
      },
      [] as Filter[]
    );
  }
);

onMounted(async () => {
  setPlaceholderText();

  await filterStore.loadAllCommunities();
  filterStore.loadFilteredCommunities();
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
  color: $dark-grey;
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
