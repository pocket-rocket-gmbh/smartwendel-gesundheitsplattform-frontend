<template>
  <v-alert
    class="my-5"
    v-if="!filterSelected && !loadingFilters"
    type="warning"
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
      :expand="!expandIds.includes(mainFilter.id)"
      @expand-toggled="handleExpandToggle(mainFilter.id)"
    >
      <template #title>
        {{ mainFilter.name }}
        <template v-for="tag in preSetTags">
          <v-chip class="mx-2" v-if="getTagName(mainFilter, tag)">
            {{ getTagName(mainFilter, tag) }}
          </v-chip>
        </template>
      </template>
      <template #content>
        <div class="main-class">
          <div class="filter-options" v-for="option in mainFilter.next">
            <div
              class="filter-tile my-3"
              :class="{ selected: preSetTags.includes(option.id) }"
              @click.stop="handleSubFilterParentClick(mainFilter, option)"
            >
              {{ option.name }}
            </div>
            <v-row>
              <v-col class="">
                <div class="option" v-for="subOption in option.next">
                  <div class="option-label">
                    <label class="text-subOptions">
                      <input
                      class="my-1"
                        :type="enableMultiSelect ? 'checkbox' : 'radio'"
                        :checked="isChecked(subOption)"
                        @click.stop="handleSubFilterClick(option, subOption)"
                      />
                        {{ subOption.name }}
                    </label>
                   
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
        <LoadingSpinner v-if="loadingFilters"
          >Leistung wird hinzugefügt...
        </LoadingSpinner>
      </template>
    </CollapsibleItem>
  </div>
</template>

<script setup lang="ts">
import { ResultStatus } from "~/types/serverCallResult";
import { FilterKind, FilterType } from "~/store/searchFilter";

const props = defineProps<{
  preSetTags: string[];
  filterType: FilterType;
  filterKind: FilterKind;
  enableMultiSelect?: boolean;
}>();

const emit = defineEmits<{
  (event: "setTags", tags: string[]): void;
}>();

type Filter = { id: string; name: string; next?: Filter[] };

const selectedFilter = ref<Filter>();
const availableFilters = ref<Filter[]>([]);

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
  return filterOfCategoryIsSet;
});

const mainFilters = ref([]);
const expandIds = ref<string[]>([]);

const loadingFilters = ref(false);

const newServiceName = ref("");

/**
 * Currently limited to max 2 layers more
 */
const getFilterOptions = async (id: string) => {
  const filters = await getFilters(id);

  const subTagPromises = filters.map((filter) => {
    return getFilters(filter.id);
  });

  const allSubTags = await Promise.all(subTagPromises);

  allSubTags.forEach((subTags, i) => {
    if (!subTags.length) return;
    filters[i].next = subTags;
  });

  return filters;
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

const handleCreateNewService = async (parentId: string, name: string) => {
  if (!name) return;

  const api = useCollectionApi();
  api.setBaseApi(usePrivateApi());
  api.setEndpoint(`tag_categories`);

  const result = await api.createItem(
    { name, parent_id: parentId },
    `Erfolgreich erstellt`
  );

  if (result.status === ResultStatus.SUCCESSFUL) {
    newServiceName.value = "";
    await reloadFilters();
    emit("setTags", [...props.preSetTags, result.data.resource.id]);
  } else {
    console.error("ERROR");
  }
};

const reloadFilters = async () => {
  loadingFilters.value = true;
  mainFilters.value = await getMainFilters(props.filterType, props.filterKind);

  const nextFiltersPromises = mainFilters.value.map((mainFilter) =>
    getFilterOptions(mainFilter.id)
  );

  const allNextFilters = await Promise.all(nextFiltersPromises);
  availableFilters.value = [];
  allNextFilters.forEach((nextFilters, i) => {
    availableFilters.value.push({ ...mainFilters.value[i], next: nextFilters });
  });

  loadingFilters.value = false;
};

const handleExpandToggle = (selectedId: string) => {
  const expandIndex = expandIds.value.findIndex((id) => id === selectedId);

  if (expandIndex === -1) {
    expandIds.value.push(selectedId);
    return;
  }

  expandIds.value.splice(expandIndex, 1);
};

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

.option {
  margin-left: 1rem;
}

.filter-tile {
  place-items: center;
  text-align: center;
  display: flex;
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
  &:hover,
  &.selected {
    background-color: #8ab61d;
    border-color: #9ea10c;
    color: white;
  }
}

.main-class {
  margin-bottom: 30px;
  display: grid;
  gap: 1%;
  justify-content: space-between;
  grid-template-columns: 24% 24% 24% 24%;
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
