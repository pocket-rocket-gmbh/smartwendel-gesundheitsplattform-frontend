<template>
  <div>
   <h2>Bereiche</h2>

    <v-btn elevation="0" variant="outlined" @click="itemId = null; createEditDialogueOpen = true">Neuer Bereich</v-btn>

    <DataTable
      :fields="fields"
      endpoint="categories"
      default-sort-order="asc"
      default-sort-by="menu_order"
      @openCreateEditDialogue="openCreateEditDialogue"
      @openDeleteDialogue="openDeleteDialogue"
      @openAddSubCategoriesDialogue="openAddSubCategoriesDialogue"
    />

    <AdminCategoriesAddSubCategories
      v-if="addSubCategoriesDialogueOpen"
      :category-id="itemId"
      @close="itemId = null; addSubCategoriesDialogueOpen = false;"
    />

    <AdminCategoriesCreateEdit
      :item-id="itemId"
      v-if="createEditDialogueOpen"
      @close="createEditDialogueOpen = false"
      :item-placeholder="itemPlaceholder"
      endpoint="categories"
      concept-name="Bereich"
    />

    <DeleteItem
      v-if="confirmDeleteDialogueOpen"
      @close="itemId = null; confirmDeleteDialogueOpen = false"
      :item-id="itemId"
      endpoint="categories"
      term="diesen Bereich"
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
      { text: 'Name', value: 'name', type: 'string' },
      { text: '', value: 'mdi-plus-circle-outline', type: 'icon', emit: 'openAddSubCategoriesDialogue', tooltip: 'Kategorien hinzufügen' },
    ])
    
    const createEditDialogueOpen = ref(false)
    const confirmDeleteDialogueOpen = ref(false)
    const addSubCategoriesDialogueOpen = ref(false)
    const itemId = ref(null)

    const itemPlaceholder = ref({
      name: '',
      scope: 'care_facility'
    })

    const openCreateEditDialogue = (id:string) => {
      itemId.value = id
      createEditDialogueOpen.value = true
    }

    const openDeleteDialogue = (id:string) => {
      itemId.value = id
      confirmDeleteDialogueOpen.value = true
    }

    const openAddSubCategoriesDialogue = (id:string) => {
      itemId.value = id
      addSubCategoriesDialogueOpen.value = true
    }

    return {
      fields,
      createEditDialogueOpen,
      confirmDeleteDialogueOpen,
      addSubCategoriesDialogueOpen,
      itemId,
      openCreateEditDialogue,
      openDeleteDialogue,
      openAddSubCategoriesDialogue,
      itemPlaceholder
    }
  }
})
</script>