<template>
  <div>
   <h2>Kategorien</h2>

    <v-btn elevation="0" variant="outlined" @click="itemId = null; createEditDialogueOpen = true">Neue Einrichtung</v-btn>

    <DataTable
      :fields="fields"
      endpoint="care_facilities"
      @openCreateEditDialogue="openCreateEditDialogue"
      @openDeleteDialogue="openDeleteDialogue"
    />

    <AdminCareFacilitiesCreateEdit
      :item-id="itemId"
      v-if="createEditDialogueOpen"
      @close="createEditDialogueOpen = false"
      endpoint="care_facilities"
      concept-name="Einrichtung"
      :payload="{ active: true }"
    />

    <DeleteItem
      v-if="confirmDeleteDialogueOpen"
      @close="itemId = null; confirmDeleteDialogueOpen = false"
      :item-id="itemId"
      endpoint="care_facilities"
      term="diese Einrichtung"
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
      { text: 'Name', value: 'name', type: 'string' }
    ])
    
    const dialog = ref(false)
    const item = ref({ name: '' })
    const loading = ref(false)
    const createEditDialogueOpen = ref(false)
    const confirmDeleteDialogueOpen = ref(false)
    const itemId = ref(null)

    const openCreateEditDialogue = (id:string) => {
      console.log(id)
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
      itemId,
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