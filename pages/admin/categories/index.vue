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

    <CollapsibleListRec :items="itemsForList" :layer="0" @add-entry-click="handleEmit" />

    <!-- <CollapsibleList
      :fields="fields"
      endpoint="categories"
      default-sort-order="asc"
      default-sort-by="menu_order"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      @openAddSubCategoriesDialog="openAddSubCategoriesDialog"
      ref="dataTable"
    />  -->

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
      @close="createEditDialogOpen = false"
      :item-placeholder="itemPlaceholder"
      endpoint="categories"
      concept-name="Bereich"
    />

    <DeleteItem
      v-if="confirmDeleteDialogOpen"
      @close="
        itemId = null;
        confirmDeleteDialogOpen = false;
      "
      :item-id="itemId"
      endpoint="categories"
      term="diesen Bereich"
    />
  </div>
</template>

<script setup lang="ts">
import { CollapsibleFieldItem, CollapsibleListItem } from "~/types/collapsibleList";

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
const items = api.items;

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

const getItems = async () => {
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
  await api.retrieveCollection(options);
  loading.value = false;

  itemsForList.value = items.value.map((item) => {
    return {
      id: item.id,
      title: item.name,
      next: item.sub_categories.map((subCategory: any) => {
        return {
          id: subCategory.id,
          title: subCategory.name,
          additionalData: {
            type: "api",
            endpoint: `categories/${subCategory.id}`,
            paths: ["resource.description"],
          },
          next: subCategory.sub_sub_categories.map((subSubCategory: any) => {
            return { id: subSubCategory.id, title: subSubCategory.name };
          }),
        };
      }),
    };
  });

  console.log(items.value);
};

const handleEmit = (itemIds: string[], layer: number) => {
  console.log(itemIds, layer);
};

onMounted(() => {
  getItems();
});
</script>
