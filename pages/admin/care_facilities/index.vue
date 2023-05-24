<template>
  <div>
   <h2>Einrichtungen</h2>

    <v-btn elevation="0" variant="outlined" @click="itemId = null; createEditDialogueOpen = true">Neue Einrichtung</v-btn>

    <DataTable
      :fields="fields"
      endpoint="care_facilities"
      @openCreateEditDialogue="openCreateEditDialogue"
      @openDeleteDialogue="openDeleteDialogue"
    />

    <AdminCareFacilitiesCreateEdit
      :item-id="itemId"
      :item-placeholder="itemPlaceholder"
      v-if="createEditDialogueOpen"
      @close="createEditDialogueOpen = false"
      endpoint="care_facilities"
      concept-name="Einrichtung"
      :payload="{ active: true, kind: 'doctor' }"
    />

    <DeleteItem
      v-if="confirmDeleteDialogueOpen"
      @close="itemId = null; confirmDeleteDialogueOpen = false"
      :item-id="itemId"
      endpoint="care_facilities"
      term="diese Einrichtung"
      @refreshCollection="useNuxtApp().$bus.$emit('triggerGetItems', null)"
    />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'AdminCareFacilitiesIndex',
  setup() {
    definePageMeta({
      layout: "admin",
    })

    const fields = ref([
      { text: '', type: 'move_down' },
      { text: '', type: 'move_up' },
      { text: 'Aktiv', endpoint: 'care_facilities', type: 'switch', fieldToSwitch: 'is_active' },
      { text: 'Name', value: 'name', type: 'string' },
      { text: 'Einrichtungsart', value: 'kind', type: 'string' },
      { text: 'Status', value: 'status', type: 'string' },
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
    const createEditDialogueOpen = ref(false)
    const confirmDeleteDialogueOpen = ref(false)
    const addImagesDialogueOpen = ref(false)
    const itemId = ref(null)

    const openCreateEditDialogue = (id:string) => {
      itemId.value = id
      createEditDialogueOpen.value = true
    }

    const openDeleteDialogue = (id:string) => {
      itemId.value = id
      confirmDeleteDialogueOpen.value = true
    }

    return {
      fields,
      loading,
      dialog,
      item,
      createEditDialogueOpen,
      confirmDeleteDialogueOpen,
      addImagesDialogueOpen,
      itemId,
      itemPlaceholder,
      openCreateEditDialogue,
      openDeleteDialogue
    }
  }
})
</script>
<style lang="sass">
.v-dialog--custom
  width: 30%
</style>