<template>
  <div>
    <h2>Tooltips</h2>
    <v-btn elevation="0" variant="outlined" @click="itemId = null; createEditDialogueOpen = true">Neuer Tooltip</v-btn>
    <DataTable
      :fields="fields"
      endpoint=""
      @openCreateEditDialogue="openCreateEditDialogue"
      @openDeleteDialogue="openDeleteDialogue"
    />

    <DeleteItem
      v-if="confirmDeleteDialogueOpen"
      @close="itemId = null; confirmDeleteDialogueOpen = false"
      :item-id="itemId"
      endpoint=""
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
      { text: 'Name', value: '', type: 'string' },
      { text: 'Inhalt', value: '', type: 'string' },
      { text: 'Url', value: '', type: 'string' },
    ])

    const dialog = ref(false)
    const item = ref({ name: '' })
    const loading = ref(false)
    const createEditDialogueOpen = ref(false)
    const confirmDeleteDialogueOpen = ref(false)
    const itemId = ref(null)

    const openCreateEditDialogue = (id:string) => {
      itemId.value = id
      createEditDialogueOpen.value = true
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
      createEditDialogueOpen,
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