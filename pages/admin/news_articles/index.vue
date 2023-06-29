<template>
  <div>
    <h2>Beiträge</h2>
    <v-btn elevation="0" variant="outlined" @click="itemId = null; createEditDialogOpen = true">Newsartikel anlegen</v-btn>
    <DataTable
      :fields="fields"
      endpoint="care_facilities?kind=news"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
    />

    <AdminCareFacilitiesCreateEdit
      v-if="createEditDialogOpen"
      :item-id="itemId"
      :item-placeholder="itemPlaceholder"
      @close="createEditDialogOpen = false"
      endpoint="care_facilities"
      concept-name="Beiträge"
    />

    <DeleteItem
      v-if="confirmDeleteDialogOpen"
      @close="itemId = null; confirmDeleteDialogOpen = false"
      :item-id="itemId"
      endpoint="care_facilities"
      term="diesen Beitrag"
    />
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: "admin",
})

const user = useUser();

const availableFields = [
  { text: 'Aktiv', endpoint: 'care_facilities', type: 'switch', fieldToSwitch: 'is_active' },
  { text: 'Titel', value: 'name', type: 'string' },
  { text: 'Status', endpoint: 'care_facilities', type: 'enumDropdown', value: 'status', enum_name: 'facilitiesStatus', condition: "admin" },
  { text: 'Status', endpoint: 'care_facilities', type: 'string', value: 'status', condition: "facility_owner" },
  { text: 'Bereich', value: 'categories', type: 'associations_name' },
  { text: 'Erstellt am', value: 'created_at', type: 'datetime' },
  { text: 'Autor', value: '', type: 'string' },
]

const fields = ref([])

const createEditDialogOpen = ref(false)
const confirmDeleteDialogOpen = ref(false)
const itemId = ref(null)

const itemPlaceholder = ref({
  name: '',
  kind: 'news',
  status: 'is_checked',
  is_active: false,
  description: '',
  category_ids: []
})

const openCreateEditDialog = (id:string) => {
  itemId.value = id
  createEditDialogOpen.value = true
}

const openDeleteDialog = (id:string) => {
  itemId.value = id
  confirmDeleteDialogOpen.value = true
}

onMounted(()=> {
  const currentUserRole = user.currentUser.role
  availableFields.forEach(field => {
    if (!field.condition) fields.value.push(field);
    if (currentUserRole === field.condition) fields.value.push(field);
  })
})
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"

</style>