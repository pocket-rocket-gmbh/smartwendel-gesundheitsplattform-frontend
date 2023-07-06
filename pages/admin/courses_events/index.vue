<template>
  <div>
    <h2>Kurse und Veranstaltungen</h2>

    <template v-if="setupFinished">
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
    </template>
    <v-alert v-if="!setupFinished && !loading" type="info" density="compact" closable class="mt-2">
      Vervollständige die Daten deiner Einrichtung um Kurse, Ereignisse und Beiträge zu erstellen
    </v-alert>

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
        dataTableRef?.resetActiveItems();
      "
      endpoint="care_facilities"
      :concept-name="itemPlaceholder.kind === 'course' ? 'Kurs' : 'Veranstaltung'"
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
      term="diesen Kurse/Veranstaltung"
    />
  </div>
</template>
<script lang="ts" setup>
import { getCurrentUserFacilities } from "~/utils/filter.utils";

definePageMeta({
  layout: "admin",
});

const user = useUser();
const loading = ref(false);

const fields = [
  { text: "Aktiv", endpoint: "care_facilities", type: "switch", fieldToSwitch: "is_active" },
  { text: "Titel", value: "name", type: "string" },
  {
    text: "Art (Kurs oder Veranstaltung)",
    endpoint: "care_facilities",
    value: "kind",
    type: "enum",
    enum_name: "facilitiesKind",
  }
];

const dataTableRef = ref();

const createEditDialogOpen = ref(false);
const confirmDeleteDialogOpen = ref(false);
const itemId = ref(null);
const setupFinished = ref(false);

const itemPlaceholder = ref<any>({
  name: "",
  kind: "event",
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
});
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"
</style>
