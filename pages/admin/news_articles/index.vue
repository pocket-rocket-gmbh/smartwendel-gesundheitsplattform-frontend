<template>
  <div>
    <h2>Beiträge</h2>
    <v-btn
      elevation="0"
      variant="outlined"
      @click="
        itemId = null;
        createEditDialogOpen = true;
      "
      >Newsartikel anlegen</v-btn
    >
    <DataTable
      :fields="fields"
      endpoint="care_facilities?kind=news"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      ref="dataTableRef"
    />

    <AdminCareFacilitiesCreateEdit
      v-if="createEditDialogOpen"
      :item-id="itemId"
      :item-placeholder="itemPlaceholder"
      @close="
        createEditDialogOpen = false;
        itemId = null;
        dataTableRef?.resetActiveItems()
      "
      endpoint="care_facilities"
      concept-name="Beiträge"
    />

    <DeleteItem
      v-if="confirmDeleteDialogOpen"
      @close="
        itemId = null;
        confirmDeleteDialogOpen = false;
        dataTableRef?.resetActiveItems()
      "
      :item-id="itemId"
      endpoint="care_facilities"
      term="diesen Beitrag"
    />
  </div>
</template>
<script lang="ts" setup>
import { useAdminStore } from "~/store/admin";

definePageMeta({
  layout: "admin",
});

const user = useUser();
const adminStore = useAdminStore();

const availableFields = [
  { text: "Aktiv", endpoint: "care_facilities", type: "switch", fieldToSwitch: "is_active" },
  { text: "Titel", value: "name", type: "string" },
  {
    text: "Status",
    endpoint: "care_facilities",
    type: "enumDropdown",
    value: "status",
    enum_name: "facilitiesStatus",
  },
  { text: "Bereich", value: "categories", type: "associations_name" },
  { text: "Erstellt am", value: "created_at", type: "datetime" },
  { text: "Autor", value: "", type: "string" },
];

const fields = ref([]);

const createEditDialogOpen = ref(false);
const confirmDeleteDialogOpen = ref(false);
const itemId = ref(null);
const dataTableRef = ref();

const itemPlaceholder = ref<any>({
  name: "",
  kind: "news",
  status: "is_checked",
  is_active: false,
  description: "",
  category_ids: [],
  tag_category_ids: [],
});

const openCreateEditDialog = (id: string) => {
  itemId.value = id;
  createEditDialogOpen.value = true;
};

const openDeleteDialog = (id: string) => {
  itemId.value = id;
  confirmDeleteDialogOpen.value = true;
};

onMounted(async () => {
  if (!user.isAdmin()) {
    adminStore.loading = true;
    const currentUserFacility = await getCurrentUserFacilities();

    itemPlaceholder.value.email = currentUserFacility?.email;
    itemPlaceholder.value.zip = currentUserFacility?.zip;
    itemPlaceholder.value.town = currentUserFacility?.town;
    itemPlaceholder.value.street = currentUserFacility?.street;
    itemPlaceholder.value.phone = currentUserFacility?.phone;
    itemPlaceholder.value.community = currentUserFacility?.community;
    itemPlaceholder.value.community_id = currentUserFacility?.community_id;
    itemPlaceholder.value.tag_category_ids = currentUserFacility?.tag_category_ids;

    adminStore.loading = false;
  }

  const currentUserRole = user.currentUser.role;
  availableFields.forEach((field) => {
    if (!field.condition) fields.value.push(field);
    if (currentUserRole === field.condition) fields.value.push(field);
  });
});
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"
</style>
