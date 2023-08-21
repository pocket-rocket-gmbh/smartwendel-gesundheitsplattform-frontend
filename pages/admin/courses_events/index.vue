<template>
  <div>
    <h2 v-if="useUser().isFacilityOwner()">Meine Kurse und Veranstaltungen</h2>
    <h2 v-else>Kurse und Veranstaltungen</h2>
    <v-alert type="info" density="compact" closable class="my-2"
      >Hier kannst du deine Veranstaltungen oder Kurse anlegen. Veranstaltungen finden einmalig statt (z. B. Tag der offenen Tür), während Kurse regelmäßig wiederkehrende Ereignisse sind (z. B. wöchentlicher Pilateskurs).</v-alert
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
              :class="{ orange: newCourseFromCache }"
            >
              Kurs anlegen<span v-if="newCourseFromCache"> - weiter</span>
            </v-btn>
            <v-btn
              elevation="0"
              variant="outlined"
              @click="
                itemPlaceholder.kind = 'event';
                itemId = null;
                createEditDialogOpen = true;
              "
              :class="{ orange: newEventFromCache }"
            >
              Veranstaltung anlegen <span v-if="newEventFromCache"> - weiter</span>
            </v-btn>
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
    <v-alert v-if="!setupFinished && !loading" type="info" density="compact" closable class="mt-2">
      Bitte kontrolliere zunächst, dass du deine Einrichtung angelegt hast und wir dich freigegeben haben. Danach kannst
      du Kurse und Veranstaltungen sowie Beiträge anlegen.
    </v-alert>

    <DataTable
      ref="dataTableRef"
      :fields="fields"
      endpoint="care_facilities?kind=event,course"
      :search-query="facilitySearchTerm"
      :search-columns="facilitySearchColums"
      :cache-prefix="'events,courses'"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      defaultSortBy="kind"
    />

    <template v-if="createEditDialogOpen">
      <AdminCoursesCreateEdit
        v-if="itemPlaceholder.kind === 'course'"
        :item-id="itemId"
        :item-placeholder="itemPlaceholder"
        @close="handleCreateEditClose"
        endpoint="care_facilities"
        :concept-name="'Kurs'"
        :enableCache="true"
        :cacheKey="coursesCacheKey"
        :showPreviewButton="true"
        @showPreview="handleShowPreview"
      />
      <AdminEventsCreateEdit
        v-if="itemPlaceholder.kind === 'event'"
        :item-id="itemId"
        :item-placeholder="itemPlaceholder"
        @close="handleCreateEditClose"
        endpoint="care_facilities"
        :concept-name="'Veranstaltung'"
        :enableCache="true"
        :cacheKey="eventsCacheKey"
        :showPreviewButton="true"
        @showPreview="handleShowPreview"
      />
    </template>

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
      term="diesen Kurs oder Veranstaltung"
    />
  </div>
</template>
<script lang="ts" setup>
import { getCurrentUserFacilities } from "~/utils/filter.utils";
import { Facility } from "~/store/searchFilter";

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
    tooltip: "Hiermit kannst du deinen Kurs/deine Veranstaltung aktivieren und deaktivieren",
    fieldToSwitch: "is_active",
  },
  { prop: "name", text: "Titel", value: "name", type: "string" },
  { prop: "user.firstname", text: "Erstellt von", value: "user.name", type: "pathIntoObject", condition: "admin" },
  {
    prop: "kind",
    text: "Art (Kurs oder Veranstaltung)",
    endpoint: "care_facilities",
    value: "kind",
    type: "enum",
    enum_name: "facilitiesKind",
  },
];

const previewItem = ref<Facility>();

const newCourseFromCache = ref(false);
const newEventFromCache = ref(false);

const facilitySearchColums = ref(["name", "user.name", "kind"]);
const facilitySearchTerm = ref("");

const dataTableRef = ref();

const createEditDialogOpen = ref(false);
const confirmDeleteDialogOpen = ref(false);
const itemId = ref(null);
const setupFinished = ref(false);

const itemPlaceholder = ref({
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
  email: "",
  zip: "",
  town: "",
  street: "",
  phone: "",
  community: "",
  community_id: "",
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

const eventsCacheKey = computed(() => {
  if (!itemId.value) {
    return `events_new`;
  }

  return `events_${itemId.value.replaceAll("-", "_")}`;
});
const coursesCacheKey = computed(() => {
  if (!itemId.value) {
    return `courses_new`;
  }

  return `courses_${itemId.value.replaceAll("-", "_")}`;
});

const handleCreateEditClose = () => {
  createEditDialogOpen.value = false;
  itemId.value = null;
  dataTableRef.value?.resetActiveItems();
  newCourseFromCache.value = !!localStorage.getItem("courses_new");
  newEventFromCache.value = !!localStorage.getItem("events_new");
};

const handleShowPreview = (item: any) => {
  previewItem.value = item;
};
const handlePreviewClose = () => {
  previewItem.value = null;
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

  newCourseFromCache.value = !!localStorage.getItem("courses_new");
  newEventFromCache.value = !!localStorage.getItem("events_new");
});
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"
.orange
  color: orange
</style>
