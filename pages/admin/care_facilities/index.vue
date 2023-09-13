<template>
  <div>
    <h2 v-if="useUser().isFacilityOwner()">Meine Einrichtung</h2>
    <h2 v-else>Einrichtungen</h2>
    <v-alert v-if="!setupFinished && !loading" type="info" density="compact" closable class="my-2">
      Bitte vervollständige die Daten zu deiner Einrichtung
    </v-alert>
    <ChangePassword :open="userLoginCount === 1 && !user?.currentUser?.password_changed_at" @changed="handleSaved()" />
    <div>
      <div>
        <v-row align="center">
          <v-col md="3" class="d-flex">
            <v-btn
              v-if="user.isAdmin() || !itemsExist"
              elevation="0"
              variant="outlined"
              @click="
                itemId = null;
                createEditDialogOpen = true;
                itemPlaceholder = JSON.parse(JSON.stringify(originalItemPlaceholder));
              "
            >
              Neue Einrichtung
            </v-btn>
          </v-col>
          <v-col v-if="user.isAdmin()">
            <v-text-field width="50" prepend-icon="mdi-magnify" v-model="facilitySearchTerm" hide-details="auto" label="Einrichtungen durchsuchen" />
          </v-col>
        </v-row>
      </div>

      <DataTable
        ref="dataTableRef"
        :fields="fields"
        :search-query="facilitySearchTerm"
        :search-columns="facilitySearchColums"
        endpoint="care_facilities?kind=facility"
        @openCreateEditDialog="openCreateEditDialog"
        @openDeleteDialog="openDeleteDialog"
        @openAddImagesDialog="openAddImagesDialog"
        @openAddFilesDialog="openAddFilesDialog"
        @items-loaded="handleItemsLoaded"
        @item-updated="handleItemUpdated"
        :disable-delete="true"
        :draft-required="draftRequiredFields"
      />

      <div
        class="px-5"
        v-if="facilityId && setupFinished && !itemStatus && !user.isAdmin() && useUser().statusOnHealthScope()"
      >
        <v-icon>mdi-arrow-up</v-icon>
        <span>Erst mit Aktivierung des Buttons erscheint dein Profil auf der Webseite.</span>
      </div>
      <v-btn
        v-if="facilityId && !user.isAdmin()"
        :disabled="setupFinished && !itemStatus"
        elevation="0"
        variant="outlined"
        class="mt-5"
        @click="useRouter().push({ path: `/public/care_facilities/${facilityId}` })"
      >
        Zu Deiner Einrichtung
      </v-btn>

      <AdminCareFacilitiesCreateEdit
        scroll-strategy="none"
        v-if="createEditDialogOpen"
        :item-id="itemId"
        :item-placeholder="itemPlaceholder"
        @close="handleCreateEditClose"
        endpoint="care_facilities"
        concept-name="Einrichtung"
        :enableDraft="true"
        :required-for-draft="['name']"
        :showPreviewButton="true"
        @showPreview="handleShowPreview"
        @update-items="handleUpdateItems"
        @created="handleCreated"
      />

      <AdminPreviewDummyPage v-if="previewItem" :item="previewItem" @close="handlePreviewClose" />
      <DeleteItem v-if="confirmDeleteDialogOpen" @close="handleDeleteDialogClose" :item-id="itemId" endpoint="care_facilities" term="diese Einrichtung" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isCompleteFacility } from "~/utils/facility.utils";
import { Facility } from "~/store/searchFilter";
import { RequiredField } from "types/facilities";

definePageMeta({
  layout: "admin",
});

const user = useUser();
const router = useRouter();
const loading = ref(false);
const passwordChanged = ref(false);

const userLoginCount = computed(() => {
  return user.loginCount();
});

const handleSaved = async () => {
  passwordChanged.value = true;
  dataTableRef?.value.getItems();
  useUser().reloadUser();
};

const fields = [
  {
    prop: "is_active",
    text: "Offline/Online",
    endpoint: "care_facilities",
    type: "switch",
    tooltip: "Hiermit kannst du deine Einrichtung Online oder Offline schalten",
    fieldToSwitch: "is_active",
    disabledConditions: (item: any) => {
      const res = [
        isCompleteFacility,
        () => {
          return !useUser().currentUser?.is_active_on_health_scope;
        },
      ].some((condition) => {
        const resCond = condition(item);
        return resCond;
      });
      return res;
    },
    disabledTooltip: "Bitte alle Pflichtfelder zu deiner Einrichtung ausfüllen, danach kannst du deine Einrichtung über den Button Online schalten",
  },
  { prop: "name", text: "Name", value: "name", type: "string" },
  { value: "", type: "isCompleteFacility" },
  { value: "", type: "beinEdited" },
  { prop: "", text: "Letzte Änderung", value: "updated_at", type: "datetime" },
  { prop: "created_at", text: "Erstellt am", value: "created_at", type: "datetime" },
  {
    prop: "user.firstname",
    text: "Erstellt von",
    value: "user.name",
    condition: "admin",
    type: "button",
    action: (item: any) => {
      if (user?.currentUser?.role !== "facility_owner") {
        router.push({ path: "/admin/users", query: { userId: item.user.id } });
      }
    },
  },
  {
    text: "",
    value: "mdi-eye",
    type: "button",
    tooltip: "Einrichtung anzehen",
    action: (item: any) => {
      goToFacility(item.id);
    },
  },
];

