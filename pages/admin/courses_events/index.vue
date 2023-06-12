<template>
  <div>
    <h2>Kurse und Veranstaltungen</h2>
    <v-btn elevation="0" variant="outlined" class="mr-5" @click="itemPlaceholder.kind = 'course'; itemId = null; createEditDialogOpen = true">Kurs anlegen</v-btn>
    <v-btn elevation="0" variant="outlined" @click="itemPlaceholder.kind = 'event'; itemId = null; createEditDialogOpen = true">Vernanstaltung anlegen</v-btn>
    <DataTable
      :fields="fields"
      endpoint="care_facilities?kind=event"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
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
  { text: 'Bereich', value: '', type: 'string' },
  { text: 'Erstellt am', value: 'created_at', type: 'datetime' },
  { text: 'Beginn', value: 'course_start', type: 'datetime' },
  { text: 'Ende', value: 'course_end', type: 'datetime' },
  { text: 'Status', value: '', type: 'string' },
  { text: '', value: 'mdi-email-outline', type: 'icon', emit: '', tooltip: '' },
])

const createEditDialogOpen = ref(false)
const confirmDeleteDialogOpen = ref(false)
const itemId = ref(null)

const itemPlaceholder = ref({
  name: '',
  kind: 'event',
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