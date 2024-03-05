<template>
  <div>
    <h2>{{ name }}</h2>
     <v-btn elevation="0" variant="outlined" @click="openCreateDialog">{{ name }} erstellen</v-btn>
    <CollapsibleListRec
      :items="itemsForFacilityList"
      :layer="0"
      @entry-click="
        (action, itemIds, layer, title, additionalInformation, specialType) =>
          handleClick(action, itemIds, layer, title, additionalInformation, specialType, 'filter_facility')
      "
      @entry-moved="(itemsInCategory: CollapsibleListItem[], layer: number, startIndex: number, endIndex: number)=>handleMove(itemsInCategory, layer, startIndex, endIndex, 'filter_facility')"
      :disable-draggable="false"
    />
    <!-- TODO: Dragging might not work on sub-items because menu_oder is all over the place... Maybe just sort alphabetically? -->
    <CollapsibleListRec
      :items="itemsForServiceList"
      :layer="0"
      @entry-click="
        (action, itemIds, layer, title, additionalInformation, specialType) =>
          handleClick(action, itemIds, layer, title, additionalInformation, specialType, 'filter_service')
      "
      @entry-moved="(itemsInCategory: CollapsibleListItem[], layer: number, startIndex: number, endIndex: number)=>handleMove(itemsInCategory, layer, startIndex, endIndex, 'filter_service')"
      :disable-draggable="false"
    />

    <AdminTagsCreateEdit
      :item-id="itemId"
      v-if="createEditDialogOpen"
      :item-placeholder="itemPlaceholder"
      endpoint="tag_categories"
      @close="handleAddTagClose"
      :conceptName="name"
      :kind="filterKind"
    />

    <DeleteItem v-if="confirmDeleteDialogOpen" @close="handleItemDeleted" :item-id="itemId" :endpoint="deleteEndpoint" term="diesen Filter" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAdminStore } from "../../../store/admin";
import { useSnackbar } from "../../../composables/ui/snackbar";
import { useCollectionApi } from "../../../composables/api/collectionApi";
import { usePrivateApi } from "../../../composables/api/private";
import type { CollapsibleListItem, EmitAction } from "../../../types/collapsibleList";
import { ResultStatus } from "../../../types/serverCallResult";
import { type Facility, type FilterKind, type FilterTag, type FilterType, useFilterStore } from "../../../store/searchFilter";
import { filterKindToFilterScope } from "~/utils/filter.utils";

const props = defineProps<{
  filterKind: FilterKind;
  name: string;
}>();

const itemsForFacilityList = ref<CollapsibleListItem[]>([]);
const itemsForServiceList = ref<CollapsibleListItem[]>([]);
const adminStore = useAdminStore();

const deleteEndpoint = ref("tag_categories");

const itemPlaceholder = ref({
  name: "",
  scope: "care_facility",
  kind: props.filterKind,
});

const createEditDialogOpen = ref(false);
const confirmDeleteDialogOpen = ref(false);
const itemId = ref<string | null>(null);

const snackbar = useSnackbar();

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());
api.setEndpoint("tag_categories");

const openCreateDialog = (id: string) => {
  itemId.value = null;
  createEditDialogOpen.value = true;
};

const openDeleteDialog = (id: string) => {
  itemId.value = id;
  confirmDeleteDialogOpen.value = true;
};

type FilterResponse = {
  id: string;
  name: string;
  menu_order: number;
  kind: FilterKind;
  parent_id: string;
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
    care_facilities_count: "",
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
  adminStore.loading = true;
  const result = await api.retrieveCollection(options);
  adminStore.loading = false;
  if (result.status === ResultStatus.FAILED) {
    console.error(result);
    return;
  }

  const filters: any[] = result?.data?.resources?.filter((item: Facility) => props.filterKind === item.kind);
  //const filters: any[] = result?.data?.resources;
  if (!filters) {
    console.error("No filters!");
    return;
  }

  const facilityFilters = filters.filter((filter) => filter.filter_type === "filter_facility");
  const serviceFilters = filters.filter((filter) => filter.filter_type === "filter_service");

  const tmpItemsForFacilityList: CollapsibleListItem[] = [];
  const tmpItemsForServiceList: CollapsibleListItem[] = [];

  const allFilters = await useFilterStore().loadAllFilters();

  console.log(allFilters)

  facilityFilters.forEach((filter) => getItemsAndNext(filter, tmpItemsForFacilityList, 0, allFilters));
  serviceFilters.forEach((filter) => getItemsAndNext(filter, tmpItemsForServiceList, 0, allFilters));

  adminStore.loading = false;

  itemsForFacilityList.value = [...tmpItemsForFacilityList];
  itemsForServiceList.value = [...tmpItemsForServiceList];
};

