<template>
  <div>
    <v-row>
      <v-col>
        <span
          class="general-font-size is-dark-grey font-weight-bold"
          v-if="useUser().isFacilityOwner()"
          >Meine Beiträge</span
        >
        <span class="general-font-size is-dark-grey font-weight-bold" v-else
          >Beiträge</span
        >
      </v-col>
      <v-col class="d-flex justify-end align-center">
        <div class="d-flex align-center mx-3">
          <v-icon size="x-small" color="success">mdi-circle</v-icon>
          <span class="pl-1 general-font-size is-dark-grey font-weight-bold"
            >Benutzer Aktiv</span
          >
        </div>
        <div class="d-flex align-center mx-3">
          <v-icon size="x-small" color="error">mdi-circle</v-icon>
          <span class="pl-1 general-font-size is-dark-grey font-weight-bold"
            >Benutzer nicht Aktiv</span
          >
        </div>
      </v-col>
    </v-row>

    <v-alert
      v-if="!setupFinished && !loading"
      type="info"
      density="compact"
      closable
      class="mt-2 general-font-size"
    >
      Bitte kontrolliere zunächst, dass du deine Einrichtung angelegt hast und wir dich
      freigegeben haben. Danach kannst du Kurse und Veranstaltungen sowie Beiträge
      anlegen.
    </v-alert>
    <v-row align="center">
      <v-col md="3">
        <v-btn
          v-if="setupFinished"
          elevation="0"
          variant="outlined"
          @click="
            itemId = null;
            createEditDialogOpen = true;
          "
        >
          Beitrag anlegen
        </v-btn>
      </v-col>
      <v-col>
        <v-text-field
          width="50"
          prepend-icon="mdi-magnify"
          v-model="facilitySearchTerm"
          hide-details="auto"
          label="Beiträge durchsuchen"
        />
      </v-col>
    </v-row>

    <DataTable
      :fields="fields"
      endpoint="care_facilities?kind=news"
      :search-query="facilitySearchTerm"
      :search-columns="facilitySearchColums"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      defaultSortBy="created_at"
      ref="dataTableRef"
      :disable-delete="false"
      :draft-required="draftRequiredFields"
    />

    <AdminNewsCreateEdit
      v-if="createEditDialogOpen"
      :item-id="itemId"
      :item-placeholder="itemPlaceholder"
      @close="handleCreateEditClose"
      endpoint="care_facilities"
      concept-name="Beiträge"
      :enableDraft="true"
      :required-for-draft="['name']"
      :showPreviewButton="true"
      @showPreview="handleShowPreview"
      @created="handleCreated"
      @update-items="handleUpdateItems"
    />

    <AdminPreviewDummyPage
      v-if="previewItem"
      :item="previewItem"
      @close="handlePreviewClose"
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
import { isCompleteNews } from "~/utils/facility.utils";
import { Facility } from "~/store/searchFilter";
import { RequiredField } from "~/types/facilities";

definePageMeta({
  layout: "admin",
});

const previewItem = ref<Facility>();

const user = useUser();
const loading = ref(false);
const router = useRouter();

const fields = [
  {
    prop: "is_active",
    text: "Offline/Online",
    endpoint: "care_facilities",
    type: "switch",
    tooltip: "Hiermit kannst du deinen Beitrag Online oder Offline schalten",
    fieldToSwitch: "is_active",
    disabledConditions: (item: any) => {
      const res = [
        isCompleteNews,
        () => {
          return !useUser().currentUser?.is_active_on_health_scope;
        },
      ].some((condition) => {
        const resCond = condition(item);
        return resCond;
      });
      return res;
    },
    disabledTooltip:
      "Dein Eintrag wird aktuell nicht auf der Gesundheitsplattform angezeigt, da eine Prüfung durch den Plattformadministrator aussteht. Die Prüfung und anschließende Freigabe kann bis zu 48h in Anspruch nehmen, wir bitte um Geduld.",
    disabledTooltipFacilityImcomplete:
      "Dein Eintrag wird aktuell nicht auf der Gesundheitsplattform angezeigt, da du noch nicht alle Pflichtfelder ausgefüllt hast.",
  },
  { prop: "name", text: "Titel", value: "name", type: "string" },
  { value: "", type: "beinEdited" },
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
      handleButtonClick(item.id);
    },
  },
  {
    value: "",
    type: "is-lk",
    tooltip: "Beitrag wurde von einer Admin erstellt.",
  },
];

const draftRequiredFields: RequiredField[] = [
  {
    props: ["name"],
  },
  {
    props: ["name_responsible_person"],
  },
  {
    props: ["description"],
    checkHandler: (description?: string) => !description || description === "<p><br></p>",
  },
  {
    props: ["tags"],
  },
];

const facilitySearchColums = ref(["name", "user.name", "created_at"]);
const facilitySearchTerm = ref("");

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
  tags: [],
  tag_ids: [],
  tag_category_ids: [],
  offlineDocuments: [],
  image_url: "",
  file: "",
});

const handleCreateEditClose = () => {
  createEditDialogOpen.value = false;
  itemId.value = null;
  dataTableRef?.value?.getItems();
  dataTableRef.value?.resetActiveItems();
};

const openCreateEditDialog = (item: any) => {
  itemId.value = item.id;
  createEditDialogOpen.value = true;
};

const openDeleteDialog = (id: string) => {
  itemId.value = id;
  confirmDeleteDialogOpen.value = true;
};

const handleUpdateItems = () => {
  dataTableRef.value?.getItems();
};

const handleShowPreview = (item: any) => {
  previewItem.value = item;
};
const handlePreviewClose = () => {
  previewItem.value = null;
};

const handleButtonClick = (id: string) => {
  event.stopPropagation();
  goToFacility(id);
};

const goToFacility = (id: string) => {
  const url = `/public/care_facilities/${id}`;
  window.open(url, "_blank");
};

const handleCreated = (createdItemId: string) => {
  itemId.value = createdItemId;
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
    // itemPlaceholder.value.tag_category_ids = currentUserFacility?.tag_category_ids;
  }

  setupFinished.value = await useUser().setupFinished();
  loading.value = false;

  const currentUserRole = user.currentUser.role;
  // availableFields.forEach((field) => {
  //   if (!field.condition) fields.value.push(field);
  //   if (currentUserRole === field.condition) fields.value.push(field);
  // });
});
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"
.orange
  color: orange
</style>
