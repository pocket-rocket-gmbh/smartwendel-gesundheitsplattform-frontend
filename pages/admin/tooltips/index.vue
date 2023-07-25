<template>
  <div>
    <h2>Tooltips</h2>
    <v-btn
      elevation="0"
      variant="outlined"
      @click="
        itemId = null;
        createEditDialogOpen = true;
      "
      >Tooltip erstellen</v-btn
    >

    <v-text-field v-model="facilitySearchTerm" hide-details="auto" label="Tooltips durchsuchen" />

    <DataTable
      :fields="fields"
      endpoint="tooltips"
      :search-query="facilitySearchTerm"
      :search-columns="facilitySearchColums"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      ref="dataTableRef"
    />

    <AdminTooltipsCreateEdit
      :item-id="itemId"
      v-if="createEditDialogOpen"
      :item-placeholder="itemPlaceholder"
      endpoint="tooltips"
      @close="
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
      endpoint="tooltips"
      term="diesen Tooltip"
      @refreshCollection="useNuxtApp().$bus.$emit('triggerGetItems', null)"
    />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "admin",
});
const fields = ref([
  { text: "Name", value: "name", type: "string" },
  { text: "Inhalt", value: "content", type: "string" },
  { text: "Url", value: "url", type: "string" },
]);

const itemPlaceholder = ref({
  name: "",
  scope: "tooltips",
});

const facilitySearchColums = ref(["name", "content", "url"]);
const facilitySearchTerm = ref("");

const dialog = ref(false);
const item = ref({ name: "" });
const loading = ref(false);
const createEditDialogOpen = ref(false);
const confirmDeleteDialogOpen = ref(false);
const itemId = ref(null);
const dataTableRef = ref();

const openCreateEditDialog = (id: string) => {
  itemId.value = id;
  createEditDialogOpen.value = true;
};

const openDeleteDialog = (id: string) => {
  itemId.value = id;
  confirmDeleteDialogOpen.value = true;
};
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"
</style>
