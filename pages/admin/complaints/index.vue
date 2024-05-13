<template>
  <div>
    <div class="general-font-size is-dark-grey font-weight-bold">Beschwerde</div>
  </div>

  <DataTable
    ref="dataTableRef"
    :fields="fields"
    endpoint="tooltips"
    @openCreateEditDialog="openCreateEditDialog"
    @openDeleteDialog="openDeleteDialog"
    defaultSortBy="created_at"
    :disable-delete="false"
    :noBar="true"
    @close="handleCreateEditClose"
  />

  <AdminComplaintsCreateEdit
    v-if="createEditDialogOpen"
    @close="
      itemId = null;
      createEditDialogOpen = false;
      itemId = null;
      dataTableRef?.resetActiveItems();
    "
    @refreshCollection="
      dataTableRef?.resetActiveItems();
      getItems();
      itemId = null;
      createEditDialogOpen = false;
      itemId = null;
      dataTableRef?.resetActiveItems();
    "
  />

  <DeleteItem
    v-if="confirmDeleteDialogOpen"
    @close="
      itemId = null;
      confirmDeleteDialogOpen = false;
      dataTableRef?.resetActiveItems();
    "
    :item-id="itemId"
    endpoint="users"
    term="diesen Benutzer"
  />
</template>
<script lang="ts" setup>
import { ref } from "vue";

definePageMeta({
  layout: "admin",
});

const fields = [
  { prop: "name", text: "Titel", value: "name", type: "string" },
  { prop: "name", text: "Inhalt URL", value: "name", type: "string" },
  {
    prop: "created_at",
    text: "Erstellt am",
    value: "created_at",
    type: "datetime",
  },
  { prop: "name", text: "Name", value: "name", type: "string" },
  { prop: "name", text: "E-Mail", value: "name", type: "string" },
];

const itemId = ref(null);
const createEditDialogOpen = ref(false);
const confirmDeleteDialogOpen = ref(false);
const loading = ref(false);
const dataTableRef = ref();
const filter = ref({
  page: 1,
  per_page: 1000,
  sort_by: "created_at",
  sort_order: "DESC",
  searchQuery: null,
  concat: false,
  filters: [],
});

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());
api.setEndpoint("users");
const users = api.items;

const getItems = async () => {
  loading.value = true;
  await api.retrieveCollection(filter.value);
  dataTableRef.value?.getItems();
  loading.value = false;
};

const handleCreateEditClose = () => {
  createEditDialogOpen.value = false;
  itemId.value = null;
  dataTableRef?.value?.getItems();
  dataTableRef.value?.resetActiveItems();
};

const openCreateEditDialog = (item: any) => {
  itemId.value = item.id;
  createEditDialogOpen.value = true;
};

const openDeleteDialog = (id: string) => {
  itemId.value = id;
  confirmDeleteDialogOpen.value = true;
};

onMounted(() => {
  getItems();
});
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"
</style>
