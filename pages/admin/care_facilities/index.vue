<template>
  <div>
   <h2>Einrichtungen</h2>

    <v-btn elevation="0" variant="outlined" @click="itemId = null; createEditDialogOpen = true">Neue Einrichtung</v-btn>

    <DataTable
      :fields="fields"
      endpoint="care_facilities?kind=facility"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      @openAddImagesDialog="openAddImagesDialog"
      @openAddFilesDialog="openAddFilesDialog"
    />

    <AdminCareFacilitiesCreateEdit
      v-if="createEditDialogOpen"
      :item-id="itemId"
      :item-placeholder="itemPlaceholder"
      @close="createEditDialogOpen = false"
      endpoint="care_facilities"
      concept-name="Einrichtung"
    />

    <DeleteItem
      v-if="confirmDeleteDialogOpen"
      @close="itemId = null; confirmDeleteDialogOpen = false"
      :item-id="itemId"
      endpoint="care_facilities"
      term="diese Einrichtung"
    />

    <AdminCareFacilitiesAddImages
      :item-id="itemId"
      v-if="addImagesDialogOpen"
      @close="itemId = null; addImagesDialogOpen = false"
    />

    <AdminCareFacilitiesAddFiles
      :item-id="itemId"
      v-if="addFilesDialogOpen"
      @close="itemId = null; addFilesDialogOpen = false"
    />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "admin",
})

const fields = ref([
  { text: 'Aktiv', endpoint: 'care_facilities', type: 'switch', fieldToSwitch: 'is_active' },
  { text: 'Name', value: 'name', type: 'string' },
  { text: 'Status', endpoint: 'care_facilities', type: 'enumDropdown', value: 'status', enum_name: 'facilitiesStatus' },
  { text: '', value: 'mdi-image-plus-outline', type: 'icon', emit: 'openAddImagesDialog', tooltip: 'Bilder hinzufügen' },
  { text: '', value: 'mdi-file-document-plus-outline', type: 'icon', emit: 'openAddFilesDialog', tooltip: 'Datei hinzufügen' },
])

const itemPlaceholder = ref({
  name: '',
  kind: 'facility',
  is_active: false,
  status: 'is_checked',
  description: '',
  category_ids: []
})

const createEditDialogOpen = ref(false)
const confirmDeleteDialogOpen = ref(false)
const addImagesDialogOpen = ref(false)
const addFilesDialogOpen = ref(false)
const itemId = ref(null)

const openCreateEditDialog = (id:string) => {
  itemId.value = id
  createEditDialogOpen.value = true
}

const openDeleteDialog = (id:string) => {
  itemId.value = id
  confirmDeleteDialogOpen.value = true
}

const openAddImagesDialog = (id: string) => {
  itemId.value = id
  addImagesDialogOpen.value = true
}

const openAddFilesDialog = (id: string) => {
  itemId.value = id
  addFilesDialogOpen.value = true
}
</script>
<style lang="sass">
.v-dialog--custom
  width: 30%
</style>