<template>
  <div>
    <h2>Filter</h2>
    <v-btn
      elevation="0"
      variant="outlined"
      @click="
        itemId = null;
        createEditDialogOpen = true;
      "
      >Filter erstellen</v-btn
    >
    <v-alert type="info" density="compact" closable class="mt-2"
      >Filter erleichtern den Besuchern die Auffindbarkeit von Inhalten, Beispiele können zielgruppenspezifische Tags
      wie z.B. nach Alter oder Geschlecht sein.</v-alert
    >

    <CollapsibleListRec :items="itemsForList" :layer="0" @entry-click="handleClick" @entry-moved="handleMove" :disable-draggable="true"/>

    <AdminTagsCreateEdit
      :item-id="itemId"
      v-if="createEditDialogOpen"
      :item-placeholder="itemPlaceholder"
      endpoint="tag_categories"
      @close="handleAddTagClose"
      conceptName="Filter"
    />

    <DeleteItem
      v-if="confirmDeleteDialogOpen"
      @close="handleItemDeleted"
      :item-id="itemId"
      endpoint="tag_categories"
      term="diesen Filter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAdminStore } from "~/store/admin";
import { CollapsibleListItem, EmitAction } from "~/types/collapsibleList";
import { ResultStatus } from "~/types/serverCallResult";

definePageMeta({
  layout: "admin",
});

const itemsForList = ref<CollapsibleListItem[]>([]);
const adminStore = useAdminStore();

const fields = ref([
  { text: "", type: "move_down" },
  { text: "", type: "move_up" },
  { text: "Name", value: "name", type: "string" },
]);

const itemPlaceholder = ref({
  name: "",
  scope: "care_facility",
});

const dialog = ref(false);
const item = ref({ name: "" });
const createEditDialogOpen = ref(false);
const confirmDeleteDialogOpen = ref(false);
const itemId = ref<string | null>(null);

const snackbar = useSnackbar();

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());
api.setEndpoint("tag_categories");

const openCreateEditDialog = (id: string) => {
  itemId.value = id;
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
    getItemsAndNext(filterItemFromResponse, filterItem.next, layer + 1)
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
  adminStore.loading = true;
  const result = await api.retrieveCollection(options);

  if (result.status === ResultStatus.FAILED) {
    console.error(result);
    return;
  }

  const filters: any[] = result?.data?.resources;
  if (!filters) {
    console.error("No filters!");
    return;
  }

  const tmpItemsForList: CollapsibleListItem[] = [];

  const nextLayerWave = filters.map((filter) => getItemsAndNext(filter, tmpItemsForList, 0));
  await Promise.all(nextLayerWave);

  adminStore.loading = false;
  itemsForList.value = tmpItemsForList;
};

const handleClick = async (action: EmitAction, itemIds: string[], layer: number, name: string, kind: string) => {
  switch (action) {
    case "CREATE":
      return handleCreate(itemIds, layer, name);
    case "DELETE":
      return handleDelete(itemIds, layer);
    case "EDIT":
      return handleEdit(itemIds, layer, name, kind);
  }
};

const handleEdit = async (itemIds: string[], layer: number, name: string, kind: string) => {
  api.setEndpoint(`tag_categories/${itemIds[0]}`);

  const result = await api.updateItem({ name, kind }, "Erfolgreich aktualisiert");

  if (result.status === ResultStatus.SUCCESSFUL) {
    console.log("SUCCESS");
    getItems();
  } else {
    console.error("error");
  }
};

const handleCreate = async (itemIds: string[], layer: number, name: string) => {
  api.setEndpoint(`tag_categories`);

  const result = await api.createItem({ name, parent_id: itemIds[0] }, `Erfolgreich erstellt`);

  if (result.status === ResultStatus.SUCCESSFUL) {
    console.log("SUCCESS");
    getItems();
  } else {
    console.error("ERROR");
  }
};

const handleDelete = async (itemIds: string[], layer: number) => {
  openDeleteDialog(itemIds[0]);
};

const handleMove = async (
  itemsInFilter: CollapsibleListItem[],
  layer: number,
  startIndex: number,
  endIndex: number
) => {
  /**
   * TODO: Move fix again
   */

  if (startIndex === endIndex) return;

  const actualStartIndex = Math.min(startIndex, endIndex);
  const actualEndIndex = Math.max(startIndex, endIndex);

  const itemsToUpdate: any[] = [];

  if (layer === 0) {
    for (let newIndex = actualStartIndex; newIndex <= actualEndIndex; newIndex++) {
      const filter = itemsForList.value.find((filter) => filter.id === itemsInFilter[newIndex].id);
      if (!filter) throw "Filter not found";
      itemsToUpdate.push(filter);
    }
  } else if (layer === 1) {
    const subFilters = itemsForList.value.reduce((prev, curr) => {
      return [...prev, ...curr.next];
    }, [] as CollapsibleListItem[]);
    for (let newIndex = actualStartIndex; newIndex <= actualEndIndex; newIndex++) {
      const subFilter = subFilters.find((filter) => filter.id === itemsInFilter[newIndex].id);
      if (!subFilter) throw "SubFilter not found";
      itemsToUpdate.push(subFilter);
    }
  } else if (layer === 2) {
    const subFilters = itemsForList.value.reduce((prev, curr) => {
      return [...prev, ...curr.next];
    }, [] as CollapsibleListItem[]);
    const subSubFilters = subFilters.reduce((prev, curr) => {
      return [...prev, ...curr.next];
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
    const result = await api.updateItem({ menu_order: actualStartIndex + i }, null);

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
