<template>
  <div>
    <h2>Kurse und Veranstaltungen</h2>
    <v-btn
      elevation="0"
      variant="outlined"
      class="mr-5"
      @click="
        itemPlaceholder.kind = 'course';
        itemId = null;
        createEditDialogOpen = true;
      "
      >Kurs anlegen</v-btn
    >
    <v-btn
      elevation="0"
      variant="outlined"
      @click="
        itemPlaceholder.kind = 'event';
        itemId = null;
        createEditDialogOpen = true;
      "
      >Veranstaltung anlegen</v-btn
    >
    <DataTable
      ref="dataTableRef"
      :fields="fields"
      endpoint="care_facilities?kind=event,course"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      defaultSortBy="kind"
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
      :concept-name="itemPlaceholder.kind === 'course' ? 'Kurs' : 'Veranstaltung'"
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
      term="diesen Kurse/Veranstaltung"
    />
  </div>
</template>
<script lang="ts" setup>
import { useAdminStore } from "~/store/admin";
import { getCurrentUserFacilities } from "~/utils/filter.utils";

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
    enum_name: "facilitiesStatus"
  },
  { text: "Art (Kurs oder Veranstaltung)", endpoint: "care_facilities", value: "kind", type: "enum", enum_name: "facilitiesKind" },
  { text: "Bereich", value: "categories", type: "associations_name" },
  { text: "Beginn", value: "course_start", type: "datetime" },
  { text: "Ende", value: "course_end", type: "datetime" },
];

const fields = ref([]);
const dataTableRef = ref();

const createEditDialogOpen = ref(false);
const confirmDeleteDialogOpen = ref(false);
const itemId = ref(null);

const itemPlaceholder = ref<any>({
  name: "",
  kind: "event",
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
