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
            <img class="filter-icon" :src="iconFilter" />
          </div>
        </div>
      </template>
      <v-card>
        <v-toolbar dense fixed dark color="primary" class="modal-toolbar">
          <v-toolbar-title class="d-flex justify-start"
            >Leistung auswählen</v-toolbar-title
          >
          <v-btn variant="text" @click="dialog = false"> Fertig </v-btn>
        </v-toolbar>
        <div class="mt-12">
          <div v-for="filter in availableItemsForServiceList" class="">
            <div v-for="item in filter.next" class="mt-5">
              <span
                v-if="
                  item.next.length &&
                  item.next.reduce(
                    (acc, subItem) =>
                      acc + parseInt(subItem.care_facilities_count),
                    0
                  )
                "
                class="general-font-size font-weight-bold is-dark-grey ml-2"
                >{{ item.title }}</span
              >

              <div
                class="align-center filter-options d-flex pr-1 pt-1"
                v-for="subItem in item.next.filter(
                  (subItem) => parseInt(subItem.care_facilities_count) > 0
                )"
              >
                <div
                  v-if="subItem"
                  class="align-center"
                  :class="{
                    selected:
                      isSelectedTagNext(subItem) ||
                      expandedItemIds.includes(subItem.id),
                  }"
                >
                  <v-btn
                    @click.prevent="toggleSelection(subItem)"
                    hide-details
                    density="compact"
                    class="options-select general-font-size ma-2 text-none font-weight-light"
                    :class="{
                      'is-selected': filterStore.currentServiceTags.includes(
                        subItem.id
                      ),
                    }"
                  >
                    <span>
                      {{ subItem.title }}
                    </span>
                  </v-btn>

                  <span v-if="subItem.next.length">
                    <v-icon
                      class="is-clickable"
                      v-if="expandedItemIds.includes(subItem.id)"
                      size="x-large"
                      >mdi-menu-up</v-icon
                    >
                    <span v-else>
                      <v-icon class="is-clickable" size="x-large"
                        >mdi-menu-down</v-icon
                      >
                    </span>
                  </span>
                </div>

                <div
                  v-if="
                    subItem.next.length && expandedItemIds.includes(subItem.id)
                  "
                  class="tag-select"
                  v-for="tag in subItem.next"
                >
                  <v-divider></v-divider>
                  <v-checkbox
                    :class="{ selected: isSelected(tag.id) }"
                    class="mb-n4"
                    :label="tag.title"
                    v-model="filterStore.currentServiceTags"
                    :value="tag.id"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import {
  type Facility,
  type FilterKind,
  useFilterStore,
} from "~/store/searchFilter";
import { ResultStatus } from "~/types/serverCallResult";
import type { CollapsibleListItem } from "../../../types/collapsibleList";
import iconFilter from "@/assets/icons/icon_filter.svg";

const props = defineProps<{
  filterKind: FilterKind;
}>();

const filterStore = useFilterStore();

const dialog = ref(false);

const availableItemsForServiceList = ref<CollapsibleListItem[]>([]);
const expandedItemIds = ref([]);

const api = useCollectionApi();
api.setBaseApi(usePublicApi());
api.setEndpoint("tag_categories");

const isSelected = (itemId: string) => {
  return filterStore.currentServiceTags.includes(itemId);
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
      (expandedItemId: any) => expandedItemId === item.id
    );

    if (index === -1) {
      expandedItemIds.value.push(item.id);
    } else {
      expandedItemIds.value.splice(index, 1);
    }
    return;
  }

  if (isSelected(item.id)) {
    filterStore.currentServiceTags = filterStore.currentServiceTags.filter(
      (id: any) => id !== item.id
    );
  } else {
    filterStore.currentServiceTags.push(item.id);
  }
};

const checkIfFiltersAreInFacilities = (
  filters: CollapsibleListItem[],
  filterIdsInFacility: string[]
) => {
  filters = filters.filter((currentFilter) => {
    if (filterIdsInFacility.includes(currentFilter.id)) {
      return true;
    }

    if (currentFilter.next?.length) {
      currentFilter.next = checkIfFiltersAreInFacilities(
        currentFilter.next,
        filterIdsInFacility
      );
      return currentFilter.next.length;
    }

    return false;
  });
  return filters;
};

watch(
  () => filterStore.filteredResults,
  (newValue: any) => {
    availableItemsForServiceList.value = [
      ...deepToRaw(filterStore.allServiceTags),
    ];
    checkIfFiltersAreInFacilities(
      availableItemsForServiceList.value,
      newValue.map((facility: any) => facility.tag_category_ids).flat()
    );

    filterStore.loadAllFacilityFilters();
    emitFiltersUpdated();
  },
  {
    deep: true,
  }
);

const emitFiltersUpdated = () => {
  useNuxtApp().$bus.$on("filtersUpdated", () => {
    availableItemsForServiceList.value = [
      ...deepToRaw(filterStore.allServiceTags),
    ];
    checkIfFiltersAreInFacilities(
      availableItemsForServiceList.value,
      filterStore.allResults
        .map((facility: any) => facility.tag_category_ids)
        .flat()
    );
  });
};
watch(
  () => filterStore.allServiceTags,
  () => {
    availableItemsForServiceList.value = [
      ...deepToRaw(filterStore.allServiceTags),
    ];
    checkIfFiltersAreInFacilities(
      availableItemsForServiceList.value,
      filterStore.allResults
        .map((facility: any) => facility.tag_category_ids)
        .flat()
    );
  },
  {
    deep: true,
  }
);

onMounted(async () => {
  emitFiltersUpdated();
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
