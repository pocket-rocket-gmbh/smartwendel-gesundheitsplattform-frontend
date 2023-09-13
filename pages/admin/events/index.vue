<template>
  <div>
    <h2 v-if="useUser().isFacilityOwner()">Meine Veranstaltungen</h2>
    <h2 v-else>Veranstaltungen</h2>
    <v-alert type="info" density="compact" closable class="my-2"
      >Hier kannst du deine Veranstaltung anlegen. Je spezifischer deine Angaben sind, desto besser können dich Besucherinnen und Besuchern auf der Webseite
      finden. Pflichtfelder sind mit einem Sternchen versehen.</v-alert
    >
    <template v-if="setupFinished">
      <v-row align="center">
        <v-col md="5">
          <div class="my-5">
            <v-btn
              elevation="0"
              variant="outlined"
              @click="
                itemPlaceholder.kind = 'event';
                itemId = null;
                createEditDialogOpen = true;
              "
            >
              Veranstaltung anlegen
            </v-btn>
          </div>
        </v-col>
        <v-col>
          <v-text-field width="50" prepend-icon="mdi-magnify" v-model="facilitySearchTerm" hide-details="auto" label="Veranstaltungen durchsuchen" />
        </v-col>
      </v-row>
    </template>
    <v-alert v-if="!setupFinished && !loading" type="info" density="compact" closable class="mt-2">
      Bitte kontrolliere zunächst, dass du deine Einrichtung angelegt hast und wir dich freigegeben haben. Danach kannst du Kurse, Veranstaltungen sowie
      Beiträge anlegen.
    </v-alert>

    <DataTable
      ref="dataTableRef"
      :fields="fields"
      endpoint="care_facilities?kind=event"
      :search-query="facilitySearchTerm"
      :search-columns="facilitySearchColums"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      defaultSortBy="kind"
      :disable-delete="false"
      :draft-required="draftRequiredFields"
    />

    <AdminEventsCreateEdit
      scroll-strategy="none"
      v-if="createEditDialogOpen"
      :item-id="itemId"
      :item-placeholder="itemPlaceholder"
      @close="handleCreateEditClose"
      endpoint="care_facilities"
      :concept-name="'Veranstaltung'"
      :enableDraft="true"
      :required-for-draft="['name']"
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
      term="diesen Kurs oder Veranstaltung"
    />
  </div>
</template>
<script lang="ts" setup>
import { getCurrentUserFacilities } from "~/utils/filter.utils";
import { Facility } from "~/store/searchFilter";
import { RequiredField } from "~/types/facilities";
import { isCompleteEvent } from "~/utils/facility.utils";

definePageMeta({
  layout: "admin",
});

const user = useUser();
const loading = ref(false);
const router = useRouter();

const fields = [
  {
    prop: "is_active",
    text: "Offline/Online",
    endpoint: "care_facilities",
    type: "switch",
    tooltip: "Hiermit kannst du deine Veranstaltung Online oder Offline schalten",
    fieldToSwitch: "is_active",
    disabledConditions: (item: any) => {
      const res = [
        isCompleteEvent,
        () => {
          return !useUser().currentUser?.is_active_on_health_scope;
        },
      ].some((condition) => {
        const resCond = condition(item);
        return resCond;
      });
      return res;
    },
    disabledTooltip: "Bitte alle Pflichtfelder zu deiner Veranstaltung ausfüllen, danach kannst du deine Veranstaltung über den Button Online schalten",
  },
  { prop: "name", text: "Titel", value: "name", type: "string" },
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
    props: ["name_instructor"],
  },
  {
    props: ["description"],
    checkHandler: (description?: string) => !description || description === "<p><br></p>",
  },
  {
    props: ["tags"],
  },
  {
    props: ["event_dates"],
  },
  {
    props: ["street", "zip", "community_id", "town"],
  },
  {
    props: ["name_responsible_person"],
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

const goToFacility = (id: string) => {
  router.push({ path: `/public/care_facilities/${id}` });
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
