<template>
  <div>
    <h2>Bereiche</h2>

    <v-btn
      elevation="0"
      variant="outlined"
      @click="
        itemId = null;
        createEditDialogOpen = true;
      "
      >Neuer Bereich</v-btn
    >

    <CollapsibleListRec
      :items="itemsForList"
      :layer="0"
      @entry-click="handleClick"
      @edit-click="handleEditClick"
      @entry-moved="handleMove"
    />

    <!-- <DataTable
      :fields="fields"
      endpoint="categories"
      default-sort-order="asc"
      default-sort-by="menu_order"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      @openAddSubCategoriesDialog="openAddSubCategoriesDialog"
      ref="dataTable"
    /> -->

    <AdminCategoriesAddSubCategories
      v-if="addSubCategoriesDialogOpen"
      :category-id="itemId"
      @close="handleDialogClosed"
      @refreshCollection="useNuxtApp().$bus.$emit('triggerGetItems', null)"
    />

    <AdminCategoriesCreateEdit
      :item-id="itemId"
      v-if="createEditDialogOpen"
      @close="handleNewAreaAdded"
      :item-placeholder="itemPlaceholder"
      endpoint="categories"
      concept-name="Bereich"
    />

    <AdminSubSubCategoriesCreateEdit
      :item-id="itemId"
      v-if="createEditSubDialogOpen"
      :item-placeholder="itemPlaceholder"
      @close="handleSubCategoryClose"
      :endpoint="`categories/${itemId}/sub_categories/${subCategoryId}`"
      :overwrite-get-item-endpoint="`categories/${subSubCategoryId}`"
      :overwrite-update-item-endpoint="`categories/${subSubCategoryId}`"
      concept-name="Unter-Kategorien"
    />

    <DeleteItem
      v-if="confirmDeleteDialogOpen"
      @close="deleteItemComplete"
      :item-id="itemId"
      endpoint="categories"
      term="diesen Bereich"
    />
  </div>
</template>

<script setup lang="ts">
import { CollapsibleListItem, EmitAction } from "~/types/collapsibleList";
import { ResultStatus } from "~/types/serverCallResult";

definePageMeta({
  layout: "admin",
});

const itemsForList = ref<CollapsibleListItem[]>([]);

const fields = ref([
  { text: "Bereichsbezeichnung", value: "name", type: "string" },
  {
    text: "",
    value: "mdi-plus-circle-outline",
    type: "icon",
    emit: "openAddSubCategoriesDialog",
    tooltip: "Kategorien hinzufügen",
  },
]);

const dataTable = ref(null);
const createEditDialogOpen = ref(false);
const createEditSubDialogOpen = ref(false);
const confirmDeleteDialogOpen = ref(false);
const addSubCategoriesDialogOpen = ref(false);
const itemId = ref(null);
const subCategoryId = ref(null);
const subSubCategoryId = ref(null);
const snackbar = useSnackbar();

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());
api.setEndpoint("categories");

const currentCategories = ref<any[]>([]);
const currentSubCategories = ref<any[]>([]);
const currentSubSubCategories = ref<any[]>([]);

const loading = ref(false);

const itemPlaceholder = ref({
  name: "",
  scope: "care_facility",
});

const openCreateEditDialog = (id: string) => {
  itemId.value = id;
  createEditDialogOpen.value = true;
};

const openDeleteDialog = (id: string) => {
  itemId.value = id;
  confirmDeleteDialogOpen.value = true;
};

const openAddSubCategoriesDialog = (id: string) => {
  itemId.value = id;
  addSubCategoriesDialogOpen.value = true;
};

const handleDialogClosed = () => {
  dataTable.value.resetActiveItems();
  itemId.value = null;
  createEditDialogOpen.value = false;
  confirmDeleteDialogOpen.value = false;
  addSubCategoriesDialogOpen.value = false;
};

