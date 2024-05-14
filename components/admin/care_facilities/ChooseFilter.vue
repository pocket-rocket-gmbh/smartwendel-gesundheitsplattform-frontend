<template>
  <v-checkbox
    v-show="false"
    v-bind:model-value="filterSelected"
    :rules="[filterSelected || 'Pflichtangabe']"
  ></v-checkbox>
  <v-alert
    class="my-5 general-font-size"
    v-if="!filterSelected && !loadingFilters"
    type="info"
    density="compact"
    closable
  >
    Bitte mindestens einen Filter auswählen
  </v-alert>
  <LoadingSpinner
    v-if="loadingFilters && (!availableFilters || !availableFilters.length)"
  >
    Filter werden geladen ...
  </LoadingSpinner>
  <div class="choose-facility-type" v-else>
    <CollapsibleItem
      v-for="mainFilter in availableFilters"
      :id="mainFilter.id"
      :expand="expandIds.includes(mainFilter.id)"
      @expand-toggled="handleExpandToggle(mainFilter.id)"
    >
      <template #title align="center">
        <span
          class="is-secondary-color"
          :class="[expandIds.includes(mainFilter.id) ? 'text-h5' : 'text-h6']"
        >
          {{ mainFilter.name }}
          <span v-if="mainFilter.name === 'Behandlungsschwerpunkte'"
            >(nur von ärztlichen und therapeutischen Leistungserbringern
            auszuwählen)</span
          >
        </span>
        <div>
          <span class="is-secondary-color" v-if="filterHasSelected(mainFilter)"
            >Bereits ausgewählt:
          </span>
          <span v-for="tag in preSetTags">
            <v-chip
              size="small"
              class="mx-2 my-2 is-secondary-color"
              v-if="getTagName(mainFilter, tag)"
            >
              {{ getTagName(mainFilter, tag) }}
              <v-icon v-if="filterType === 'filter_facility'" :color="getColorClassForAmount(getAmountForTag(tag))"
                >mdi-circle</v-icon
              >
            </v-chip>
          </span>
        </div>
      </template>
      <template #content>
        <div
          v-if="mainFilter.name === 'Tätigkeitsgebiet'"
          class="mb-3 d-flex align-center"
        >
          <v-alert color="grey" class="mt-2">
            <div class="d-flex align-center filter-request">
              <div class="py-1">
                <span class="has-font-size-small-medium mr-3"
                  >Falls das passende Tätigkeitsgebiet für deine Einrichtung/dein
                  Unternehmen nicht zu finden ist, kontaktiere uns bitte
                </span>
                <span>
                  <v-btn
                    color="primary"
                    class="iis-white-color"
                    :href="`mailto:smartcity@lkwnd.de?subject=Anfrage Leistungsfilter`"
                    >HIER</v-btn
                  >
                </span>
              </div>
            </div>
          </v-alert>
        </div>
        <div class="main-class">
          <div class="filter-options" v-for="option in mainFilter.next">
            <div
              class="filter-tile is-secondary-color"
              :class="{ selected: preSetTags.includes(option.id) }"
              @click.stop="handleSubFilterParentClick(mainFilter, option)"
            >
              {{ option.name }}
            </div>
            <div class="" v-auto-animate v-if="filterType === 'filter_facility'">
              <v-radio-group
                v-if="preSetTags.includes(option.id)"
                v-model="listOptionValues[option.id]"
                @update:model-value="
                  updateAvailability(option.id, listOptionValues[option.id])
                "
                :mandatory="true"
              >
                <v-radio
                  v-for="(item, index) in listOptions"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                  :color="item.color"
                  default
                ></v-radio>
              </v-radio-group>
            </div>
            <div v-if="option.next?.length" class="options">
              <div class="option" v-for="subOption in option.next">
                <label class="text-subOptions">
                  <input
                    :type="enableMultiSelect ? 'checkbox' : 'radio'"
                    :checked="isChecked(subOption)"
                    @click.stop="handleSubFilterClick(option, subOption)"
                  />
                  {{ subOption.name }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <v-row>
          <v-col class="d-flex justify-end">
            <v-icon class="mr-2" color="primary">mdi-update</v-icon>
            {{ useDatetime().parseDatetime(careFacility?.updated_at) }}
          </v-col>
        </v-row>
        <LoadingSpinner v-if="loadingFilters"
          >Leistung wird hinzugefügt...
        </LoadingSpinner>
      </template>
    </CollapsibleItem>
  </div>
</template>

<script setup lang="ts">
import {
  type FilterKind,
  type FilterType,
  useFilterStore,
} from "~/store/searchFilter";
import { useStatusLoadingFilter } from "@/store/statusLoadingFilter";

const props = defineProps<{
  preSetTags: string[];
  filterType: FilterType;
  filterKind: FilterKind;
  enableMultiSelect?: boolean;
  careFacility: Object;
}>();

const listOptionValues: Ref<Record<string, number>> = ref({});

const preSetTagsFromCareFacility = computed(() => {
  const tags = (
    props.careFacility as {
      availability: { category_id: string; amount: number }[];
    }
  ).availability;

  return tags;
});

const getAmountForTag = (tagId : any) => {
  const tagItem = preSetTagsFromCareFacility.value.find((item: { category_id: string; amount: number }) => item.category_id === tagId);
  return tagItem ? tagItem.amount : null;
};
const getColorClassForAmount = (amount:any) => {
  if (amount === 1) {
    return 'green';
  } else if (amount === 2) {
    return 'orange';
  } else if (amount === 3) {
    return 'red';
  }
  return '';
};

const listOptions = ref([
  { text: "Plätze vorhanden", value: 1, color: "primary" },
  { text: "Auf Anfrage", value: 2, color: "orange" },
  { text: "Nicht vorhanden", value: 3, color: "red" },
 
  
]);

const snackbar = useSnackbar();

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());

