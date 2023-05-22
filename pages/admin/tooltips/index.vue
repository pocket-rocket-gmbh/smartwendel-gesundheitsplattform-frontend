<template>
  <div>
    <h2>Tooltips</h2>
    <v-btn elevation="0" variant="outlined" @click="itemId = null; createEditDialogOpen = true">Neuer Tooltip</v-btn>
    <DataTable
      :fields="fields"
      endpoint="tooltips"
      @openCreateEditDialogue="openCreateEditDialogue"
      @openDeleteDialogue="openDeleteDialogue"
    />

    <AdminTooltipsCreateEdit
      :item-id="itemId"
      v-if="createEditDialogOpen"
      @close="itemId = null; createEditDialogOpen = false"
      @refreshCollection="getItems()"
    />

    <DeleteItem
      v-if="confirmDeleteDialogueOpen"
      @close="itemId = null; confirmDeleteDialogueOpen = false"
      :item-id="itemId"
      endpoint="tooltips"
      term="dieser Tooltip"
    />
    
  </div>
</template>
<script lang="ts">
export default defineComponent({
  name: 'AdminTooltipsIndex',
  setup() {
    definePageMeta({
      layout: "admin",
    })
    const fields = ref([
      { text: 'Name', value: 'name', type: 'string' },
      { text: 'Inhalt', value: 'content', type: 'string' },
      { text: 'Url', value: 'url', type: 'string' },
    ])

    const dialog = ref(false)
    const item = ref({ name: '' })
    const loading = ref(false)
    const confirmDeleteDialogueOpen = ref(false)
    const itemId = ref(null)
    const createEditDialogOpen = ref(false)

    const api = useCollectionApi()
    api.setBaseApi(usePrivateApi())
    api.setEndpoint('tooltips')
    const tooltips = api.items

    console.log(tooltips)
    const getItems = async () => {
      loading.value = true
      const options = { page: 1, per_page: 1000, sort_by: 'menu_order', sort_order: 'ASC', searchQuery: null, concat: false, filters: [] }
      await api.retrieveCollection(options)
      loading.value = false
    }

   onMounted(() => {
      getItems()
    })

    const openCreateEditDialogue = (id:string) => {
      itemId.value = id
      createEditDialogOpen.value = true
    }

    const openCreateEditDialog = (id) => {
      itemId.value = id
      createEditDialogOpen.value = true
    }

    const openDeleteDialogue = (id:string) => {
      itemId.value = id
      confirmDeleteDialogueOpen.value = true
    }

    return {
      fields,
      loading,
      dialog,
      tooltips,
      item,
      createEditDialogOpen,
      confirmDeleteDialogueOpen,
      itemId,
      openCreateEditDialogue,
      openDeleteDialogue,
      openCreateEditDialog,
      getItems
    }
  }
})
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"

</style>