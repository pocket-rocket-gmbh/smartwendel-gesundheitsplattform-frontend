<template>
  <v-dialog
    v-model="dialog"
    width="700"
    transition="dialog-bottom-transition"
    @click:outside="emitClose()"
  >
    <v-card class="dialog-700">
      <v-card-title class="text-h5">
        Leistungsarten
      </v-card-title>

      <v-btn
        size="x-small"
        elevation="0"
        variant="outlined"
        class="mb-1 ml-4"
        @click="itemId = null; createEditDialogueOpen = true"
      >
        Neue Leistungsart
      </v-btn>

      <AdminSubCategoriesCreateEdit
        :item-id="itemId"
        v-if="createEditDialogueOpen"
        :item-placeholder="itemPlaceholder"
        @close="createEditDialogueOpen = false"
        :endpoint="`categories/${categoryId}`"
        :overwrite-get-item-endpoint="`categories/${itemId}`"
        :overwrite-update-item-endpoint="`categories/${itemId}`"
        concept-name="Leistungsarten"
      />

      <DeleteItem
        v-if="confirmDeleteDialogueOpen"
        @close="itemId = null; confirmDeleteDialogueOpen = false"
        :item-id="itemId"
        endpoint="categories"
        term="diesen Leistungsbereich"
      />
      
      <DataTable
        :fields="fields"
        :endpoint="`categories/${categoryId}/sub_categories`"
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
      { text: 'Leistungen', value: 'tags', type: 'array' }
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