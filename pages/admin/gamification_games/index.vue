<template>
  <div>
    <h2>Gamification</h2>
    <v-btn elevation="0" variant="outlined" @click="itemId = null; createEditDialogOpen = true">?</v-btn>
    <DataTable
      :fields="fields"
      endpoint=""
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
    />

    <DeleteItem
      v-if="confirmDeleteDialogOpen"
      @close="itemId = null; confirmDeleteDialogOpen = false"
      :item-id="itemId"
      endpoint=""
      term="diese ?"
    />
  </div>
</template>
<script lang="ts">
export default defineComponent({
  name: 'AdminGamificationGamesIndex',
  setup() {
    definePageMeta({
      layout: "admin",
    })
    const fields = ref([
      { text: '?', endpoint: '', type: 'switch', fieldToSwitch: 'is_active' },
      { text: '?', value: 'name', type: 'string' },
      { text: '', value: 'mdi-image-plus', type: 'icon', emit: 'openAddImagesDialog', tooltip: 'Bilder hinzufügen' },
    ])
    
    const dialog = ref(false)
    const item = ref({ name: '' })
    const loading = ref(false)
    const createEditDialogOpen = ref(false)
    const confirmDeleteDialogOpen = ref(false)
    const itemId = ref(null)

    const openCreateEditDialog = (id:string) => {
      itemId.value = id
      createEditDialogOpen.value = true
    }

    const openDeleteDialog = (id:string) => {
      itemId.value = id
      confirmDeleteDialogOpen.value = true
    }

    return {
      fields,
      loading,
      dialog,
      item,
      createEditDialogOpen,
      confirmDeleteDialogOpen,
      itemId,
      openCreateEditDialog,
      openDeleteDialog
    }
  }
})
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"

</style>