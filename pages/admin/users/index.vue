<template>
  <div>
    <v-row v-if="showBar">
      <v-col md="3">
        <span class="general-font-size is-dark-grey font-weight-bold"
          >Benutzer</span
        >
      </v-col>
      <v-col class="d-flex justify-end align-center">
        <div class="d-flex align-center mx-3">
          <v-icon size="x-small" color="success">mdi-circle</v-icon>
          <span class="pl-1 general-font-size is-dark-grey font-weight-bold"
            >Einrichtung online</span
          >
        </div>
        <div class="d-flex align-center mx-3">
          <v-icon size="x-small" color="error">mdi-circle</v-icon>
          <span class="pl-1 general-font-size is-dark-grey font-weight-bold"
            >Einrichtung nicht online</span
          >
        </div>
      </v-col>
    </v-row>
    <v-row align="center" v-if="showBar">
      <v-col md="3">
        <v-btn
          elevation="0"
          variant="outlined"
          @click="
            itemId = null;
            createEditDialogOpen = true;
          "
          >Neuer Benutzer</v-btn
        >
      </v-col>
      <v-col>
        <v-text-field
          width="50"
          prepend-icon="mdi-magnify"
          v-model="facilitySearchTerm"
          hide-details="auto"
          label="Benutzer durchsuchen"
        />
      </v-col>
    </v-row>

    <DataTable
      :fields="fields"
      endpoint="users"
      :search-query="facilitySearchTerm"
      :search-columns="facilitySearchColums"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      @mailUser="mailUser"
      @toogle-bar="showBar = !showBar"
      ref="dataTableRef"
      :disable-delete="false"
    />

    <AdminUsersCreateEdit
      :item-id="itemId"
      v-if="createEditDialogOpen"
      @close="
        itemId = null;
        createEditDialogOpen = false;
        itemId = null;
        dataTableRef?.resetActiveItems();
      "
      @refreshCollection="
        dataTableRef?.resetActiveItems();
        getUsers();
        itemId = null;
        createEditDialogOpen = false;
        itemId = null;
        dataTableRef?.resetActiveItems();
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
      endpoint="users"
      term="diesen Benutzer"
    />
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: "admin",
});

const showBar = ref(true);

const fields = ref([
  { prop: "firstname", text: "Vorname", value: "firstname", type: "string" },
  { prop: "lastname", text: "Nachname", value: "lastname", type: "string" },
  {
    prop: "",
    text: "Einrichtung",
    endpoint: "users",
    value: "care_facilities",
    type: "facilities",
  },
  {
    prop: "email",
    text: "E-mail",
    value: "email",
    emit: "mailUser",
    tooltip: "Benutzer E-Mail Kopieren",
  },
  {
    prop: "is_active_on_health_scope",
    text: "Status",
    type: "enumDropdown",
    endpoint: "users",
    value: "is_active_on_health_scope",
    enum_name: "facilitiesStatus",
    condition: "admin",
  },
  {
    value: "",
    type: "is-lk",
    tooltip: "Nutzer ist Admin.",
  },
  {
    value: "",
    type: "is-imported",
    tooltip: "",
  },
  {
    prop: "last_seen",
    text: "Zuletzt eingeloggt",
    value: "last_seen",
    type: "datetime",
  },
]);

const route = useRoute();
const loading = ref(false);
const createEditDialogOpen = ref(false);
const confirmDeleteDialogOpen = ref(false);
const itemId = ref(null);
const filter = ref({
  page: 1,
  per_page: 1000,
  sort_by: "created_at",
  sort_order: "DESC",
  searchQuery: null,
  concat: false,
  filters: [],
});
const dataTableRef = ref();

const facilitySearchColums = ref([
  "firstname",
  "lastname",
  "last_seen",
  "care_facilities",
]);
const facilitySearchTerm = ref("");

const openCreateEditDialog = (item: any) => {
  itemId.value = item.id;
  createEditDialogOpen.value = true;
};

const openDeleteDialog = (id: string) => {
  itemId.value = id;
  confirmDeleteDialogOpen.value = true;
};

const snackbar = useSnackbar();

const mailUser = async (id: String) => {
  const user = users.value.find((user) => user.id === id);
  if (process.client && user) {
    navigator.clipboard.writeText(user.email);
    snackbar.showSuccess(`E-Mail kopiert`);
  }
};

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());
api.setEndpoint("users");
const users = api.items;

const getUsers = async () => {
  loading.value = true;
  await api.retrieveCollection(filter.value);
  dataTableRef.value?.getItems();
  loading.value = false;
};

onMounted(async () => {
  await getUsers();

  const { userId } = route.query;

  if (!userId) return;

  openCreateEditDialog({ id: userId });
});
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"
</style>
