<template>
  <div>
    <v-row v-if="showBar">
      <v-col>
        <span
          class="general-font-size is-dark-grey font-weight-bold"
          v-if="useUser().isFacilityOwner()"
          >Meine Kurse</span
        >
        <span class="general-font-size is-dark-grey font-weight-bold" v-else>Kurse</span>
      </v-col>
      <v-col class="d-flex justify-end align-center" v-if="useUser().isAdmin()">
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

    <v-alert type="info" density="compact" closable class="my-2 general-font-size"
      >Hier kannst du deine Kurse anlegen. Je spezifischer deine Angaben sind, desto
      besser können dich Besucher auf der Webseite finden. Pflichtfelder sind mit einem
      Sternchen versehen.</v-alert
    >
    <v-alert density="compact" closable class="my-2 general-font-size"
      >Leg hier deinen Kurs an. Kurse sind wiederkehrende Ereignisse (wöchentlich,
      etc.)</v-alert
    >
    <template v-if="setupFinished">
      <v-row align="center" v-if="showBar">
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
            >
              Kurs anlegen
            </v-btn>
          </div>
        </v-col>
        <v-col>
          <v-text-field
            width="50"
            prepend-icon="mdi-magnify"
            v-model="facilitySearchTerm"
            hide-details="auto"
            label="Kurse durchsuchen"
          />
        </v-col>
      </v-row>
    </template>
    <v-alert
      v-if="!setupFinished && !loading"
      type="info"
      density="compact"
      closable
      class="mt-2 general-font-size"
    >
      Bitte kontrolliere zunächst, dass du deine Einrichtung angelegt hast und wir dich
      freigegeben haben. Danach kannst du Kurse, Veranstaltungen sowie Beiträge anlegen.
    </v-alert>

    <DataTable
      ref="dataTableRef"
      :fields="fields"
      endpoint="care_facilities?kind=course"
      :search-query="facilitySearchTerm"
      :search-columns="facilitySearchColums"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      defaultSortBy="created_at"
      :disable-delete="false"
      @toogle-bar="showBar = !showBar"
      :draft-required="draftRequiredFields"
    />

    <AdminCoursesCreateEdit
      scroll-strategy="none"
      v-if="createEditDialogOpen"
      :item-id="itemId"
      :item-placeholder="itemPlaceholder"
      @close="handleCreateEditClose"
      endpoint="care_facilities"
      :concept-name="'Kurs'"
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
      term="diesen Kurs"
    />
  </div>
</template>
<script lang="ts" setup>
import { getCurrentUserFacilities } from "~/utils/filter.utils";
import type { Facility } from "~/store/searchFilter";
import type { RequiredField } from "~/types/facilities";
import { isCompleteCourse } from "~/utils/facility.utils";

definePageMeta({
  layout: "admin",
});

const showBar = ref(true);
const user = useUser();
const loading = ref(false);
const router = useRouter();

const fields = [
  {
    prop: "is_active",
    text: "Offline/Online",
    endpoint: "care_facilities",
    type: "switch",
    tooltip: "Hiermit kannst du deinen Kurs Online oder Offline schalten",
    fieldToSwitch: "is_active",
    disabledConditions: (item: any) => {
      const res = [
        isCompleteCourse,
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
    value: "",
    type: "has-dates",
  },
  {
    text: "",
    value: "mdi-check-decagram",
    type: "button",
    tooltip: "Kurse wurde verifiziert",
    action: (item: any) => {
      handleButtonClick(item.id);
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
    tooltip: "Kurs wurde von einem Admin erstellt.",
  },
];

const draftRequiredFields: RequiredField[] = [
  {
    props: ["name"],
  },
  {
    props: ["name_instructor"],
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
    props: ["event_dates"],
    justSome: true,
  },
  {
    props: ["street", "zip", "community_id", "town"],
  },
];

const previewItem = ref<Facility>();

const facilitySearchColums = ref(["name", "user.name", "kind"]);
const facilitySearchTerm = ref("");

const dataTableRef = ref();

const createEditDialogOpen = ref(false);
const confirmDeleteDialogOpen = ref(false);
const itemId = ref(null);
const setupFinished = ref(false);

const itemPlaceholder = ref({
  name: "",
  kind: "course",
  status: "is_checked",
  is_active: false,
  description: "",
  category_ids: [],
  tags: [],
  tag_ids: [],
  tag_category_ids: [],
  offlineDocuments: [],
  email: "",
  zip: "",
  town: "",
  street: "",
  phone: "",
  community: "",
  community_id: "",
  course_outside_facility: false,
});

const openCreateEditDialog = (item: any) => {
  itemPlaceholder.value.kind = item.kind;
  itemId.value = item.id;
  createEditDialogOpen.value = true;
};

const openDeleteDialog = (id: string) => {
  itemId.value = id;
  confirmDeleteDialogOpen.value = true;
};

const handleCreateEditClose = () => {
  createEditDialogOpen.value = false;
  itemId.value = null;
  dataTableRef?.value?.getItems();
  dataTableRef.value?.resetActiveItems();
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

const handleUpdateItems = () => {
  dataTableRef.value?.getItems();
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
    // itemPlaceholder.value.tag_category_ids = currentUserFacility?.tag_category_ids;
  }

  setupFinished.value = await useUser().setupFinished();
  loading.value = false;
});
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"
.orange
  color: orange
</style>
