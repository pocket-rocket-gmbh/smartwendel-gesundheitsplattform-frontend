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

    <CollapsibleListRec :items="itemsForList" :layer="0" @entry-click="handleClick" />

    <DataTable
      :fields="fields"
      endpoint="categories"
      default-sort-order="asc"
      default-sort-by="menu_order"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      @openAddSubCategoriesDialog="openAddSubCategoriesDialog"
      ref="dataTable"
    />

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
import { CollapsibleFieldItem, CollapsibleListItem, EmitAction } from "~/types/collapsibleList";
import { ResultStatus } from "~/types/serverCallResult";

definePageMeta({
  layout: "admin",
});

const itemsForList = ref<CollapsibleListItem[]>([]);

const fields = ref<CollapsibleFieldItem[]>([
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
const confirmDeleteDialogOpen = ref(false);
const addSubCategoriesDialogOpen = ref(false);
const itemId = ref(null);

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());
api.setEndpoint("categories");

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

  itemsForList.value = [];
  /**
   * TODO
   * 1. Bilder-Button für ganz unten
   * 2. Move per DragNDrop
   * const move = async (entry, nextEntry) => {
  let endpoint = props.overwriteMoveEndpoint;
  if (!props.overwriteMoveEndpoint) {
    endpoint = props.endpoint;
  }

  const result = await useTableMove().move(entry, nextEntry, endpoint);
  if (result) {
    getItems();
  }
};
  3. Loading indicator/Skeleton for entries/categories
   */

  for (const category of categories) {
    api.setEndpoint(`categories/${category.id}/sub_categories`);

    const categoryItem: CollapsibleListItem = {
      id: category.id,
      title: category.name,
      addEntryButtonText: "Neue Kategorie hinzufügen",
      next: [],
    };

    itemsForList.value.push(categoryItem);

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

    for (const [index, subCategory] of subCategories.entries()) {
      api.setEndpoint(`categories/${category.id}/sub_categories/${subCategory.id}`);

      categoryItem.next.push({
        id: subCategory.id,
        title: subCategory.name,
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

      for (const subSubCategory of subSubCategories) {
        categoryItem.next[index].next.push({
          id: subSubCategory.id,
          title: subSubCategory.name,
          // TODO: Add images button
        });
      }
    }
  }

  // itemsForList.value = items.map((item) => {
  //   console.log(item);
  //   return {
  //     id: item.id,
  //     title: item.name,
  //     addEntryButtonText: "Neue Kategorie hinzufügen",
  //     next: item.sub_categories.map((subCategory: any) => {
  //       return {
  //         id: subCategory.id,
  //         title: subCategory.name,
  //         addEntryButtonText: "Neue Unter-Kategorie hinzufügen",
  //         additionalData: {
  //           type: "api",
  //           endpoint: `categories/${subCategory.id}`,
  //           path: "resource.description",
  //         },
  //         canAddAdditionalData: true,
  //         next: subCategory.sub_sub_categories.map((subSubCategory: any) => {
  //           return {
  //             id: subSubCategory.id,
  //             title: subSubCategory.name,
  //           };
  //         }),
  //       };
  //     }),
  //   };
  // });
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
  console.log(result);

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

onMounted(() => {
  getItems();
});
</script>
