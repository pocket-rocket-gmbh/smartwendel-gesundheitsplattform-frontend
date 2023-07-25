<template>
  <div>
    <h2 v-if="useUser().isFacilityOwner()">Meine Kurse und Veranstaltungen</h2>
    <h2 v-else>Kurse und Veranstaltungen</h2>
    <v-alert type="info" density="compact" closable class="my-2"
      >Leg hier deine Veranstaltung oder deinen Kurs an. Veranstaltungen sind
      einmalige Ereignisse, die sich über mehrere Tage verteilen können. Kurse
      sind wiederkehrende Ereignisse (wöchentlich, etc.)</v-alert
    >
    <template v-if="setupFinished">
      <v-row align="center">
        <v-col md="5">
          <div class="my-5">
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
          </div>
        </v-col>
        <v-col>
          <v-text-field
            width="50"
            prepend-icon="mdi-magnify"
            v-model="facilitySearchTerm"
            hide-details="auto"
            label="Kurse und Veranstaltungen durchsuchen"
          />
        </v-col>
      </v-row>
    </template>
    <v-alert
      v-if="!setupFinished && !loading"
      type="info"
      density="compact"
      closable
      class="mt-2"
    >
      Bitte kontrolliere zunächst deine Persönlichen Daten und vervollständige
      als nächstes deine Einrichtung
    </v-alert>

    <DataTable
      ref="dataTableRef"
      :fields="fields"
      endpoint="care_facilities?kind=event,course"
      :search-query="facilitySearchTerm"
      :search-columns="facilitySearchColums"
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
      :concept-name="
        itemPlaceholder.kind === 'course' ? 'Kurs' : 'Veranstaltung'
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
      endpoint="care_facilities"
      term="diesen Kurs oder Veranstaltung"
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
  {
    prop: "is_active",
    text: "Aktiv",
    endpoint: "care_facilities",
    type: "switch",
    fieldToSwitch: "is_active",
  },
  { prop: "name", text: "Titel", value: "name", type: "string" },
  {
    prop: "user.name",
    text: "Erstellt von",
    value: "user.name",
    type: "pathIntoObject",
    condition: "admin",
  },
  {
    prop: "kind",
    text: "Art (Kurs oder Veranstaltung)",
    endpoint: "care_facilities",
    value: "kind",
    type: "enum",
    enum_name: "facilitiesKind",
  },
];

const facilitySearchColums = ref(["name", "user.name", "kind"]);
const facilitySearchTerm = ref("");

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
  tags: [],
  tag_ids: [],
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
    itemPlaceholder.value.tag_category_ids =
      currentUserFacility?.tag_category_ids;
  }

  setupFinished.value = await useUser().setupFinished();
  loading.value = false;
});
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"
</style>
