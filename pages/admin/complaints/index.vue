<template>
  <div>
    <div>
      <div class="general-font-size is-dark-grey font-weight-bold">Beschwerde</div>
    </div>
    <v-row align="center" v-if="showBar">
      <v-col></v-col>
 
      <v-col md="9" class="d-flex justify-end">
        <v-text-field
          width="50"
          prepend-icon="mdi-magnify"
          v-model="searchTerm"
          hide-details="auto"
          label="Benutzer durchsuchen"
        />
      </v-col>
    </v-row>

    <DataTable
      ref="dataTableRef"
      :fields="fields"
      endpoint="complaints"
      :search-query="searchTerm"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      defaultSortBy="created_at"
      :disable-delete="false"
      @toogle-bar="showBar = !showBar"
    />

    <AdminComplaintsCreateEdit
    v-if="createEditDialogOpen"
    @close="
      itemId = null;
      createEditDialogOpen = false;
      itemId = null;
      dataTableRef?.resetActiveItems();
      handleCreateEditClose();
    "
    @refreshCollection="
      dataTableRef?.resetActiveItems();
      itemId = null;
      createEditDialogOpen = false;
      itemId = null;
      dataTableRef?.resetActiveItems();
    "
    :item-id="itemId"
  />
    <DeleteItem
      v-if="confirmDeleteDialogOpen"
      @close="
        itemId = null;
        confirmDeleteDialogOpen = false;
        dataTableRef?.resetActiveItems();
        handleCreateEditClose();
      "
      :item-id="itemId"
      endpoint="complaints"
      term="diese Beschwerde"
    />
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: "admin",
});

const showBar = ref(true);
const searchTerm = ref("");

const fields = [
  { prop: "name", text: "Titel", value: "page_title", type: "string",  width:"200" },
  { prop: "name", text: "Inhalt URL", value: "url", type: "string", width:"100"},
  {
    prop: "created_at",
    text: "Erstellt am",
    value: "created_at",
    type: "datetime",
    width:"200"
  },
  { prop: "name", text: "Name", value: "reporter_name", type: "string" },
  { prop: "name", text: "E-Mail", value: "reporter_email", type: "string" },
  {
    prop: "kind",
    text: "Typ",
    type: "enumKinds",
    endpoint: "complaints",
    value: "kind",
    enum_name: "complaintsKind",
    condition: "admin",
    width:"200"
  },
  {
    prop: "",
    text: "Status",
    type: "enumDropdown",
    endpoint: "complaints",
    value: "is_active_on_health_scope",
    enum_name: "complaintsStatus",
    condition: "admin",
    width:"200"
  },
  { prop: "name", text: "Maßnahme", value: "reporter_name", type: "string",  width:"100" },
  { prop: "name", text: "Protokol", value: "reporter_email", type: "protocol",  width:"100"},
];

const dataTableRef = ref();

const createEditDialogOpen = ref(false);
const confirmDeleteDialogOpen = ref(false);
const itemId = ref(null);

const openCreateEditDialog = (item: any) => {
  itemId.value = item.id;
  createEditDialogOpen.value = true;
};

const openDeleteDialog = (id: string) => {
  itemId.value = id;
  confirmDeleteDialogOpen.value = true;
};

const handleCreateEditClose = () => {
  createEditDialogOpen.value = false;
  itemId.value = null;
  dataTableRef?.value?.getItems();
  dataTableRef.value?.resetActiveItems();
};

const handleUpdateItems = () => {
  dataTableRef.value?.getItems();
};
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"
</style>
