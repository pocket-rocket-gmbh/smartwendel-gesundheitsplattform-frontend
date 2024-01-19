<template>
  <div>
    <div class="mb-6">
      <div
        v-if="filterStore.currentTags?.length"
        class="general-font-size font-weight-medium is-dark-grey mb-1"
        >Deine ausgewählten Filter:
      </div>
      <v-chip color="white" close-icon="mdi-delete" @click:close="removeTagFromStore(tag)" closable class="selected-tags mr-2 pa-4 mb-2 general-font-size" v-for="tag in getCurrentTags" :key="tag.id">{{ tag.name }}</v-chip>
    </div>
    <div>
      <span
        v-if="filterStore.filteredResults.length"
        class="general-font-size font-weight-medium is-dark-grey"
        >Verfeinere hier deine Suche:
      </span>
      <v-skeleton-loader :loading="loading" type="article" class="filter-wrapper">
        <div class="filter-tiles">
          <div v-for="filter in availableItemsForServiceList" class="filter-group">
            <div v-for="item in filter.next" class="mt-5 filter-selections">
              <span
                v-if="
                  item.next.length &&
                  item.next.reduce(
                    (acc, subItem) => acc + parseInt(subItem.care_facilities_count),
                    0
                  )
                "
                class="general-font-size font-weight-bold is-dark-grey"
                :class="[breakPoints.width.value <= 1280 ? 'd-flex justify-center' : '']"
                >{{ item.title }}</span
              >
              <v-row no-gutters class="mt-3 fill-height mr-1 mt-n1">
                <v-col
                  cols="12"
                  lg="6"
                  md="12"
                  class="align-center column-items pr-1 pt-1"
                  v-for="subItem in item.next"
                  v-auto-animate
                >
                  <div
                    v-if="subItem"
                    class="filter-tile"
                    :class="{
                      selected:
                        isSelectedTagNext(subItem) ||
                        expandedItemIds.includes(subItem.id),
                    }"
                    @click="toggleSelection(subItem)"
                  >
                    <span class="word-break sub-item-title general-font-size" lang="de">
                      {{ subItem.title }}
                    </span>
                  </div>
                  <div
                    v-if="subItem.next.length && expandedItemIds.includes(subItem.id)"
                    class="tag-select"
                    v-for="tag in subItem.next"
                  >
                    <v-divider></v-divider>
                    <v-checkbox
                      :class="{ selected: isSelected(tag.id) }"
                      class="mb-n4"
                      :label="tag.title"
                      v-model="filterStore.currentTags"
                      :value="tag.id"
                    />
                  </div>
                </v-col>
              </v-row>
            </div>
          </div>
        </div>
      </v-skeleton-loader>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Facility, type FilterKind, useFilterStore } from "~/store/searchFilter";
import { ResultStatus } from "~/types/serverCallResult";
import type { CollapsibleListItem } from "../../../types/collapsibleList";
import { useBreakpoints } from "~/composables/ui/breakPoints";

const breakPoints = useBreakpoints();

const props = defineProps<{
  filterKind: FilterKind;
}>();

const filterStore = useFilterStore();
const snackbar = useSnackbar();

const loading = ref(false);


const removeTagFromStore = (tag: Facility) => {
  filterStore.currentTags = filterStore.currentTags.filter((tagId) => tagId !== tag.id);
};

const getCurrentTags = computed(() => {
  return filterStore.currentTags.map((tagId) => {
    const tag = filterStore.allFilters.find((filter) => filter.id === tagId);
    if (!tag) {
      return "";
    }
    return tag;
  });
});

const itemsForServiceList = ref<CollapsibleListItem[]>([]);
const availableItemsForServiceList = ref<CollapsibleListItem[]>([]);
const expandedItemIds = ref([]);

const api = useCollectionApi();
api.setBaseApi(usePublicApi());
api.setEndpoint("tag_categories");

type FilterResponse = {
  id: string;
  name: string;
  menu_order: number;
  parent_id: string;
  care_facilities_count: string;
};

const getItemsAndNext = (filter: FilterResponse, arrayToAdd: CollapsibleListItem[], layer: number, allFilters: FilterResponse[]) => {
  if (layer === 4) {
    return;
  }

  const filterItem: CollapsibleListItem = {
    id: filter.id,
    title: filter.name,
    menuOrder: filter.menu_order,
    layer,
    next: [],
    care_facilities_count: filter.care_facilities_count,
  };

  arrayToAdd.push(filterItem);

  const childFilterItems: FilterResponse[] = allFilters.filter((item) => item.parent_id === filter.id);

  if (!childFilterItems.length) {
    return;
  }

  childFilterItems.forEach((childFilterItem) => getItemsAndNext(childFilterItem, filterItem.next || [], layer + 1, allFilters));
};

