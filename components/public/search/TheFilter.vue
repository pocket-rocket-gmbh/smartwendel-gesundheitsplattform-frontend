<template>
  <div>
    <h2 class="is-dark-grey is-uppercase mb-4">Suche filtern</h2>
    <v-skeleton-loader :loading="loading" type="article" class="filter-wrapper">
      <div class="filter-tiles">
        <div v-for="filter in itemsForServiceList" class="filter-group">
          <div v-for="item in filter.next" class="mt-5 filter-selections">
            <span v-if="item.next.length" class="text-h5">{{ item.title }}</span>
            <v-row no-gutters class="mt-3 fill-height mr-1">
              <v-col
                cols="12"
                md="6"
                class="align-center column-items pr-1 pt-1"
                v-for="subItem in item.next"
                v-auto-animate
              >
                <div
                  class="filter-tile"
                  :class="{ selected: isSelectedTagNext(subItem) || expandedItemIds.includes(subItem.id) }"
                  @click="toggleSelection(subItem)"
                >
                  {{ subItem.title }}
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
    <div>
      <v-btn
        prepend-icon="mdi-trash-can-outline"
        size="small"
        class="mt-4"
        variant="text"
        color="secondary"
        rounded="pill"
        @click="emitResetFilter"
      >
        Alle Filter löschen
      </v-btn>
      <v-btn
        v-if="useUser().loggedIn()"
        prepend-icon="mdi-content-copy"
        size="small"
        class="mt-4"
        variant="text"
        color="primary"
        rounded="pill"
        @click="copySearchFilterUrl"
      >
        Such-Filter kopieren
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import { Facility, FilterKind, useFilterStore } from "~/store/searchFilter";
import { ResultStatus } from "~/types/serverCallResult";
import { CollapsibleListItem } from "../../../types/collapsibleList";

const props = defineProps<{
  filterKind: FilterKind;
}>();

const filterStore = useFilterStore();
const snackbar = useSnackbar();

const loading = ref(false);

const itemsForServiceList = ref<CollapsibleListItem[]>([]);
const expandedItemIds = ref([]);

const api = useCollectionApi();
api.setBaseApi(usePublicApi());
api.setEndpoint("tag_categories");

type FilterResponse = {
  id: string;
  name: string;
  menu_order: number;
};

const getItemsAndNext = async (filter: FilterResponse, arrayToAdd: CollapsibleListItem[], layer: number) => {
  api.setEndpoint(`tag_categories?parent_id=${filter.id}`);
  const options = {
    page: 1,
    per_page: 999,
    sort_by: "menu_order",
    sort_order: "asc",
    searchQuery: null as any,
    concat: false,
    filters: [] as any,
  };

  const filterItem: CollapsibleListItem = {
    id: filter.id,
    title: filter.name,
    menuOrder: filter.menu_order,
    layer,
    // additionalData: layer === 0 && {
    //   type: "api",
    //   endpoint: `tag_categories/${filter.id}`,
    //   path: "resource.kind",
    // },
    // canAddAdditionalData: layer === 0,
    next: [],
  };

  arrayToAdd.push(filterItem);

  const response = await api.retrieveCollection(options);
  if (response.status === ResultStatus.FAILED) {
    console.error(response);
    throw "Api failure";
  }
  const filterItems: FilterResponse[] = response?.data?.resources;
  if (!filterItems) {
    console.error("No filterItems!");
    return false;
  }

  const nextLayerWave: any[] = filterItems.map((filterItemFromResponse) =>
    getItemsAndNext(filterItemFromResponse, filterItem.next || [], layer + 1)
  );
  return Promise.all(nextLayerWave);
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

  const filters: any[] = result?.data?.resources?.filter((item: Facility) => props.filterKind === item.kind); // Filter items for current kind (event/facility/news/course) // hereeeeee!!!!
  if (!filters) {
    console.error("No filters!");
    return;
  }

  const serviceFilters = filters.filter((filter) => filter.filter_type === "filter_service");

  const tmpItemsForServiceList: CollapsibleListItem[] = [];

  const nextLayerWavePromisesService = serviceFilters.map((filter) =>
    getItemsAndNext(filter, tmpItemsForServiceList, 0)
  );
  await Promise.all([...nextLayerWavePromisesService]);

  itemsForServiceList.value = [...tmpItemsForServiceList];
};

filterStore.currentTags;

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

onMounted(async () => {
  loading.value = true;
  await getItems();
  loading.value = false;
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

.sub-filter {
  margin-top: 2rem;
}

.filter-sticky {
  position: sticky;
  top: 8rem;
}
</style>