const draftRequiredFields: RequiredField[] = [
  {
    props: ["name"],
  },
  {
    props: ["logo_url", "logo"],
    justSome: true,
  },
  {
    props: ["image_url", "file"],
    justSome: true,
  },
  {
    props: ["description"],
    checkHandler: (description?: string) => !description || description === "<p><br></p>",
  },
  {
    props: ["tag_category_ids"],
    specialFilter: "filter_facility",
  },
  {
    props: ["tag_category_ids"],
    specialFilter: "filter_service",
  },
  {
    props: ["street", "zip", "community_id", "town", "email", "phone"],
  },
  {
    props: ["name_responsible_person"],
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
  opening_hours: [
    {
      day: "Montag",
      placeholder: "z.B. 08:00 - 12:00 und 13:00 - 17:00",
      hours: "",
    },
    {
      day: "Dienstag",
      placeholder: "z.B. 08:00 - 12:00 und 13:00 - 17:00",
      hours: "",
    },
    {
      day: "Mittwoch",
      placeholder: "z.B. 08:00 - 12:00 und 13:00 - 17:00",
      hours: "",
    },
    {
      day: "Donnerstag",
      placeholder: "z.B. 08:00 - 12:00 und 13:00 - 17:00",
      hours: "",
    },
    {
      day: "Freitag",
      placeholder: "z.B. 08:00 - 12:00 und 13:00 - 17:00",
      hours: "",
    },
    { day: "Samstag", placeholder: "z.B. geschlossen", hours: "" },
    { day: "Sonntag", placeholder: "z.B. geschlossen", hours: "" },
  ],
});
const itemPlaceholder = ref(JSON.parse(JSON.stringify(originalItemPlaceholder.value)));

const createEditDialogOpen = ref(false);
const confirmDeleteDialogOpen = ref(false);
const addImagesDialogOpen = ref(false);
const addFilesDialogOpen = ref(false);
const facilityId = ref(null);
const itemId = ref(null);
const previewItem = ref<Facility>();

const facilitySearchColums = ref(["name", "user.name"]);
const facilitySearchTerm = ref("");

const itemStatus = ref(null);

const handleItemUpdated = async (item: any) => {
  setupFinished.value = await useUser().setupFinished();
  itemStatus.value = item?.is_active;
};

const handleItemsLoaded = (items: any[]) => {
  itemStatus.value = items[0]?.is_active;
  const firstItemId = items[0]?.id;
  facilityId.value = firstItemId;
  if (firstItemId && passwordChanged.value) {
    itemId.value = firstItemId;
    passwordChanged.value = false;
    createEditDialogOpen.value = true;
  }
  itemsExist.value = !!items.length;
  handleItemUpdated(items[0]);
};

const handleDeleteDialogClose = () => {
  itemId.value = null;
  confirmDeleteDialogOpen.value = false;
  dataTableRef.value?.resetActiveItems();
  useNuxtApp().$bus.$emit("facilityUpdate");
};

const handleCreateEditClose = async () => {
  createEditDialogOpen.value = false;
  itemId.value = null;
  await dataTableRef.value?.resetActiveItems();
  await dataTableRef.value?.getItems();
  setupFinished.value = await useUser().setupFinished();
  useNuxtApp().$bus.$emit("facilityUpdate");
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

const goToFacility = (id: string) => {
  router.push({ path: `/public/care_facilities/${id}` });
};

const handleShowPreview = (item: any) => {
  previewItem.value = item;
};
const handlePreviewClose = () => {
  previewItem.value = null;
};

const handleUpdateItems = () => {
  dataTableRef.value?.getItems();
};

const handleCreated = (createdItemId: string) => {
  itemId.value = createdItemId;
};

onMounted(async () => {
  loading.value = true;
  setupFinished.value = await useUser().setupFinished();
  loading.value = false;
});
</script>
<style lang="sass">
.orange
  color: orange

.v-dialog--custom
  width: 30%
</style>