const getItems = async () => {
  api.setEndpoint(`tag_categories`);

  const options = {
    page: 1,
    per_page: 999,
    sort_by: "menu_order",
    sort_order: "asc",
    searchQuery: null as any,
    concat: false,
    filters: [] as any,
  };

  const result = await api.retrieveCollection(options);

  if (result.status === ResultStatus.FAILED) {
    console.error(result);
    return;
  }

  const filters: any[] = result?.data?.resources?.filter((item: Facility) => props.filterKind === item.kind);
  if (!filters) {
    console.error("No filters!");
    return;
  }

  const serviceFilters = filters.filter((filter) => filter.filter_type === "filter_service");
  const allFilters = await filterStore.loadAllFilters();

  const tmpItemsForServiceList: CollapsibleListItem[] = [];

  serviceFilters.forEach((filter) => getItemsAndNext(filter, tmpItemsForServiceList, 0, allFilters));

  itemsForServiceList.value = [...tmpItemsForServiceList];
};

const isSelected = (itemId: string) => {
  return filterStore.currentTags.includes(itemId);
};

const isSelectedTagNext = (tag: CollapsibleListItem) => {
  if (tag.next?.length) {
    return tag.next.some((subTag) => isSelected(subTag.id));
  }
  return isSelected(tag.id);
};

const toggleSelection = (item: CollapsibleListItem) => {
  if (item.next?.length) {
    const index = expandedItemIds.value.findIndex((expandedItemId) => expandedItemId === item.id);

    if (index === -1) {
      expandedItemIds.value.push(item.id);
    } else {
      expandedItemIds.value.splice(index, 1);
    }
    return;
  }

  if (isSelected(item.id)) {
    filterStore.currentTags = filterStore.currentTags.filter((id) => id !== item.id);
  } else {
    filterStore.currentTags.push(item.id);
  }
};

const emitResetFilter = () => {
  filterStore.clearSearch();
};

const copySearchFilterUrl = () => {
  snackbar.showSuccess("Filter in Zwischenablage gespeichert!");
  const url = filterStore.getUrlQuery();
  navigator.clipboard.writeText(url);
};

const checkIfFiltersAreInFacilities = (filters: CollapsibleListItem[], filterIdsInFacility: string[]) => {
  filters = filters.filter((currentFilter) => {
    if (filterIdsInFacility.includes(currentFilter.id)) {
      return true;
    }

    if (currentFilter.next?.length) {
      currentFilter.next = checkIfFiltersAreInFacilities(currentFilter.next, filterIdsInFacility);
      return currentFilter.next.length;
    }

    return false;
  });

  return filters;
};

onMounted(async () => {
  loading.value = true;
  await getItems();
  loading.value = false;

  availableItemsForServiceList.value = [...deepToRaw(itemsForServiceList.value)];

  useNuxtApp().$bus.$on("filtersUpdated", () => {
    availableItemsForServiceList.value = [...deepToRaw(itemsForServiceList.value)];
    checkIfFiltersAreInFacilities(availableItemsForServiceList.value, filterStore.allResults.map((facility) => facility.tag_category_ids).flat());
  });
});
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

.filter-wrapper {
  display: flex;
  justify-content: stretch;
}

.filter-tiles {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  padding: 0;

  .filter-group {
    flex: 1;
  }

  .column-items {
    .filter-tile {
      place-items: center;
      text-align: center;
      display: flex;
      justify-content: center !important;
      cursor: pointer;
      width: inherit;
      flex: 1 auto;
      border-radius: 0.5rem;
      border: 1px solid #ddd;
      background-color: white;
      max-height: 100px;
      min-height: 100px;
      padding: 0.5rem;
      word-break: break-all;

      &:hover,
      &.selected {
        background-color: #8ab61d;
        border-color: #9ea10c;
        color: white;
      }
    }
  }
}

.selected-tags {
  background-color: $primary-color;
}

.sub-filter {
  margin-top: 2rem;
}

.sub-item-title {
  line-height: 27px;
}

.filter-sticky {
  position: sticky;
  top: 8rem;
}
</style>