const getItems = async (endpoint = "categories") => {
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

  const categories: any[] = result?.data?.resources;
  if (!categories) {
    console.error("No categories!");
    return;
  }
  currentCategories.value = [...categories];

  const tmpItemsForList: CollapsibleListItem[] = [];

  for (const category of categories) {
    api.setEndpoint(`categories/${category.id}/sub_categories`);

    const categoryItem: CollapsibleListItem = {
      id: category.id,
      title: category.name,
      menuOrder: category.menu_order,
      addEntryButtonText: "Neue Kategorie hinzufügen",
      next: [],
    };

    tmpItemsForList.push(categoryItem);

    const res = await api.retrieveCollection(options);
    if (res.status === ResultStatus.FAILED) {
      console.error(result);
      continue;
    }

    const subCategories: any[] = res?.data?.resources;
    if (!subCategories) {
      console.error("No subCategories!");
      continue;
    }
    currentSubCategories.value = [...currentSubCategories.value, ...subCategories];

    for (const [index, subCategory] of subCategories.entries()) {
      api.setEndpoint(`categories/${category.id}/sub_categories/${subCategory.id}`);

      categoryItem.next.push({
        id: subCategory.id,
        title: subCategory.name,
        menuOrder: subCategory.menu_order,
        addEntryButtonText: "Neue Unter-Kategorie hinzufügen",
        additionalData: {
          type: "api",
          endpoint: `categories/${subCategory.id}`,
          path: "resource.description",
        },
        canAddAdditionalData: true,
        next: [],
      });

      const res = await api.retrieveCollection(options);
      if (res.status === ResultStatus.FAILED) {
        console.error(result);
        continue;
      }

      const subSubCategories: any[] = res?.data?.resources;
      if (!subSubCategories) {
        console.error("No subSubCategories!");
        continue;
      }
      currentSubSubCategories.value = [...currentSubSubCategories.value, ...subSubCategories];

      for (const subSubCategory of subSubCategories) {
        categoryItem.next[index].next.push({
          id: subSubCategory.id,
          title: subSubCategory.name,
          menuOrder: subSubCategory.menu_order,
          specialActionOnEditClick: "openSubCategoriesModal",
        });
      }
    }
  }

  itemsForList.value = tmpItemsForList;
};

const handleEditClick = (action: string, itemIds: string[], layer: number) => {
  if (action === "openSubCategoriesModal") {
    itemId.value = itemIds[2];
    subCategoryId.value = itemIds[1];
    subSubCategoryId.value = itemIds[0];
    createEditSubDialogOpen.value = true;
  }
};

const handleClick = async (
  action: EmitAction,
  itemIds: string[],
  layer: number,
  name: string,
  description?: string
) => {
  switch (action) {
    case "CREATE":
      return handleCreate(itemIds, layer, name, description);
    case "DELETE":
      return handleDelete(itemIds, layer);
    case "EDIT":
      return handleEdit(itemIds, layer, name, description);
  }
};

const handleEdit = async (itemIds: string[], layer: number, name: string, description?: string) => {
  api.setEndpoint(`categories/${itemIds[0]}`);

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

const handleCreate = async (itemIds: string[], layer: number, name: string, description?: string) => {
  if (layer === 0) {
    api.setEndpoint(`categories/${itemIds[0]}`);
  } else if (layer === 1) {
    api.setEndpoint(`categories/${itemIds[1]}/sub_categories/${itemIds[0]}`);
  } else {
    console.error("invalid layer");
    return;
  }

  const result = await api.createItem({ name, description, scope: "care_facility", tags: [] }, `Erfolgreich erstellt`);

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

const deleteItemComplete = () => {
  itemId.value = null;
  confirmDeleteDialogOpen.value = false;

  getItems();
};

const handleNewAreaAdded = () => {
  createEditDialogOpen.value = false;

  getItems();
};

const handleSubCategoryClose = () => {
  itemId.value = null;
  subCategoryId.value = null;
  subSubCategoryId.value = null;
  createEditSubDialogOpen.value = false;

  getItems();
};

const handleMove = async (
  itemsInCategory: CollapsibleListItem[],
  layer: number,
  startIndex: number,
  endIndex: number
) => {
  if (startIndex === endIndex) return;

  const actualStartIndex = Math.min(startIndex, endIndex);
  const actualEndIndex = Math.max(startIndex, endIndex);

  const itemsToUpdate: any[] = [];

  if (layer === 0) {
    for (let newIndex = actualStartIndex; newIndex <= actualEndIndex; newIndex++) {
      const category = currentCategories.value.find((category) => category.id === itemsInCategory[newIndex].id);
      if (!category) throw "Category not found";
      itemsToUpdate.push(category);
    }
  } else if (layer === 1) {
    for (let newIndex = actualStartIndex; newIndex <= actualEndIndex; newIndex++) {
      const subCategory = currentSubCategories.value.find((category) => category.id === itemsInCategory[newIndex].id);
      if (!subCategory) throw "SubCategory not found";
      itemsToUpdate.push(subCategory);
    }
  } else if (layer === 2) {
    for (let newIndex = actualStartIndex; newIndex <= actualEndIndex; newIndex++) {
      const subSubCategory = currentSubSubCategories.value.find(
        (category) => category.id === itemsInCategory[newIndex].id
      );
      if (!subSubCategory) throw "SubSubCategory not found";
      itemsToUpdate.push(subSubCategory);
    }
  }

  for (let i = 0; i < itemsToUpdate.length; i++) {
    const currentItem = itemsToUpdate[i];

    api.setEndpoint(`categories/${currentItem.id}`);
    const result = await api.updateItem({ menu_order: actualStartIndex + i }, null);

    if (result.status !== ResultStatus.SUCCESSFUL) {
      throw "Something went wrong while moving the items!";
    }
  }

  snackbar.showSuccess("Inhalt wurde erfolgreich verschoben");
};

onMounted(() => {
  getItems();
});
</script>
