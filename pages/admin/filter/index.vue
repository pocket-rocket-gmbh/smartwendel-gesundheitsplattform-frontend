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

    <CollapsibleListRec :items="itemsForList" :layer="0" @entry-click="handleClick" @entry-moved="handleMove" />

    <!-- <DataTable
      :fields="fields"
      endpoint="tags"
      default-sort-order="asc"
      default-sort-by="menu_order"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
    /> -->

    <AdminTagsCreateEdit
      :item-id="itemId"
      v-if="createEditDialogOpen"
      :item-placeholder="itemPlaceholder"
      endpoint="tags"
      @close="handleAddTagClose"
    />

    <DeleteItem
      v-if="confirmDeleteDialogOpen"
      @close="handleItemDeleted"
      :item-id="itemId"
      endpoint="tags"
      term="diesen Tag"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { CollapsibleListItem, EmitAction } from "~/types/collapsibleList";
import { ResultStatus } from "~/types/serverCallResult";

definePageMeta({
  layout: "admin",
});

const itemsForList = ref<CollapsibleListItem[]>([]);

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
const loading = ref(false);
const createEditDialogOpen = ref(false);
const confirmDeleteDialogOpen = ref(false);
const itemId = ref<string | null>(null);

const snackbar = useSnackbar();

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());
api.setEndpoint("tags");

const currentFilters = ref<any[]>([]);

const openCreateEditDialog = (id: string) => {
  itemId.value = id;
  createEditDialogOpen.value = true;
};

const openDeleteDialog = (id: string) => {
  itemId.value = id;
  confirmDeleteDialogOpen.value = true;
};

const getItems = async (endpoint = "tags") => {
  api.setEndpoint(endpoint);

  loading.value = true;
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
  loading.value = false;

  if (result.status === ResultStatus.FAILED) {
    console.error(result);
    return;
  }

  const filters: any[] = result?.data?.resources;
  if (!filters) {
    console.error("No filters!");
    return;
  }
  currentFilters.value = [...filters];

  const tmpItemsForList: CollapsibleListItem[] = [];

  currentFilters.value.forEach((filter) => {
    tmpItemsForList.push({
      id: filter.id,
      menuOrder: filter.menu_order,
      title: filter.name,
    });
  });

  itemsForList.value = tmpItemsForList;
};

const handleClick = async (action: EmitAction, itemIds: string[], layer: number, name: string) => {
  switch (action) {
    case "CREATE":
      return handleCreate(itemIds, layer, name);
    case "DELETE":
      return handleDelete(itemIds, layer);
    case "EDIT":
      return handleEdit(itemIds, layer, name);
  }
};

const handleEdit = async (itemIds: string[], layer: number, name: string, description?: string) => {
  api.setEndpoint(`tags/${itemIds[0]}`);

  const result = await api.updateItem(
    { name, description, scope: "care_facility", tags: [] },
    "Erfolgreich aktualisiert"
  );

  if (result.status === ResultStatus.SUCCESSFUL) {
    console.log("SUCCESS");
    getItems();
  } else {
    console.error("error");
  }
};

const handleCreate = async (itemIds: string[], layer: number, name: string) => {
  api.setEndpoint(`tags/${itemIds[0]}`);

  const result = await api.createItem({ name, scope: "care_facility" }, `Erfolgreich erstellt`);

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
  if (startIndex === endIndex) return;

  const itemsToUpdate: any[] = [];
  const actualStartIndex = Math.min(startIndex, endIndex);
  const actualEndIndex = Math.max(startIndex, endIndex);

  for (let newIndex = actualStartIndex; newIndex <= actualEndIndex; newIndex++) {
    const filter = currentFilters.value.find((filter) => filter.id === itemsInFilter[newIndex].id);
    if (!filter) throw "filter not found";
    itemsToUpdate.push(filter);
  }

  for (let i = 0; i < itemsToUpdate.length; i++) {
    const currentItem = itemsToUpdate[i];

    api.setEndpoint(`tags/${currentItem.id}`);
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
