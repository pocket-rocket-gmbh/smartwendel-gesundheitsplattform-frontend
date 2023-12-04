<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ props }">
        <div v-bind="props">
          <div class="is-white d-flex align-end mt-10">
            <img class="filter-icon" :src="iconFilter">
          </div>
        </div>
      </template>
      <v-card>
        <v-toolbar dense fixed dark color="primary" class="modal-toolbar">
          <v-btn icon v-if="filterStore.currentTags?.length" @click="filterStore.currentTags = []">
            <v-icon>mdi-reload</v-icon>
          </v-btn>
          <v-toolbar-title class="d-flex justify-start">Leistung auswählen</v-toolbar-title>
          <v-btn v-if="filterStore.currentTags?.length" variant="text" @click="dialog = false"> Fertig </v-btn>
          <v-btn v-else variant="text" @click="dialog = false"> Schließen </v-btn>
        </v-toolbar>
        <div class="filter-tiles mt-5">
          <template v-if="!loading">
            <div v-for="filter in itemsForServiceList" class="filter-group">
              <div v-for="item in filter.next" class="filter-selections mt-10">
                <span v-if="item.next.length" class="text-h4 d-flex justify-center is-dark-grey">{{ item.title }}</span>
                <v-row no-gutters class="fill-height item-row">
                  <v-col
                    cols="12"
                    md="6"
                    class="align-center column-items"
                    v-for="subItem in item.next"
                    v-auto-animate
                  >
                    <div
                      class="filter-tile pa-5 word-break general-font-size"
                      lang="de"
                      :class="{
                        selected:
                          isSelectedTagNext(subItem) ||
                          expandedItemIds.includes(subItem.id),
                      }"
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
          </template>
          <LoadingSpinner v-else> Filter werden geladen ... </LoadingSpinner>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import { Facility, FilterKind, useFilterStore } from "~/store/searchFilter";
import { ResultStatus } from "~/types/serverCallResult";
import { CollapsibleListItem } from "../../../types/collapsibleList";
import iconFilter from "@/assets/icons/icon_filter.svg";

const props = defineProps<{
  filterKind: FilterKind;
}>();

const filterStore = useFilterStore();

const dialog = ref(false);
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
  parent_id: string;
};

const getItemsAndNext = (
  filter: FilterResponse,
  arrayToAdd: CollapsibleListItem[],
  layer: number,
  allFilters: FilterResponse[]
) => {
  if (layer === 4) {
    return;
  }

  const filterItem: CollapsibleListItem = {
    id: filter.id,
    title: filter.name,
    menuOrder: filter.menu_order,
    layer,
    next: [],
  };

  arrayToAdd.push(filterItem);

  const childFilterItems: FilterResponse[] = allFilters.filter(
    (item) => item.parent_id === filter.id
  );

  if (!childFilterItems.length) {
    return;
  }

  childFilterItems.forEach((childFilterItem) =>
    getItemsAndNext(childFilterItem, filterItem.next || [], layer + 1, allFilters)
  );
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

  const filters: any[] = result?.data?.resources?.filter(
    (item: Facility) => props.filterKind === item.kind
  );
  if (!filters) {
    console.error("No filters!");
    return;
  }

  const serviceFilters = filters.filter(
    (filter) => filter.filter_type === "filter_service"
  );
  const allFilters = await getAllFilters();

  const tmpItemsForServiceList: CollapsibleListItem[] = [];

  serviceFilters.forEach((filter) =>
    getItemsAndNext(filter, tmpItemsForServiceList, 0, allFilters)
  );

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
    const index = expandedItemIds.value.findIndex(
      (expandedItemId) => expandedItemId === item.id
    );

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

onMounted(async () => {
  loading.value = true;
  await getItems();
  loading.value = false;
});
</script>

<style lang="scss">
@import "@/assets/sass/main.sass";

.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}

.more-filters {
  display: flex;
  align-items: center;
}

.filter-tiles {
  padding: 0.5rem;

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    flex: 1;

    .filter-selections {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .item-row {
        gap: 0.5rem;

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

            &.selected {
              background-color: #8ab61d;
              border-color: #9ea10c;
              color: white;
            }
          }
        }
      }
    }
  }
}
.filter-icon {
  width: 30px;
}
.modal-toolbar {
  position: fixed;
  z-index: 99;
}
</style>
