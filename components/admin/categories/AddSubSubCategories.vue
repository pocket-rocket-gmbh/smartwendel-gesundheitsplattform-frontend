<template>
  <v-dialog
    v-model="dialog"
    width="700"
    transition="dialog-bottom-transition"
    @click:outside="emitClose()"
  >
    <v-card class="dialog-700">
      <v-card-title class="text-h5">
        {{ subCategory?.name }}: Unter-Kategorien
      </v-card-title>

      <v-btn
        size="x-small"
        elevation="0"
        variant="outlined"
        class="mb-1 ml-4"
        @click="itemId = null; createEditDialogOpen = true"
      >
        Neue Unter-Kategorie
      </v-btn>

      <AdminSubSubCategoriesCreateEdit
        :item-id="itemId"
        v-if="createEditDialogOpen"
        :item-placeholder="itemPlaceholder"
        @close="createEditDialogOpen = false; itemId = null;"
        :endpoint="`categories/${categoryId}/sub_categories/${subCategoryId}`"
        :overwrite-get-item-endpoint="`categories/${itemId}`"
        :overwrite-update-item-endpoint="`categories/${itemId}`"
        concept-name="Unter-Kategorien"
      />

      <DeleteItem
        v-if="confirmDeleteDialogOpen"
        @close="itemId = null; confirmDeleteDialogOpen = false"
        :item-id="itemId"
        endpoint="categories"
        term="diese Unter-Kategorie"
      />
      
      <DataTable
        :fields="fields"
        :endpoint="`categories/${categoryId}/sub_categories/${subCategoryId}`"
        overwrite-move-endpoint="categories"
        default-sort-order="asc"
        default-sort-by="menu_order"
        @openCreateEditDialog="openCreateEditDialog"
        @openDeleteDialog="openDeleteDialog"
      />

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          @click="emitClose()"
        >
          Schließen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
export default defineComponent({
  props: {
    categoryId: {
      type: String,
      required: true
    },
    subCategoryId: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const dialog = ref(true)
    const createEditDialogOpen = ref(false)
    const confirmDeleteDialogOpen = ref(false)
    const itemId = ref(null)

    const fields = ref([
      { text: '', type: 'move_down' },
      { text: '', type: 'move_up' },
      { text: 'Bezeichnung', value: 'name', type: 'string' },
      { text: 'Tags', value: 'tags', type: 'array' }
    ])


    const subCategory = ref(null)
    const api = useCollectionApi()
    api.setBaseApi(usePrivateApi())

    const getCategory = async () => {
      api.setEndpoint(`categories/${props.subCategoryId}`)
      await api.getItem()
      subCategory.value = api.item.value as any
    }

    onMounted(() => {
      getCategory()
    })

    const openCreateEditDialog = (id:string) => {
      itemId.value = id
      createEditDialogOpen.value = true
    }

    const openDeleteDialog = (id:string) => {
      itemId.value = id
      confirmDeleteDialogOpen.value = true
    }

    const itemPlaceholder = ref({
      name: '',
      scope: 'care_facility',
      tags: []
    })

    const emitClose = () => {
      emit('close')
    }

    return {
      dialog,
      emitClose,
      createEditDialogOpen,
      confirmDeleteDialogOpen,
      openCreateEditDialog,
      openDeleteDialog,
      fields,
      itemId,
      itemPlaceholder,
      subCategory
    }
  }
})
</script>
<style lang="sass" scoped>
button.v-btn
  width: 150px
</style>