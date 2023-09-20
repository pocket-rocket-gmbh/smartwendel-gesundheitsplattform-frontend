<template>
  <div class="popover general-font-size" ref="popoverParentRef" v-auto-animate>
    <div class="input" @click="showPopover = !showPopover">
      <div class="input-title">{{ multipleSelections?.map((s) => s.name)?.join(", ") || selectedFilter?.name || "Kategorie wählen" }}</div>

      <div class="actions">
        <div class="chevron" :class="[showPopover ? 'up' : 'down']"></div>
      </div>
    </div>

    <div class="popover-content" :style="{ width: popoverWidth ? `${popoverWidth}px` : 'max-content' }" v-if="showPopover" v-auto-animate>
      <div v-if="!loadingFilters" class="filters">
        <div v-for="filter in mainFilters" :key="filter.id">
          <div class="filter-name">
            {{ filter.name }}
          </div>
          <div class="filter-options">
            <label class="option" v-for="option in filterOptions.find(({ parentId }) => parentId === filter.id).options">
              <v-radio
                v-if="!useUser().isAdmin()"
                :model-value="multipleSelections?.length ? modelValue.includes(option.id) : selectedFilter?.id === option.id"
                @click.prevent="handleOptionSelect(option)"
                hide-details
                density="compact"
                :label="option.name"
                color="#8AB61D"
              />
              <v-checkbox
                v-else
                :model-value="modelValue.includes(option.id)"
                @click.prevent="handleOptionSelect(option, true)"
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
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { FilterKind } from "~/store/searchFilter";

const props = defineProps<{
  modelValue: string[];
  filterKind: FilterKind;
  popoverWidth?: number;
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

type Filter = { id: string; name: string };

type FilterOption = {
  parentId: string;
  options: Filter[];
};

const showPopover = ref(false);
const popoverParentRef = ref<HTMLDivElement>();
const selectedFilter = ref<Filter>();
const multipleSelections = ref<Filter[] | null>();

onClickOutside(popoverParentRef, () => (showPopover.value = false));

const mainFilters = ref([]);
const filterOptions = ref<FilterOption[]>([]);

const loadingFilters = ref(false);

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

  const previousIndex = props.modelValue.findIndex((item) => item === option.id);

  if (previousIndex !== -1) {
    props.modelValue.splice(previousIndex, 1);

    if (multipleSelections.value?.length) {
      multipleSelections.value.forEach((selection) => {
        const index = props.modelValue.findIndex((item) => item === selection.id);
        if (index === -1) {
          return;
        }
        props.modelValue.splice(index, 1);
      });

      multipleSelections.value = null;
    }

    selectedFilter.value = null;
  } else if (option) {
    props.modelValue.push(option.id);
    selectedFilter.value = option;
  }

  emit("update:modelValue", props.modelValue);
};

onMounted(async () => {
  loadingFilters.value = true;
  mainFilters.value = await getMainFilters("filter_facility", props.filterKind);
  const allFilters = await getAllFilters();

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

  if (foundFilters.length > 1) {
    multipleSelections.value = foundFilters;
  }

  selectedFilter.value = foundFilters[0];
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
    box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
    padding: 1rem;
    position: absolute;
    left: 0;
    top: calc(100% + 2px);
    border-radius: 10px;
    z-index: 5;
    display: flex;
    flex-direction: column;

    .filters {
      display: flex;
      gap: 1.5rem;
      justify-content: space-between;

      .filter-name {
        font-size: 1.25rem;
        margin-bottom: 0.75rem;
      }
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
</style>
