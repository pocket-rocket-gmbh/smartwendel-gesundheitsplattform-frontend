<template>
  <div>
    <h2>Kurse und Veranstaltungen</h2>
    <v-btn elevation="0" variant="outlined" class="mr-5" @click="itemPlaceholder.kind = 'course'; itemId = null; createEditDialogOpen = true">Kurs anlegen</v-btn>
    <v-btn elevation="0" variant="outlined" @click="itemPlaceholder.kind = 'event'; itemId = null; createEditDialogOpen = true">Veranstaltung anlegen</v-btn>
    <DataTable
      :fields="fields"
      endpoint="care_facilities?kind=event,course"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      defaultSortBy="kind"
    />

    <AdminCareFacilitiesCreateEdit
      v-if="createEditDialogOpen"
      :item-id="itemId"
      :item-placeholder="itemPlaceholder"
      @close="createEditDialogOpen = false"
      endpoint="care_facilities"
      :concept-name="itemPlaceholder.kind === 'course' ? 'Kurs' : 'Veranstaltung'"
    />

    <DeleteItem
      v-if="confirmDeleteDialogOpen"
      @close="itemId = null; confirmDeleteDialogOpen = false"
      :item-id="itemId"
      endpoint="care_facilities"
      term="diesen Kurse/Veranstaltung"
    />
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: "admin",
})

const fields = ref([
  { text: 'Aktiv', endpoint: 'care_facilities', type: 'switch', fieldToSwitch: 'is_active' },
  { text: 'Titel', value: 'name', type: 'string' },
  { text: 'Kind', endpoint: 'care_facilities', value: 'kind', type: 'enum', enum_name: 'facilitiesKind' },
  { text: 'Bereich', value: 'categories', type: 'associations_name' },
  { text: 'Beginn', value: 'course_start', type: 'datetime' },
  { text: 'Ende', value: 'course_end', type: 'datetime' },
])

const createEditDialogOpen = ref(false)
const confirmDeleteDialogOpen = ref(false)
const itemId = ref(null)

const itemPlaceholder = ref({
  name: '',
  kind: 'event',
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
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"

</style>