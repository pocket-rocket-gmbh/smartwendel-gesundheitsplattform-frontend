<template>
  <div>
    <h2>Einrichtungen</h2>

    <v-btn
      v-if="user.isAdmin() || (!itemsExist && setupFinished)"
      elevation="0"
      variant="outlined"
      @click="
        itemId = null;
        createEditDialogOpen = true;
      "
      >Neue Einrichtung</v-btn
    >
    <v-alert v-if="!setupFinished && !loading" type="info" density="compact" closable class="mt-2">
      Vervollständige die Daten deiner Einrichtung um Kurse, Ereignisse und Beiträge zu erstellen
    </v-alert>

    <DataTable
      ref="dataTableRef"
      :fields="fields"
      endpoint="care_facilities?kind=facility"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      @openAddImagesDialog="openAddImagesDialog"
      @openAddFilesDialog="openAddFilesDialog"
      @items-loaded="handleItemsLoaded"
    />

    <AdminCareFacilitiesCreateEdit
      v-if="createEditDialogOpen"
      :item-id="itemId"
      :item-placeholder="itemPlaceholder"
      @close="handleCreateEditClose"
      endpoint="care_facilities"
      concept-name="Einrichtung"
    />

    <DeleteItem
      v-if="confirmDeleteDialogOpen"
      @close="
        itemId = null;
        confirmDeleteDialogOpen = false;
        dataTableRef?.resetActiveItems();
      "
      :item-id="itemId"
      endpoint="care_facilities"
      term="diese Einrichtung"
    />

  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "admin",
});

const user = useUser();
const loading = ref(false);

const fields = [{ text: "Name", value: "name", type: "string" }];
const dataTableRef = ref();
const itemsExist = ref(false);
const setupFinished = ref(false);

const itemPlaceholder = ref({
  name: "",
  kind: "facility",
  is_active: false,
  status: "is_checked",
  description: "",
  category_ids: [],
  tag_category_ids: [],
  offlineImage: null
});

const createEditDialogOpen = ref(false);
const confirmDeleteDialogOpen = ref(false);
const addImagesDialogOpen = ref(false);
const addFilesDialogOpen = ref(false);
const itemId = ref(null);

const handleItemsLoaded = (items: any[]) => {
  itemsExist.value = !!items.length;
};

const handleCreateEditClose = async () => {
  createEditDialogOpen.value = false;
  itemId.value = null;
  dataTableRef.value?.resetActiveItems();
  setupFinished.value = await useUser().setupFinished();
};

const openCreateEditDialog = (id: string) => {
  itemId.value = id;
  createEditDialogOpen.value = true;
};

const openDeleteDialog = (id: string) => {
  itemId.value = id;
  confirmDeleteDialogOpen.value = true;
};

const openAddImagesDialog = (id: string) => {
  itemId.value = id;
  addImagesDialogOpen.value = true;
};

const openAddFilesDialog = (id: string) => {
  itemId.value = id;
  addFilesDialogOpen.value = true;
};

onMounted(async () => {
  loading.value = true;
  setupFinished.value = await useUser().setupFinished();
  loading.value = false;
});
</script>
<style lang="sass">
.v-dialog--custom
  width: 30%
</style>
