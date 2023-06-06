<template>
  <div>
   <h2>Einrichtungen</h2>

    <v-btn elevation="0" variant="outlined" @click="itemId = null; createEditDialogOpen = true">Neue Einrichtung</v-btn>

    <DataTable
      :fields="fields"
      endpoint="care_facilities"
      @openCreateEditDialogue="openCreateEditDialog"
      @openDeleteDialogue="openDeleteDialog"
      @openAddImagesDialog="openAddImagesDialog"
      @openAddFilesDialog="openAddFilesDialog"
    />

    <AdminCareFacilitiesCreateEdit
      :item-id="itemId"
      :item-placeholder="itemPlaceholder"
      v-if="createEditDialogOpen"
      @close="createEditDialogOpen = false"
      endpoint="care_facilities"
      concept-name="Einrichtung"
      :payload="{ active: true, kind: 'facility' }"
    />

    <DeleteItem
      v-if="confirmDeleteDialogueOpen"
      @close="itemId = null; confirmDeleteDialogueOpen = false"
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
  { text: '', type: 'move_down' },
  { text: '', type: 'move_up' },
  { text: 'Aktiv', endpoint: 'care_facilities', type: 'switch', fieldToSwitch: 'is_active' },
  { text: 'Name', value: 'name', type: 'string' },
  { text: 'Status', value: 'status', type: 'string' },
  { text: '', value: 'mdi-image-plus', type: 'icon', emit: 'openAddImagesDialog', tooltip: 'Bilder hinzufügen' },
  { text: '', value: 'mdi-file-document-plus', type: 'icon', emit: 'openAddFilesDialog', tooltip: 'Bilder hinzufügen' },
  { text: '', value: 'mdi-email-outline', type: 'icon', emit: '', tooltip: '' },
])

const itemPlaceholder = ref({
  name: '',
  description: '',
  category_ids: []
})

const dialog = ref(false)
const item = ref({ name: '' })
const loading = ref(false)
const createEditDialogOpen = ref(false)
const confirmDeleteDialogueOpen = ref(false)
const addImagesDialogOpen = ref(false)
const addFilesDialogOpen = ref(false)
const itemId = ref(null)

const openCreateEditDialog = (id:string) => {
  itemId.value = id
  createEditDialogOpen.value = true
}

const openDeleteDialog = (id:string) => {
  itemId.value = id
  confirmDeleteDialogueOpen.value = true
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