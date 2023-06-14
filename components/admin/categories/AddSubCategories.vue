<template>
  <v-dialog
    v-model="dialog"
    width="700"
    transition="dialog-bottom-transition"
    @click:outside="emitClose()"
  >
    <v-card class="dialog-700">
      <v-card-title class="text-h5">
        {{ category?.name }}: Kategorien
      </v-card-title>

      <v-btn
        size="x-small"
        elevation="0"
        variant="outlined"
        class="mb-1 ml-4"
        @click="itemId = null; createEditDialogOpen = true"
      >
        Neue Kategorie
      </v-btn>

      <AdminSubCategoriesCreateEdit
        :item-id="itemId"
        v-if="createEditDialogOpen"
        :item-placeholder="itemPlaceholder"
        @close="createEditDialogOpen = false"
        :endpoint="`categories/${categoryId}`"
        :overwrite-get-item-endpoint="`categories/${itemId}`"
        :overwrite-update-item-endpoint="`categories/${itemId}`"
        concept-name="Kategorien"
      />

      <AdminCategoriesAddSubSubCategories
        v-if="addSubSubCategoriesDialogOpen"
        :category-id="categoryId"
        :sub-category-id="itemId"
        @close="itemId = null; addSubSubCategoriesDialogOpen = false;"
      />

      <DeleteItem
        v-if="confirmDeleteDialogOpen"
        @close="itemId = null; confirmDeleteDialogOpen = false"
        :item-id="itemId"
        endpoint="categories"
        term="diese Kategorie"
      />
      <DataTable
        :fields="fields"
        :endpoint="`categories/${categoryId}/sub_categories`"
        overwrite-move-endpoint="categories"
        default-sort-order="asc"
        default-sort-by="menu_order"
        @openCreateEditDialog="openCreateEditDialog"
        @openDeleteDialog="openDeleteDialog"
        @openAddSubSubCategoriesDialog="openAddSubSubCategoriesDialog"
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
    }
  },
  setup(props, { emit }) {
    const dialog = ref(true)
    const createEditDialogOpen = ref(false)
    const confirmDeleteDialogOpen = ref(false)
    const addSubSubCategoriesDialogOpen = ref(false)
    const itemId = ref(null)

    const fields = ref([
      { text: '', type: 'move_down' },
      { text: '', type: 'move_up' },
      { text: 'Bezeichnung', value: 'name', type: 'string' },
      { text: 'Unter-Kategorien', value: 'sub_sub_categories', type: 'associations_name' },
      { text: '', value: 'mdi-plus-circle-outline', type: 'icon', emit: 'openAddSubSubCategoriesDialog', tooltip: 'Unter-Kategorien hinzufügen' },
    ])

    const openCreateEditDialog = (id:string) => {
      itemId.value = id
      createEditDialogOpen.value = true
    }

    const category = ref(null)
    const api = useCollectionApi()
    api.setBaseApi(usePrivateApi())

    const getCategory = async () => {
      api.setEndpoint(`categories/${props.categoryId}`)
      await api.getItem()
      category.value = api.item.value as any
    }

    const openDeleteDialog = (id:string) => {
      itemId.value = id
      confirmDeleteDialogOpen.value = true
    }

    const itemPlaceholder = ref({
      name: '',
      scope: 'care_facility'
    })

    const openAddSubSubCategoriesDialog = (id:String) => {
      itemId.value = id
      addSubSubCategoriesDialogOpen.value = true
    }

    const emitClose = () => {
      emit('close')
    }

    onMounted(() => {
      getCategory()
    })
    return {
      dialog,
      emitClose,
      createEditDialogOpen,
      confirmDeleteDialogOpen,
      openCreateEditDialog,
      openDeleteDialog,
      addSubSubCategoriesDialogOpen,
      openAddSubSubCategoriesDialog,
      fields,
      itemId,
      itemPlaceholder,
      category
    }
  }
})
</script>
<style lang="sass" scoped>
button.v-btn
  width: 150px
</style>