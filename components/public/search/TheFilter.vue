<template>
  <div>
    <div class="mb-6" v-if="filterStore.currentFacilityTags?.length || filterStore.currentServiceTags?.length || filterStore.currentZips?.length || filterStore.mapFilter?.length">
      <div class="general-font-size font-weight-medium is-dark-grey mb-1">
        Deine ausgewählten Filter:
      </div>
      <div v-if="filterStore.mapFilter">
        <h2>Karte</h2>
        <v-chip
          color="white"
          close-icon="mdi-delete"
          @click:close="deselectFacilityInMap()"
          closable
          class="selected-tags mr-2 pa-4 mb-2 general-font-size"
        >
          {{ cutFacilityName(filterStore.mapFilterName) }}
        </v-chip>
        <v-divider class="my-3"></v-divider>
      </div>
      <div v-if="filterStore.currentZips?.length">
        <h2>Gemeinde:</h2>
        <span v-for="community in filterStore.currentZips"  :key="community">
            <v-chip
            color="white"
            close-icon="mdi-delete"
            @click:close="filterStore.currentZips = filterStore.currentZips.filter((zip) => zip !== community)"
            closable
            class="selected-tags mr-2 pa-4 mb-2 general-font-size"
          >
          {{ getAllSelectedCommunitiesName([community]).join(' ') }} 

          </v-chip>
        </span>
        <v-divider class="my-3"></v-divider>
      </div>
      <div v-for="(tags, parentName) in groupedTags" :key="parentName">
        <h2>{{ parentName }} ({{ (tags as Array<any>).length }})</h2>
        <span
          v-if="Array.isArray(tags)"
          v-for="(tag, index) in (tags as Array<any>).slice(0, 3)"
          :key="tag.id"
        >
          <v-chip
            color="white"
            close-icon="mdi-delete"
            @click:close="removeTagFromStore(tag)"
            closable
            class="selected-tags mr-2 pa-4 mb-2 general-font-size"
          >
          <span v-if="tag">
            {{ tag.name }}
          </span>
          <span v-else class="waiting general-font-size">
            <span>.</span><span>.</span><span>.</span>
          </span>
          </v-chip>
        </span>
        <span v-if="showAllTagsForParent === parentName">
          <v-chip
            v-for="(tag, index) in (tags as Array<any>).slice(3)"
            :key="tag.id"
            color="white"
            close-icon="mdi-delete"
            @click:close="removeTagFromStore(tag)"
            closable
            class="selected-tags mr-2 pa-4 mb-2 general-font-size break-title"
          >
            {{ tag.name }}
          </v-chip>
        </span>
        <div class="d-flex">
          <template v-if="tags && Array.isArray(tags) && (tags as Array<any>).length > 3">
            <v-btn
              variant="outlined"
              rounded="pill"
              color="primary"
              size="small"
              @click="showAllChips(parentName)"
            >
              <span v-if="showAllTagsForParent && showAllTagsForParent === parentName"
                >- {{ (tags as Array<any>).length ? (tags as Array<any>).length - 3 : 0 }}</span
              >
              <span v-else> + {{ (tags as Array<any>).length - 3 }}</span>
            </v-btn>
          </template>
        </div>
        <v-divider class="my-3"></v-divider>
      </div>
      <v-btn
        variant="outlined"
        rounded="pill"
        color="red"
        size="small"
        clas="mt-4"
        @click="removeAllTags"
      >
        <span>löschen</span>
      </v-btn>
    </div>
    <div>
      <span
        v-if="filterStore.filteredResults.length && !loading"
        class="general-font-size font-weight-medium is-dark-grey"
        >Verfeinere hier deine Suche:
      </span>
      <v-skeleton-loader v-if="appStore.loading" type="article" class="filter-wrapper"> </v-skeleton-loader>
        <div class="filter-tiles" v-else>
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
              <v-row no-gutters class="mt-3 fill-height mr-1 mt-n1"  >
                <v-col
                  cols="12"
                  lg="6"
                  md="12"
                  class="align-center column-items pr-1 pt-1"
                  v-for="subItem in item.next.filter((subItem) => parseInt(subItem.care_facilities_count) > 0)"
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
                    <span v-if="subItem.next.length">
                      <v-icon class="is-clickable" v-if=" expandedItemIds.includes(subItem.id)" size="x-large">mdi-menu-up</v-icon>
                      <span v-else>
                        <v-icon class="is-clickable" size="x-large">mdi-menu-down</v-icon>
                      </span>
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
                      v-model="filterStore.currentServiceTags"
                      :value="tag.id"
                    />
                  </div>
                </v-col>
              </v-row>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import {
  type Facility,
  type FilterKind,
  useFilterStore,
} from "~/store/searchFilter";
import { ResultStatus } from "~/types/serverCallResult";
import type { CollapsibleListItem } from "../../../types/collapsibleList";
import { useBreakpoints } from "~/composables/ui/breakPoints";
import { useAppStore } from "~/store/app";

