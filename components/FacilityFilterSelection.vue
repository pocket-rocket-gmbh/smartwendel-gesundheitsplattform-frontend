<template>
  <div class="popover" ref="popoverParentRef" v-auto-animate>
    <div class="input" @click="showPopover = !showPopover">
      {{ selectedFilter?.name || "Filter wählen" }}

      <div class="actions">
        <div class="chevron" :class="[showPopover ? 'down' : 'up']"></div>
      </div>
    </div>

    <div class="popover-content" v-if="showPopover" v-auto-animate>
      <div v-if="!loadingFilters" class="filters">
        <div v-for="filter in mainFilters" :key="filter.id">
          <div class="filter-name">
            {{ filter.name }}
          </div>
          <div class="filter-options">
            <div
              class="option"
              v-for="option in filterOptions.find(({ parentId }) => parentId === filter.id).options"
              @click="handleOptionSelect(option)"
            >
              <label class="option-label">
                <input type="radio" :checked="selectedFilter?.id === option.id" />
                {{ option.name }}
              </label>
            </div>
          </div>
        </div>
      </div>
      <LoadingSpinner v-else> Filter werden geladen ... </LoadingSpinner>

      <v-btn
        v-if="selectedFilter"
        class="clear-button"
        variant="outlined"
        elevation="0"
        @click="handleOptionSelect(null)"
      >
        Auswahl leeren
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";

const props = defineProps<{
  modelValue: string[];
}>();

const emit = defineEmits<{
  (event: "update:modelValue", values: string[]): void;
}>();

type Filter = { id: string; name: string };

type FilterOption = {
  parentId: string;
  options: Filter[];
};

const showPopover = ref(false);
const popoverParentRef = ref<HTMLDivElement>();
const selectedFilter = ref<Filter>();

onClickOutside(popoverParentRef, () => (showPopover.value = false));

const mainFilters = ref([]);
const filterOptions = ref<FilterOption[]>([]);

const api = useCollectionApi();
api.setBaseApi(usePublicApi());
api.setEndpoint("tag_categories");

const loadingFilters = ref(false);

const handleOptionSelect = (option: Filter) => {
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
  mainFilters.value = await getMainFilters("facility");

  for (const mainFilter of mainFilters.value) {
    const options = await getFilters(mainFilter.id);

    filterOptions.value.push({
      parentId: mainFilter.id,
      options,
    });
  }
  loadingFilters.value = false;

  const allOptions = filterOptions.value.reduce((prev, curr) => {
    return [...prev, ...curr.options];
  }, [] as Filter[]);

  const foundFilter = allOptions.find((option) => {
    const doesInclide = props.modelValue.find((item: string) => item === option.id);
    return doesInclide;
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
