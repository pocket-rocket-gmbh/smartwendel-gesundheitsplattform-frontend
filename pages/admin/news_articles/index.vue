<template>
  <div>
    <h2 v-if="useUser().isFacilityOwner()">Meine Beiträge</h2>
    <h2 v-else>Beiträge</h2>
    <v-btn
      v-if="setupFinished"
      elevation="0"
      variant="outlined"
      @click="
        itemId = null;
        createEditDialogOpen = true;
      "
      >Beitrag anlegen</v-btn
    >
    <v-alert v-if="!setupFinished && !loading" type="info" density="compact" closable class="mt-2">
      Bitte kontrolliere zunächst deine Persönlichen Daten und vervollständige als nächstes deine Einrichtung
    </v-alert>

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
        dataTableRef?.resetActiveItems();
      "
      endpoint="care_facilities"
      concept-name="Beiträge"
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
      term="diesen Beitrag"
    />
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: "admin",
});

const user = useUser();
const loading = ref(false);

const availableFields = [
  { text: "Aktiv", endpoint: "care_facilities", type: "switch", fieldToSwitch: "is_active" },
  { text: "Titel", value: "name", type: "string" },
  { text: "Erstellt am", value: "created_at", type: "datetime" },
  { text: "Erstellt von", value: "user.name", type: "pathIntoObject", condition: "admin" },
];

const fields = ref([]);

const createEditDialogOpen = ref(false);
const confirmDeleteDialogOpen = ref(false);
const itemId = ref(null);
const dataTableRef = ref();
const setupFinished = ref(false);

const itemPlaceholder = ref<any>({
  name: "",
  kind: "news",
  status: "is_checked",
  is_active: false,
  description: "",
  category_ids: [],
  tag_category_ids: [],
  offlineDocuments: [],
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
  loading.value = true;
  if (!user.isAdmin()) {
    const currentUserFacility = await getCurrentUserFacilities();
    loading.value = true;

    itemPlaceholder.value.email = currentUserFacility?.email;
    itemPlaceholder.value.zip = currentUserFacility?.zip;
    itemPlaceholder.value.town = currentUserFacility?.town;
    itemPlaceholder.value.street = currentUserFacility?.street;
    itemPlaceholder.value.phone = currentUserFacility?.phone;
    itemPlaceholder.value.community = currentUserFacility?.community;
    itemPlaceholder.value.community_id = currentUserFacility?.community_id;
    itemPlaceholder.value.tag_category_ids = currentUserFacility?.tag_category_ids;
  }

  setupFinished.value = await useUser().setupFinished();
  loading.value = false;

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
