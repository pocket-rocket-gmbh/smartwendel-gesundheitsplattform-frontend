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
        {{
          multipleSelections?.map((s) => s.name)?.join(", ") ||
          selectedFilter?.name ||
          placeholderText
        }}
      </div>

      <div class="actions">
        <div class="chevron" :class="[showPopover ? 'up' : 'down']"></div>
      </div>
    </div>
    <div
      class="popover-content general-font-size"
      :width="popoverWidth ? `${popoverWidth}px` : 'max-content'"
      v-if="showPopover"
      v-auto-animate
    >
      <v-btn
        @click="showPopover = false"
        hide-details
        density="compact"
        class="options-select general-font-size ma-2 text-none font-weight-light"
      >
        <span>Fertig</span>
      </v-btn>
      <div v-if="!loadingFilters" class="filters">
        <div v-for="filter in mainFilters" :key="filter.id" class="filter-column">
          <div
            v-if="hasActiveOptions(filter.id)"
            class="filter-name my-1 font-weight-bold"
          >
            {{ filter.name }}

            <v-btn
              @click="selectAllOptions(filter)"
              hide-details
              color="grey"
              density="compact"
              class="options-select general-font-size ma-2 text-none font-weight-light"
            >
              <span>Alle anzeigen</span>
            </v-btn>
          </div>
          <div
            class="filter-options"
            :style="{
              width: popoverWidth ? `${popoverWidth}px` : 'max-content',
            }"
          >
            <label
              class="option ma-n1"
              v-for="option in filterOptions.find(
                ({ parentId }) => parentId === filter.id
              ).options"
            >
              <v-btn
                v-if="option?.care_facilities_active_count > '0'"
                :model-value="modelValue.includes(option.id)"
                @click.prevent="handleOptionSelect(option, true)"
                hide-details
                density="compact"
                class="options-select general-font-size ma-2 text-none font-weight-light"
                :class="{
                  'is-selected': multipleSelections?.length
                    ? modelValue.includes(option.id)
                    : selectedFilter?.id === option.id,
                }"
              >
                {{ option.name }}
              </v-btn>
            </label>
            <v-divider v-if="hasActiveOptions(filter.id)" class="my-2"></v-divider>
          </div>
        </div>
      </div>
      <LoadingSpinner v-else> Filter werden geladen ... </LoadingSpinner>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { type FilterKind, useFilterStore } from "~/store/searchFilter";
import { BreakPoints, useBreakpoints } from "~/composables/ui/breakPoints";

const props = defineProps<{
  modelValue: string[];
  filterKind: FilterKind;
  popoverWidth?: number;
}>();

const breakpoints = useBreakpoints();

const placeholderText = ref("Laden...");
const setPlaceholderText = () => {
  if (props.filterKind === "facility") {
    placeholderText.value = "Branche wählen";
  }
};
const emit = defineEmits<{
  (event: "update:modelValue", values: string[]): void;
}>();

const hasActiveOptions = (filterId: string) => {
  const options = filterOptions.value.find(({ parentId }) => parentId === filterId)?.options;
  return options && options.some((option) => Number(option?.care_facilities_active_count) > 0);
};

watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue.length) {
      selectedFilter.value = null;
    }
  }
);

type Filter = { id: string; name: string; care_facilities_active_count: string };

type FilterOption = {
  parentId: string;
  options: Filter[];
};

const showPopover = ref(false);
const popoverParentRef = ref<HTMLDivElement>();
const selectedFilter = ref<Filter>();
const multipleSelections = ref<Filter[]>([]);

onClickOutside(popoverParentRef, () => (showPopover.value = false));

const mainFilters = ref([]);
const filterOptions = ref<FilterOption[]>([]);

const loadingFilters = ref(false);
const filterStore = useFilterStore();
const handleClearTermSearch = () => {
  if (filterStore.currentSearchTerm) {
    filterStore.clearTermSearch();
  }
  return;
};
const handleOptionSelect = (option: Filter, multiple?: boolean) => {
  if (multiple) {
    const indexOfAlreadySetFilter = props.modelValue.findIndex((item) => item === option.id);

    if (indexOfAlreadySetFilter !== -1) {
      props.modelValue.splice(indexOfAlreadySetFilter, 1);
      multipleSelections.value = multipleSelections.value?.filter((item) => item.id !== option.id);
    } else {
      props.modelValue.push(option.id);
      multipleSelections.value.push(option);
    }

    emit("update:modelValue", props.modelValue);
    return;
  }

  if (selectedFilter.value && selectedFilter.value.id !== option.id) {
    const indexOfAlreadySetFilter = props.modelValue.findIndex((item) => item === selectedFilter.value.id);

    if (indexOfAlreadySetFilter !== -1) {
      props.modelValue.splice(indexOfAlreadySetFilter, 1);
    }
  }

  emit("update:modelValue", props.modelValue);
};

const selectAllOptions = (filter:any) => {
  const options = filterOptions.value.find(({ parentId }) => parentId === filter.id)?.options;
  options.forEach((option) => {
    if (multipleSelections.value.includes(option)) {
      return;
    }
    handleOptionSelect(option, true);
  });
};

onMounted(async () => {
  loadingFilters.value = true;
  mainFilters.value = await getMainFilters("filter_facility", props.filterKind);
  const allFilters = await filterStore.loadAllFilters();

  const allOptions = mainFilters.value.map((filter) => allFilters.filter((item) => item.parent_id === filter.id));

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

  const foundFilters = allAvailableOptions.filter((option) => {
    const doesInclude = props.modelValue.find((item: string) => item === option.id);
    return doesInclude;
  });

  if (foundFilters?.length > 1) {
    multipleSelections.value = foundFilters;
  }

  selectedFilter.value = foundFilters[0];
  setPlaceholderText();
});
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.sass";
.popover {
  position: relative;
  width: 100%;

  .input {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;

    .input-title {
      max-width: 300px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;

      .chevron {
        width: 20px;
        height: 20px;
        background-image: url("@/assets/icons/chevron-down.svg");
        background-repeat: no-repeat;
        background-position: center;
        transition: transform 150ms linear;

        &.up {
          transform: rotate(180deg);
        }
      }
    }
  }

  .popover-content {
    background-color: white;
    box-shadow: 0px 50px 100px rgba(0, 0, 0, 0.25);
    padding: 1rem;
    position: absolute;
    left: 0;
    top: calc(100% + 2px);
    border-radius: 10px;
    z-index: 5;
    .filter-name {
      font-size: 1.4rem;
      margin-bottom: 0.75rem;
      color: red;
    }

    .filter-options {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .option-label {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .clear-button {
      margin-top: 0.5rem;
      margin-left: auto;
    }
  }
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