const updateAvailability = async (optionId: string, value: number) => {
  const preSetTags = preSetTagsFromCareFacility.value;

  const found = preSetTags.findIndex((item: any) => item.category_id === optionId);

  if (found === -1) {
    preSetTags.push({ category_id: optionId, amount: value });
  } else {
    preSetTags[found].amount = value;
  }
};

const emit = defineEmits<{
  (event: "setTags", tags: string[]): void;
  (
    event: "areFiltersSet",
    areFiltersSet: boolean,
    filterType: FilterType
  ): void;
}>();

type Filter = { id: string; name: string; parent_id?: string; next?: Filter[] };

const selectedFilter = ref<Filter>();
const availableFilters = ref<Filter[]>([]);

const statusLoadingFilter = useStatusLoadingFilter();

const loadingFilters = computed(() => {
  if (props.filterType === "filter_facility") {
    return statusLoadingFilter.categoryLoaded;
  }
  return statusLoadingFilter.servicesLoaded;
});

const flatFilterArray = (filterArray: Filter[]) => {
  if (!filterArray) return [];
  const flat: Filter[] = filterArray.reduce((prev, curr) => {
    const next = curr.next ? flatFilterArray(curr.next) : [];
    return [...prev, ...next] as Filter[];
  }, [] as Filter[]);
  return [...flat, ...filterArray];
};

const filterSelected = computed(() => {
  const flat = flatFilterArray(availableFilters.value);
  const filterOfCategoryIsSet = flat.some(
    (item) => !!props.preSetTags.find((tag) => tag === item.id)
  );
  emit("areFiltersSet", filterOfCategoryIsSet, props.filterType);
  return filterOfCategoryIsSet;
});

const expandIds = ref<string[]>([]);

const getFilterOptions = (parentId: string, allFilters: Filter[]) => {
  const nextItems = allFilters.filter((item) => item.parent_id === parentId);
  nextItems.forEach(
    (nextItem) =>
      (nextItem.next = allFilters.filter(
        (item) => item.parent_id === nextItem.id
      ))
  );

  return nextItems;
};

const filterHasSelected = (mainFilter: Filter) => {
  if (!mainFilter.next) return false;

  return mainFilter.next.find((filter) => props.preSetTags.includes(filter.id));
};

const getTagName = (mainFilter: Filter, filterId: string) => {
  if (!mainFilter.next) return "";
  const found = mainFilter.next.find((filter) => filter.id === filterId);

  if (found) return found.name;

  if (!mainFilter.next) return "";

  for (const next of mainFilter.next) {
    const foundNext = next?.next?.find((filter) => filter.id === filterId);
    if (foundNext) return foundNext.name;
  }

  return "";
};

const enableAllTags = (filter: Filter) => {
  const updatedTags = [
    ...new Set([
      ...props.preSetTags,
      filter.id,
      ...filter.next.map(({ id }) => id),
    ]),
  ];
  emit("setTags", updatedTags);
};

const disableAllTags = (filter: Filter) => {
  const parentIndex = props.preSetTags.findIndex((tag) => tag === filter.id);
  if (parentIndex !== -1) {
    props.preSetTags.splice(parentIndex, 1);
  }

  filter.next.forEach((nextFilter) => {
    const nextIndex = props.preSetTags.findIndex(
      (tag) => tag === nextFilter.id
    );
    if (nextIndex !== -1) {
      props.preSetTags.splice(nextIndex, 1);
    }
  });
  emit("setTags", props.preSetTags);
};

