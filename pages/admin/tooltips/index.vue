<template>
  <div>
    <h2>Tooltips</h2>
    <v-btn elevation="0" variant="outlined" @click="itemId = null; createEditDialogOpen = true">Tooltip erstellen</v-btn>
    <DataTable
      :fields="fields"
      endpoint="tooltips"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      ref="dataTableRef"
    />

    <AdminTooltipsCreateEdit
      :item-id="itemId"
      v-if="createEditDialogOpen"
      :item-placeholder="itemPlaceholder"
      endpoint="tooltips"
      @close="itemId = null; createEditDialogOpen = false; itemId = null; dataTableRef?.resetActiveItems()"
    />

    <DeleteItem
      v-if="confirmDeleteDialogOpen"
      @close="itemId = null; confirmDeleteDialogOpen = false; dataTableRef?.resetActiveItems()"
      :item-id="itemId"
      endpoint="tooltips"
      term="diesen Tooltip"
      @refreshCollection="useNuxtApp().$bus.$emit('triggerGetItems', null)"
    />
  </div>
</template>
<script lang="ts">
export default defineComponent({
  name: 'AdminFilterIndex',
  setup() {
    definePageMeta({
      layout: "admin",
    })
    const fields = ref([
      { text: 'Name', value: 'name', type: 'string' },
      { text: 'Inhalt', value: 'content', type: 'string' },
      { text: 'Url', value: 'url', type: 'string' },
    ])

    const itemPlaceholder = ref({
      name: '',
      scope: 'tooltips'
    })

    const dialog = ref(false)
    const item = ref({ name: '' })
    const loading = ref(false)
    const createEditDialogOpen = ref(false)
    const confirmDeleteDialogOpen = ref(false)
    const itemId = ref(null)
    const dataTableRef = ref();

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
      itemPlaceholder,
      confirmDeleteDialogOpen,
      itemId,
      openCreateEditDialog,
      openDeleteDialog,
      dataTableRef
    }
  }
})
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"

</style>