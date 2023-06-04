<template>
  <div>
    <h2>Tags</h2>
    <v-btn elevation="0" variant="outlined" @click="itemId = null; createEditDialogOpen = true">Neuer Tag</v-btn>
    <v-alert type="info" density="compact" closable class="mt-2">"Tags erleichtern den Besuchern die Auffindbarkeit von Inhalten, Beispiele können zielgruppenspezifische Tags wie z.B. nach Alter oder Geschlecht sein.</v-alert>
    <DataTable
      :fields="fields"
      endpoint="tags"
      default-sort-order="asc"
      default-sort-by="name"
      @openCreateEditDialogue="openCreateEditDialogue"
      @openDeleteDialogue="openDeleteDialogue"
    />

    <AdminTagsCreateEdit
      :item-id="itemId"
      v-if="createEditDialogOpen"
      :item-placeholder="itemPlaceholder"
      endpoint="tags"
      @close="itemId = null; createEditDialogOpen = false"
    />

    <DeleteItem
      v-if="confirmDeleteDialogueOpen"
      @close="itemId = null; confirmDeleteDialogueOpen = false"
      :item-id="itemId"
      endpoint="tags"
      term="diesen Tag"
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
      { text: '', type: 'move_down' },
      { text: '', type: 'move_up' },
      { text: 'Name', value: 'name', type: 'string' },
    ])

    const itemPlaceholder = ref({
      name: '',
      scope: 'care_facility'
    })

    const dialog = ref(false)
    const item = ref({ name: '' })
    const loading = ref(false)
    const createEditDialogOpen = ref(false)
    const confirmDeleteDialogueOpen = ref(false)
    const itemId = ref(null)

    const openCreateEditDialogue = (id:string) => {
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
      item,
      createEditDialogOpen,
      itemPlaceholder,
      confirmDeleteDialogueOpen,
      itemId,
      openCreateEditDialogue,
      openDeleteDialogue
    }
  }
})
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"

</style>