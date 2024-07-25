<template>
  <div>
    <span class="general-font-size is-dark-grey font-weight-bold">Tooltips</span>

    <div>
      <v-row align="center" v-if="showBar">
        <v-col md="3">
          <v-btn
            elevation="0"
            variant="outlined"
            @click="
              itemId = null;
              createEditDialogOpen = true;
            "
            >Tooltip erstellen</v-btn
          >
        </v-col>
        <v-col class="d-flex align-center">
          <v-text-field
            width="50"
            prepend-icon="mdi-magnify"
            v-model="facilitySearchTerm"
            hide-details="auto"
            label="Tooltips durchsuchen"
          />
        </v-col>
      </v-row>
    </div>

    <DataTable
      :fields="fields"
      endpoint="tooltips"
      :search-query="facilitySearchTerm"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      @toogle-bar="showBar = !showBar"
      ref="dataTableRef"
      :noBar="true"
      :disable-delete="false"
    />

    <AdminTooltipsCreateEdit
      :item-id="itemId"
      v-if="createEditDialogOpen"
      :item-placeholder="itemPlaceholder"
      endpoint="tooltips"
      @close="
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
      endpoint="tooltips"
      term="diesen Tooltip"
      @refreshCollection="useNuxtApp().$bus.$emit('triggerGetItems', null)"
    />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "admin",
});
const fields = ref([
  { prop: "name", text: "Name", value: "name", type: "string" },
  { prop: "content", text: "Inhalt", value: "content", type: "string" },
  { prop: "url", text: "Url", value: "url", type: "string" },
]);

const itemPlaceholder = ref({
  name: "",
  scope: "tooltips",
});

const showBar = ref(true);

const facilitySearchTerm = ref("");

const dialog = ref(false);
const item = ref({ name: "" });
const loading = ref(false);
const createEditDialogOpen = ref(false);
const confirmDeleteDialogOpen = ref(false);
const itemId = ref(null);
const dataTableRef = ref();

const openCreateEditDialog = (item: any) => {
  itemId.value = item.id;
  createEditDialogOpen.value = true;
};

const openDeleteDialog = (id: string) => {
  itemId.value = id;
  confirmDeleteDialogOpen.value = true;
};
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"
</style>
