<template>
  <div>
    <h2 v-if="useUser().isFacilityOwner()">Meine Beiträge</h2>
    <h2 v-else>Beiträge</h2>
    <v-alert v-if="!setupFinished && !loading" type="info" density="compact" closable class="mt-2">
      Bitte kontrolliere zunächst, dass du deine Einrichtung angelegt hast und wir dich freigegeben haben. Danach kannst
      du Kurse und Veranstaltungen sowie Beiträge anlegen.
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
          :class="{ orange: newNewsFromCache }"
        >
          Beitrag anlegen <span v-if="newNewsFromCache"> - weiter</span>
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
      :cache-prefix="'news'"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      ref="dataTableRef"
    />

    <AdminNewsCreateEdit
      v-if="createEditDialogOpen"
      :item-id="itemId"
      :item-placeholder="itemPlaceholder"
      @close="handleCreateEditClose"
      endpoint="care_facilities"
      concept-name="Beiträge"
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
      term="diesen Beitrag"
    />
  </div>
</template>
<script lang="ts" setup>
import { Facility } from "~/store/searchFilter";

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
        () => {
          return !useUser().currentUser?.is_active_on_health_scope;
        },
      ].some((condition) => {
        const resCond = condition();
        return resCond;
      });
      return res;
    },
  },
  { prop: "name", text: "Titel", value: "name", type: "string" },
  { value: "", type: "beinEdited"},
  { prop: "created_at", text: "Erstellt am", value: "created_at", type: "datetime" },
  {
    prop: "user.firstname",
    text: "Erstellt von",
    value: "user.name",
    condition: "admin",
    type: "button",
    action: (item: any) => router.push({ path: "/admin/users", query: { userId: item?.user?.id } }),
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

const newNewsFromCache = ref(false);

const cacheKey = computed(() => {
  if (!itemId.value) {
    return `news_new`;
  }

  return `news_${itemId.value.replaceAll("-", "_")}`;
});

const handleCreateEditClose = () => {
  createEditDialogOpen.value = false;
  itemId.value = null;
  dataTableRef?.value?.getItems();
  dataTableRef.value?.resetActiveItems();
  newNewsFromCache.value = !!localStorage.getItem("facilities_new");
};

const openCreateEditDialog = (item: any) => {
  itemId.value = item.id;
  createEditDialogOpen.value = true;
};

const openDeleteDialog = (id: string) => {
  itemId.value = id;
  confirmDeleteDialogOpen.value = true;
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

  newNewsFromCache.value = !!localStorage.getItem("news_new");

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