const handleClick = async (action: EmitAction, itemIds: string[], layer: number, name: string, kind: string, specialType: string, filterType: FilterType) => {
  switch (action) {
    case "CREATE":
      return handleCreate(itemIds, layer, name, filterType, specialType);
    case "DELETE":
      return handleDelete(itemIds, layer, specialType);
    case "EDIT":
      return handleEdit(itemIds, layer, name, kind, specialType);
  }
};

const handleEdit = async (itemIds: string[], layer: number, name: string, kind: string, specialType: string) => {
  api.setEndpoint(`${specialType === "tag" ? "tags" : "tag_categories"}/${itemIds[0]}`);

  // Hint: Send kind or scope
  const result = await api.updateItem({ name, kind: props.filterKind }, "Erfolgreich aktualisiert");

  if (result.status === ResultStatus.SUCCESSFUL) {
    console.log("SUCCESS");
    getItems();
  } else {
    console.error("error");
  }
};

const handleCreate = async (itemIds: string[], layer: number, name: string, filterType: FilterType, specialType: string) => {
  if (specialType === "tag") {
    api.setEndpoint(`tags`);
    const res = await api.createItem({
      name,
      scope: filterKindToFilterScope(props.filterKind),
    });

    if (res.status === ResultStatus.SUCCESSFUL) {
      console.log("SUCCESS");
      getItems();
    } else {
      console.error("ERROR");
    }

    return;
  }

  api.setEndpoint(`tag_categories`);

  const result = await api.createItem({ name, parent_id: itemIds[0], filter_type: filterType }, `Erfolgreich erstellt`);

  if (result.status === ResultStatus.SUCCESSFUL) {
    console.log("SUCCESS");
    getItems();
  } else {
    console.error("ERROR");
  }
};

const handleDelete = async (itemIds: string[], layer: number, specialType: string) => {
  deleteEndpoint.value = specialType === "tag" ? "tags" : "tag_categories";
  openDeleteDialog(itemIds[0]);
};

const handleMove = async (itemsInFilter: CollapsibleListItem[], layer: number, startIndex: number, endIndex: number, filterType: FilterType) => {
  /**
   * TODO: Move fix again
   */

  if (startIndex === endIndex) return;

  const relevantListItems = filterType === "filter_facility" ? itemsForFacilityList : itemsForServiceList;

  const actualStartIndex = Math.min(startIndex, endIndex);
  const actualEndIndex = Math.max(startIndex, endIndex);

  const itemsToUpdate: any[] = [];

  if (layer === 0) {
    for (let newIndex = actualStartIndex; newIndex <= actualEndIndex; newIndex++) {
      const filter = relevantListItems.value.find((filter) => filter.id === itemsInFilter[newIndex].id);
      if (!filter) throw "Filter not found";
      itemsToUpdate.push(filter);
    }
  } else if (layer === 1) {
    const subFilters = relevantListItems.value.reduce((prev, curr) => {
      return [...prev, ...(curr.next || [])];
    }, [] as CollapsibleListItem[]);
    for (let newIndex = actualStartIndex; newIndex <= actualEndIndex; newIndex++) {
      const subFilter = subFilters.find((filter) => filter.id === itemsInFilter[newIndex].id);
      if (!subFilter) throw "SubFilter not found";
      itemsToUpdate.push(subFilter);
    }
  } else if (layer === 2) {
    const subFilters = relevantListItems.value.reduce((prev, curr) => {
      return [...prev, ...(curr.next || [])];
    }, [] as CollapsibleListItem[]);
    const subSubFilters = subFilters.reduce((prev, curr) => {
      return [...prev, ...(curr.next || [])];
    }, [] as CollapsibleListItem[]);
    for (let newIndex = actualStartIndex; newIndex <= actualEndIndex; newIndex++) {
      const subSubFilter = subSubFilters.find((filter) => filter.id === itemsInFilter[newIndex].id);
      if (!subSubFilter) throw "SubSubFilter not found";
      itemsToUpdate.push(subSubFilter);
    }
  }

  for (let i = 0; i < itemsToUpdate.length; i++) {
    const currentItem = itemsToUpdate[i];

    api.setEndpoint(`tag_categories/${currentItem.id}`);
    const result = await api.updateItem({ menu_order: actualStartIndex + i });

    if (result.status !== ResultStatus.SUCCESSFUL) {
      throw "Something went wrong while moving the items!";
    }
  }

  snackbar.showSuccess("Filter wurde erfolgreich verschoben");
};

const handleAddTagClose = () => {
  itemId.value = null;
  createEditDialogOpen.value = false;
  getItems();
};

const handleItemDeleted = () => {
  itemId.value = null;
  confirmDeleteDialogOpen.value = false;
  getItems();
};

onMounted(async () => {
  getItems();
});
</script>

<style lang="sass">
@import "@/assets/sass/main.sass"
</style>