const handleSubFilterParentClick = async (parent: Filter, current: Filter) => {
  if (!current.next) return handleClick(parent, current);

  if (props.preSetTags.includes(current.id)) {
    disableAllTags(current);
  } else {
    enableAllTags(current);
  }
};

const handleSubFilterClick = async (parent: Filter, current: Filter) => {
  selectedFilter.value = current;

  const removeIndex = props.preSetTags.findIndex(
    (tagId) => tagId === current.id
  );
  selectedFilter.value = null;
  if (removeIndex !== -1) {
    props.preSetTags.splice(removeIndex, 1);

    const parentIndex = props.preSetTags.findIndex(
      (item) => item === parent.id
    );
    if (parentIndex !== -1) props.preSetTags.splice(parentIndex, 1);

    emit("setTags", props.preSetTags);
    return;
  }

  props.preSetTags.push(current.id);

  if (
    parent.next
      .map((next) => next.id)
      .every((id) => props.preSetTags.includes(id))
  ) {
    props.preSetTags.push(parent.id);
  }

  emit("setTags", props.preSetTags);
};

const handleClick = (parent: Filter, current: Filter) => {
  selectedFilter.value = current;

  const removeIndex = props.preSetTags.findIndex(
    (tagId) => tagId === current.id
  );
  selectedFilter.value = null;
  if (removeIndex !== -1) {
    props.preSetTags.splice(removeIndex, 1);
    emit("setTags", props.preSetTags);
    return;
  }

  if (!props.enableMultiSelect) {
    const optionsOfMainFilter = parent.next;

    const alreadyInGroupIndex = props.preSetTags.findIndex((tagId) =>
      optionsOfMainFilter.find((filter) => filter.id === tagId)
    );
    if (alreadyInGroupIndex !== -1) {
      props.preSetTags.splice(alreadyInGroupIndex, 1);
    }
  }

  emit("setTags", [...props.preSetTags, current.id]);
};

const isChecked = (option: Filter) => {
  return props.preSetTags?.includes(option.id);
};

const reloadFilters = async () => {
  if (props.filterType === "filter_facility") {
    statusLoadingFilter.categoryLoaded = true;
  } else {
    statusLoadingFilter.servicesLoaded = true;
  }

  const mainFilters = await getMainFilters(props.filterType, props.filterKind);
  const allFilters = await useFilterStore().loadAllFilters();

  const allNextFilters = mainFilters.map((mainFilter) =>
    getFilterOptions(mainFilter.id, allFilters)
  );

  availableFilters.value = [];
  allNextFilters.forEach((nextFilters, i) => {
    availableFilters.value.push({ ...mainFilters[i], next: nextFilters });
  });

  if (props.filterType === "filter_facility") {
    statusLoadingFilter.categoryLoaded = false;
  } else {
    statusLoadingFilter.servicesLoaded = false;
  }
};

const handleExpandToggle = (selectedId: string) => {
  const expandIndex = expandIds.value.findIndex((id) => id === selectedId);

  if (expandIndex === -1) {
    expandIds.value.push(selectedId);
    return;
  }
  expandIds.value.splice(expandIndex, 1);
};

watch(
  // @ts-expect-error any
  () => props.careFacility.availability,
  async (newValue) => {
    if (preSetTagsFromCareFacility.value) {
      preSetTagsFromCareFacility.value.forEach((item) => {
        const optionId = item.category_id;
        if (!(optionId in listOptionValues.value)) {
          listOptionValues.value[optionId] = item.amount ?? 1;
        }
      });
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

onMounted(async () => {
  reloadFilters();
});
</script>

<style lang="scss" scoped>
.choose-facility-type {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 0 0 1rem;
}

.filter-tile {
  display: flex;
  place-items: center;
  text-align: center;
  justify-content: center !important;
  cursor: pointer;
  font-size: 20px;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  background-color: white;
  min-height: 50px;
  min-height: 100px;
  max-height: 50px;
  max-height: 100px;
  padding: 1rem;
  &:hover,
  &.selected {
    background-color: #8ab61d;
    border-color: #9ea10c;
    color: white;
  }
}

.main-class {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.add-new {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.content {
  display: flex;
}

.column_wrapper {
  max-height: 200px;
  display: flex;
  flex-flow: column wrap;
}

.text-subOptions {
  font-size: 18px;
  line-height: 1.4;
}
</style>
