<template>
  <div>
    <h2 v-if="useUser().isFacilityOwner()">Meine Einrichtung</h2>
    <h2 v-else>Einrichtungen</h2>
    <v-alert v-if="!setupFinished && !loading" type="info" density="compact" closable class="mt-2">
      Bitte vervollständige die Daten zu deiner Einrichtung
    </v-alert>
    <div>
      <v-row align="center">
        <v-col md="3" class="d-flex">
          <v-btn
            v-if="user.isAdmin() || !itemsExist || !setupFinished"
            elevation="0"
            variant="outlined"
            @click="
              itemId = null;
              createEditDialogOpen = true;
              itemPlaceholder = JSON.parse(JSON.stringify(originalItemPlaceholder));
            "
            :class="{ orange: newFacilityFromCache }"
          >
            Neue Einrichtung <span v-if="newFacilityFromCache"> - weiter</span>
          </v-btn>
        </v-col>
        <v-col>
          <v-text-field
            width="50"
            prepend-icon="mdi-magnify"
            v-model="facilitySearchTerm"
            hide-details="auto"
            label="Einrichtungen durchsuchen"
          />
        </v-col>
      </v-row>
    </div>
    <DataTable
      ref="dataTableRef"
      :fields="fields"
      :search-query="facilitySearchTerm"
      :search-columns="facilitySearchColums"
      :cache-prefix="'facilities'"
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
      :enableCache="true"
      :cacheKey="cacheKey"
      :showPreviewButton="true"
      @showPreview="handleShowPreview"
    />

    <AdminPreviewDummyPage v-if="previewItem" :item="previewItem" @close="handlePreviewClose" />

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
import { isCompleteFacility } from "~/utils/facility.utils";
import { Facility } from "~/store/searchFilter";

definePageMeta({
  layout: "admin",
});

const user = useUser();
const router = useRouter();
const loading = ref(false);

const fields = [
  {
    prop: "is_active",
    text: "Aktiv",
    endpoint: "care_facilities",
    type: "switch",
    tooltip: "Hiermit kannst du deine Einrichtung aktivieren und deaktivieren",
    fieldToSwitch: "is_active",
    disabledCondition: isCompleteFacility,
    disabledTooltip:
      "Bitte alle Pflichtfelder zu deiner Einrichtung ausfüllen, danach kannst du deine Einrichtung über den Button aktiv schalten",
  },
  { prop: "name", text: "Name", value: "name", type: "string" },
  {
    prop: "user.firstname",
    text: "Erstellt von",
    value: "user.name",
    condition: "admin",
    type: "button",
    action: (item: any) => router.push({ path: "/admin/users", query: { userId: item?.user?.id } }),
  },
];
const dataTableRef = ref();
const itemsExist = ref(false);
const setupFinished = ref(false);

const originalItemPlaceholder = ref({
  name: "",
  kind: "facility",
  is_active: false,
  status: "is_checked",
  description: "",
  category_ids: [],
  tags: [],
  tag_ids: [],
  tag_category_ids: [],
  offlineImage: null,
  offlineLocations: [],
  offlineDocuments: [],
});
const itemPlaceholder = ref(JSON.parse(JSON.stringify(originalItemPlaceholder.value)));

const createEditDialogOpen = ref(false);
const confirmDeleteDialogOpen = ref(false);
const addImagesDialogOpen = ref(false);
const addFilesDialogOpen = ref(false);
const itemId = ref(null);
const previewItem = ref<Facility>();

const facilitySearchColums = ref(["name", "user.name"]);
const facilitySearchTerm = ref("");

const newFacilityFromCache = ref(false);

const cacheKey = computed(() => {
  if (!itemId.value) {
    return `facilities_new`;
  }

  return `facilities_${itemId.value.replaceAll("-", "_")}`;
});

const handleItemsLoaded = (items: any[]) => {
  itemsExist.value = !!items.length;
};

const handleCreateEditClose = async () => {
  createEditDialogOpen.value = false;
  itemId.value = null;
  dataTableRef.value?.resetActiveItems();
  setupFinished.value = await useUser().setupFinished();
  newFacilityFromCache.value = !!localStorage.getItem("facilities_new");
};

const openCreateEditDialog = (item: any) => {
  itemId.value = item.id;
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

const handleShowPreview = (item: any) => {
  previewItem.value = item;
};
const handlePreviewClose = () => {
  previewItem.value = null;
};

onMounted(async () => {
  loading.value = true;
  setupFinished.value = await useUser().facilityFinished();
  loading.value = false;

  newFacilityFromCache.value = !!localStorage.getItem("facilities_new");
});
</script>
<style lang="sass">
.orange
  color: orange

.v-dialog--custom
  width: 30%
</style>
