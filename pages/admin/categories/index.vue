<template>
  <div>
   <h2>Bereiche</h2>

    <v-btn elevation="0" variant="outlined" @click="itemId = null; createEditDialogOpen = true">Neuer Bereich</v-btn>

    <DataTable
      :fields="fields"
      endpoint="categories"
      default-sort-order="asc"
      default-sort-by="menu_order"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      @openAddSubCategoriesDialog="openAddSubCategoriesDialog"
      ref="dataTable"
    />

    <AdminCategoriesAddSubCategories
      v-if="addSubCategoriesDialogOpen"
      :category-id="itemId"
      @close="handleDialogClosed"
      @refreshCollection="useNuxtApp().$bus.$emit('triggerGetItems', null)"
    />

    <AdminCategoriesCreateEdit
      :item-id="itemId"
      v-if="createEditDialogOpen"
      @close="createEditDialogOpen = false"
      :item-placeholder="itemPlaceholder"
      endpoint="categories"
      concept-name="Bereich"
    />

    <DeleteItem
      v-if="confirmDeleteDialogOpen"
      @close="itemId = null; confirmDeleteDialogOpen = false"
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
      { text: 'Bereichsbezeichnung', value: 'name', type: 'string' },
      { text: '', value: 'mdi-plus-circle-outline', type: 'icon', emit: 'openAddSubCategoriesDialog', tooltip: 'Kategorien hinzufügen' },
    ])
    const dataTable = ref(null)
    const createEditDialogOpen = ref(false)
    const confirmDeleteDialogOpen = ref(false)
    const addSubCategoriesDialogOpen = ref(false)
    const itemId = ref(null)

    const itemPlaceholder = ref({
      name: '',
      scope: 'care_facility'
    })

    const openCreateEditDialog = (id:string) => {
      itemId.value = id
      createEditDialogOpen.value = true
    }

    const openDeleteDialog = (id:string) => {
      itemId.value = id
      confirmDeleteDialogOpen.value = true
    }

    const openAddSubCategoriesDialog = (id:string) => {
      itemId.value = id
      addSubCategoriesDialogOpen.value = true
    }

    const handleDialogClosed = () => {
      dataTable.value.resetActiveItems()
      itemId.value = null
      createEditDialogOpen.value = false
      confirmDeleteDialogOpen.value = false
      addSubCategoriesDialogOpen.value = false
    }

    return {
      fields,
      createEditDialogOpen,
      confirmDeleteDialogOpen,
      addSubCategoriesDialogOpen,
      itemId,
      openCreateEditDialog,
      openDeleteDialog,
      openAddSubCategoriesDialog,
      itemPlaceholder,
      handleDialogClosed,
      dataTable
    }
  }
})
</script>