const breakPoints = useBreakpoints();
const appStore = useAppStore();

const props = defineProps<{
  filterKind: FilterKind;
}>();

const filterStore = useFilterStore();

const loading = ref(false);

const removeTagFromStore = (tag: Facility) => {
  filterStore.currentFacilityTags = filterStore.currentFacilityTags.filter(
    (tagId:any) => tagId !== tag.id
  );
  filterStore.currentServiceTags = filterStore.currentServiceTags.filter(
    (tagId:any) => tagId !== tag.id
  );
};

const showAllTagsForParent = ref<string | null>(null);

const showAllChips = (parentName: string) => {
  showAllTagsForParent.value =
    showAllTagsForParent.value === parentName ? null : parentName;
};

const groupedTags = computed(() => {
  const tagGroups = {};

  getCurrentTags.value.forEach((tag: any) => {
    const parentName = typeof tag === "object" ? tag.parent_name : tag;
    // @ts-expect-error implicit any
    if (!tagGroups[parentName]) {
      // @ts-expect-error implicit any
      tagGroups[parentName] = [];
    }
    // @ts-expect-error implicit any
    tagGroups[parentName].push(tag);
  });

  return tagGroups;
});

const removeAllTags = () => {
  filterStore.currentFacilityTags = [];
  filterStore.currentServiceTags = [];
  filterStore.currentZips = [];
  filterStore.mapFilter = null;
  filterStore.mapFilterName = null;
};

const getCurrentTags = computed(() => {
  return [...(filterStore.currentServiceTags || []), ...(filterStore.currentFacilityTags || [])].map((tagId: any) => {
    const tag = filterStore.allFilters?.find((filter: any) => filter.id === tagId);
    const tagWithParent = filterStore.allFilters?.find((filter: any) => filter.id === tag?.parent_id);
    if (!tag) {
      return "";
    }
    return {
      id: tag.id,
      parent_id: tag.parent_id,
      parent_name: tagWithParent?.name,
      name: tag.name,
    };
  });
});

const availableItemsForServiceList = ref<CollapsibleListItem[]>([]);
const expandedItemIds = ref([]);

const api = useCollectionApi();
api.setBaseApi(usePublicApi());
api.setEndpoint("tag_categories");


const getAllSelectedCommunitiesName = (zips: string[]) => {
  if (!zips.length || !filterStore.allCommunities) return [];
  const allSelectedCommunities = filterStore.allCommunities.filter((community: any) =>
    zips.includes(community.zip)
  );
  return allSelectedCommunities.map((community: any) => community.name);
};


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
      (expandedItemId : any) => expandedItemId === item.id
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
      (id:any) => id !== item.id
    );
  } else {
    filterStore.currentServiceTags.push(item.id);
  }
};

const cutFacilityName = (facilityName: string) => {
  return facilityName.length > 30
    ? facilityName.slice(0, 30) + "..."
    : facilityName;
};

const deselectFacilityInMap = () => {
  filterStore.mapFilter = null;
  filterStore.mapFilterName = null;
  filterStore.loadAllResults();
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
  (newValue:any) => {
    availableItemsForServiceList.value = [
      ...deepToRaw(filterStore.allServiceTags),
    ];
    checkIfFiltersAreInFacilities(
      availableItemsForServiceList.value,
      newValue.map((facility : any) => facility.tag_category_ids).flat()
    );

    filterStore.loadAllFacilityFilters();
    emitFiltersUpdated();
  }, {
  deep: true
}
);

const emitFiltersUpdated = () => {
  useNuxtApp().$bus.$on("filtersUpdated", () => {
    availableItemsForServiceList.value = [
      ...deepToRaw(filterStore.allServiceTags),
    ];
    checkIfFiltersAreInFacilities(
      availableItemsForServiceList.value,
       filterStore.allResults.map((facility : any) => facility.tag_category_ids).flat()
    );
  });
};
 watch(()=> filterStore.allServiceTags, ()=> {
  availableItemsForServiceList.value = [
      ...deepToRaw(filterStore.allServiceTags),
    ];
    checkIfFiltersAreInFacilities(
      availableItemsForServiceList.value,
       filterStore.allResults.map((facility : any) => facility.tag_category_ids).flat()
    );
}, {
  deep: true
}) 

onMounted(async () => {
  emitFiltersUpdated();
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

.waiting span {
  animation-name: blink;
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  min-width: 300px;
}

.waiting span:nth-child(2) {
  animation-delay: 0.2s;
}

.waiting span:nth-child(3) {
  animation-delay: 0.4s;
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
