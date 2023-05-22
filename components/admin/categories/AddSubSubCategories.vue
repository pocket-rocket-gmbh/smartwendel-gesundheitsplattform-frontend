<template>
  <v-dialog
    v-model="dialog"
    width="700"
    transition="dialog-bottom-transition"
    @click:outside="emitClose()"
  >
    <v-card class="dialog-700">
      <v-card-title class="text-h5">
        Unter-Kategorien
      </v-card-title>

      <v-btn
        size="x-small"
        elevation="0"
        variant="outlined"
        class="mb-1 ml-4"
        @click="itemId = null; createEditDialogueOpen = true"
      >
        Neue Unter-Kategorie
      </v-btn>

      <AdminSubSubCategoriesCreateEdit
        :item-id="itemId"
        v-if="createEditDialogueOpen"
        :item-placeholder="itemPlaceholder"
        @close="createEditDialogueOpen = false"
        :endpoint="`categories/${categoryId}/sub_categories/${subCategoryId}`"
        :overwrite-get-item-endpoint="`categories/${itemId}`"
        :overwrite-update-item-endpoint="`categories/${itemId}`"
        concept-name="Unter-Kategorien"
      />

      <DeleteItem
        v-if="confirmDeleteDialogueOpen"
        @close="itemId = null; confirmDeleteDialogueOpen = false"
        :item-id="itemId"
        endpoint="categories"
        term="diese Unter-Kategorie"
        @refreshCollection="useNuxtApp().$bus.$emit('triggerGetItems', null)"
      />
      
      <DataTable
        :fields="fields"
        :endpoint="`categories/${categoryId}/sub_categories/${subCategoryId}`"
        overwrite-move-endpoint="categories"
        default-sort-order="asc"
        default-sort-by="menu_order"
        @openCreateEditDialogue="openCreateEditDialogue"
        @openDeleteDialogue="openDeleteDialogue"
      />

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          text
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
    const createEditDialogueOpen = ref(false)
    const confirmDeleteDialogueOpen = ref(false)
    const itemId = ref(null)

    const fields = ref([
      { text: '', type: 'move_down' },
      { text: '', type: 'move_up' },
      { text: 'Name', value: 'name', type: 'string' },
      { text: 'Tags', value: 'tags', type: 'array' }
    ])

    const openCreateEditDialogue = (id:string) => {
      itemId.value = id
      createEditDialogueOpen.value = true
    }

    const openDeleteDialogue = (id:string) => {
      itemId.value = id
      confirmDeleteDialogueOpen.value = true
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
      createEditDialogueOpen,
      confirmDeleteDialogueOpen,
      openCreateEditDialogue,
      openDeleteDialogue,
      fields,
      itemId,
      itemPlaceholder
    }
  }
})
</script>
<style lang="sass" scoped>
button.v-btn
  width: 150px
</style>