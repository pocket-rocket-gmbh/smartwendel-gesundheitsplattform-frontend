<template>
  <div>
    <div>
      <div class="general-font-size is-dark-grey font-weight-bold">Beschwerde</div>
    </div>
    <v-row align="center" v-if="showBar">
      <v-col></v-col>

      <v-col md="9" class="d-flex justify-end">
        <v-text-field
          width="50"
          prepend-icon="mdi-magnify"
          v-model="searchTerm"
          hide-details="auto"
          label="Beschwerde durchsuchen"
        />
      </v-col>
    </v-row>

    <DataTable
      ref="dataTableRef"
      :fields="fields"
      endpoint="complaints"
      :search-query="searchTerm"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      defaultSortBy="created_at"
      :disable-delete="false"
      @toogle-bar="showBar = !showBar"
      @generatePdf="generatePdf"
      :noBar="true"
    />

    <AdminComplaintsCreateEdit
      v-if="createEditDialogOpen"
      @close="
        itemId = null;
        createEditDialogOpen = false;
        itemId = null;
        dataTableRef?.resetActiveItems();
        handleCreateEditClose();
      "
      @refreshCollection="
        dataTableRef?.resetActiveItems();
        itemId = null;
        createEditDialogOpen = false;
        itemId = null;
        dataTableRef?.resetActiveItems();
      "
      :item-id="itemId"
    />
    <DeleteItem
      v-if="confirmDeleteDialogOpen"
      @close="
        itemId = null;
        confirmDeleteDialogOpen = false;
        dataTableRef?.resetActiveItems();
        handleCreateEditClose();
      "
      :item-id="itemId"
      endpoint="complaints"
      term="diese Beschwerde"
    />
  </div>
</template>
<script lang="ts" setup>
import { ResultStatus } from "@/types/serverCallResult";
import { no } from "vuetify/locale";

const snackbar = useSnackbar();
const privateApi = usePrivateApi();

definePageMeta({
  layout: "admin",
});

const pdfUrl = ref("");

const generatePdf = async (item: any) => {
  const result = await privateApi.call("get", `/complaints/${item.id}/history_pdf`);
  if (result.status === ResultStatus.SUCCESSFUL) {
    pdfUrl.value = result.data.resource.history_pdf_url;
    openPdf();
  } else {
    snackbar.showError("Ein Fehler ist aufgetreten");
  }
};

const openPdf = () => {
  return window.open(pdfUrl.value, "_blank");
};

const showBar = ref(true);
const searchTerm = ref("");

const router = useRouter();

const fields = [
  {
    prop: "name",
    text: "Titel",
    value: "page_title",
    type: "string",
    width: "200",
  },
  { prop: "name", text: "Inhalt URL", value: "url", width: "300", type: "string", break_text: true, action: (item: any) => {
      handleButtonClick(item);
    }, },
  {
    prop: "created_at",
    text: "Erstellt am",
    value: "created_at",
    type: "datetime",
    width: "200",
  },
  { prop: "name", text: "Name", value: "reporter_name", type: "string" },
  { prop: "name", text: "E-Mail", value: "reporter_email", type: "string" },
  {
    prop: "meta_data",
    text: "Plattform",
    condition: "admin",
    type: "button",
    width: "100",
  },
  {
    prop: "kind",
    text: "Typ",
    type: "enumKinds",
    endpoint: "complaints",
    value: "kind",
    enum_name: "complaintsKind",
    condition: "admin",
    width: "200",
  },
  {
    text: "Maßnahme",
    endpoint: "complaints",
    value: "last_action",
    type: "enum",
    enum_name: "complaintsActions",
    width: "100",
  },
  {
    text: "Protokol",
    value: "reporter_email",
    type: "protocol",
    width: "100",
  },

];

const dataTableRef = ref();

const createEditDialogOpen = ref(false);
const confirmDeleteDialogOpen = ref(false);
const itemId = ref(null);

const openCreateEditDialog = (item: any) => {
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

const route = useRoute();

const handleButtonClick = (link: string) => {
  event.stopPropagation();
  goToLink(link);
};

const goToLink = (item: any) => {
  console.log(item)
  const link = `${window.location.origin}/public/care_facilities/${item?.meta_data?.facility_id}`;
  return window.open(link, "_blank");
};

onMounted(async () => {
  const complaint = route.query.complaint;
  if (!complaint) return;
  openCreateEditDialog({ id: complaint });
});
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"
</style>
