<template>
  <div class="popover" ref="popoverParentRef" v-auto-animate>
    <div class="input" @click="showPopover = !showPopover">
      {{ selectedFilter?.name || "Filter wählen" }}

      <div class="actions">
        <div class="chevron" :class="[showPopover ? 'down' : 'up']"></div>
      </div>
    </div>

    <div
      class="popover-content"
      :style="{ width: popoverWidth ? `${popoverWidth}px` : 'max-content' }"
      v-if="showPopover"
      v-auto-animate
    >
      <div v-if="!loadingFilters" class="filters">
        <div v-for="filter in mainFilters" :key="filter.id">
          <div class="filter-name">
            {{ filter.name }}
          </div>
          <div class="filter-options">
            <label
              class="option"
              v-for="option in filterOptions.find(({ parentId }) => parentId === filter.id).options"
            >
              <v-radio
                :model-value="selectedFilter?.id === option.id"
                @click.prevent="handleOptionSelect(option)"
                hide-details
                density="compact"
                :label="String(selectedFilter?.id === option.id)"
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

const props = defineProps<{
  modelValue: string[];
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
const selected = ref();

onClickOutside(popoverParentRef, () => (showPopover.value = false));

const mainFilters = ref([]);
const filterOptions = ref<FilterOption[]>([]);

const loadingFilters = ref(false);

const handleOptionSelect = (option: Filter) => {
  if (selectedFilter.value === option) {
    selectedFilter.value = null;
    return;
  }
  const previous = { ...selectedFilter.value };
  selectedFilter.value = option;

  const previousIndex = props.modelValue.findIndex((item) => item === previous.id);

  if (previousIndex !== -1) {
    props.modelValue.splice(previousIndex, 1);
  }

  if (selectedFilter.value) {
    props.modelValue.push(selectedFilter.value.id);
  }
  emit("update:modelValue", props.modelValue);
};

onMounted(async () => {
  loadingFilters.value = true;
  mainFilters.value = await getMainFilters('filter_facility', 'facility');

  const allOptionsPromises = mainFilters.value.map((filter) => getFilters(filter.id));
  const allOptions = await Promise.all(allOptionsPromises);

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
    const doesInclude = props.modelValue.find((item: string) => item === option.id);
    return doesInclude;
  });

  selectedFilter.value = foundFilter;
});
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

.popover {
  position: relative;

  .input {
    height: 38px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;

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
    box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14),
      0px 1px 3px 0px rgba(0, 0, 0, 0.12);
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
