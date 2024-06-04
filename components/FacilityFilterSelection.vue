<template>
  <div class="popover general-font-size" ref="popoverParentRef" v-auto-animate>
    <div
      class="input"
      @click="
        showPopover = !showPopover;
        handleClearTermSearch();
      "
    >
      <div class="input-title">
        {{ multipleSelections?.map((s) => s.name)?.join(", ") || placeholderText }}
      </div>
      <div class="actions">
        <div class="chevron" :class="[showPopover ? 'up' : 'down']"></div>
      </div>
    </div>
    <div
      class="popover-content general-font-size loading-filters"
      :width="popoverWidth ? `${popoverWidth}px` : 'max-content'"
      v-if="showPopover"
      v-auto-animate
    >
      <div class="filters filter-wrap">
        <div
          v-for="filter in filterStore.filteredFacilityMainFilters"
          :key="filter.id"
          class="filter-column"
        >
          <div
            v-if="hasActiveOptions(filter.id)"
            class="filter-name my-1 font-weight-bold"
          >
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
                {{ areAllSelected(filter) ? "Alle abwählen" : "Alle auswählen" }}</span
              >
            </v-btn>
          </div>
          <div
            class="filter-options"
            :style="{
              width: popoverWidth ? `${popoverWidth}px` : 'max-content',
            }"
          >
            <label class="option ma-n1" v-for="option in filter.options" :key="option.id">
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
      <v-row class="done-button">
        <v-col class="d-flex justify-end">
          <v-btn
            @click="showPopover = false"
            hide-details
            density="compact"
            color="primary"
            class="options-select general-font-size ma-2 text-none font-weight-light"
          >
            <span>Fertig</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="loadingFilters">
        <v-col cols="12" class="d-flex justify-center">
          <LoadingSpinner> Filter werden geladen ... </LoadingSpinner>
        </v-col>
      </v-row>
    </div>
  </div>
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
  popoverWidth?: number;
}>();

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
  const options = filterStore.allFacilityMainFilters.find(({ id }) => id === filterId)?.options;
  return options && options.some((option) => Number(option?.care_facilities_active_count) > 0);
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
  const indexOfAlreadySetFilter = props.modelValue.findIndex((item) => item === option.id);

  if (indexOfAlreadySetFilter !== -1) {
    props.modelValue.splice(indexOfAlreadySetFilter, 1);
    multipleSelections.value = multipleSelections.value?.filter((item) => item.id !== option.id);
  } else {
    props.modelValue.push(option.id);
    multipleSelections.value.push(option);
  }

  emit("update:modelValue", props.modelValue);
};

const handleToggleAll = (filter: any) => {
  const options = filterStore.allFacilityMainFilters.find(({ id }) => id === filter.id)?.options;
  const relevantOptions = options.filter((option) => !!option?.care_facilities_active_count);

  const selectAll = !areAllSelected(filter);

  if (selectAll) {
    relevantOptions.forEach((option) => {
      if (!props.modelValue.includes(option.id)) {
        multipleSelections.value.push(option);
      }
    });
  } else {
    relevantOptions.forEach((option) => {
      const indexOfAlreadySetFilter = props.modelValue.findIndex((item) => item === option.id);
      if (indexOfAlreadySetFilter !== -1) {
        props.modelValue.splice(indexOfAlreadySetFilter, 1);
      }
    });

    multipleSelections.value = multipleSelections.value.filter((item) => !relevantOptions.find((option) => option.id === item.id));
  }

  emit(
    "update:modelValue",
    multipleSelections.value.map((item) => item.id)
  );
};

const areAllSelected = (filter: any) => {
  const options = filterStore.allFacilityMainFilters.find(({ id }) => id === filter.id)?.options;
  const relevantOptions = options.filter((option) => !!option?.care_facilities_active_count);

  return relevantOptions.every((option) => multipleSelections.value.find((item) => item.id === option.id));
};

watch(
  () => props.modelValue,
  () => {
    multipleSelections.value = filterStore.allFacilityMainFilters.reduce((prev, curr) => {
      const foundOptions = curr.options.filter((option) => props.modelValue.includes(option.id));
      return [...prev, ...foundOptions];
    }, [] as Filter[]);
  }
);

watch(
  () => filterStore.filteredFacilityMainFilters,
  () => {
    multipleSelections.value = filterStore.filteredFacilityMainFilters.map(filter => filter.options).flat().filter(option => props.modelValue.includes(option.id));
  }
);

onMounted(async () => {
  setPlaceholderText();
  await filterStore.loadAllCommunities();
  filterStore.loadFilteredCommunities();


});
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

.is-selected {
  background-color: #8ab61d !important;
  color: white !important;
}

.waiting span {
  animation-name: blink;
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  min-width: 300px;
}

.waiting span:nth-child(2) {
  animation-delay: 0.2s;
}

.waiting span:nth-child(3) {
  animation-delay: 0.4s;
}
</style>

<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

.is-selected {
  background-color: #8ab61d !important;
  color: white !important;
}

.filter-wrap {
  max-height: 500px;
  overflow-y: auto;
}
</style>
