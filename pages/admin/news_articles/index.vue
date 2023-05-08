<template>
  <div>
    <h2>News und Beiträge</h2>
    <v-btn elevation="0" variant="outlined" @click="itemId = null; createEditDialogueOpen = true">Newsartikel anlegen</v-btn>
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
      term="diese Artikel"
    />
  </div>
</template>
<script lang="ts">
export default defineComponent({
  name: 'AdminNewsArticlesIndex',
  setup() {
    definePageMeta({
      layout: "admin",
    })

    const fields = ref([
      { text: '', type: 'move_down' },
      { text: '', type: 'move_up' },
      { text: 'Aktiv', endpoint: 'care_facilities', type: 'switch', fieldToSwitch: 'is_active' },
      { text: 'Titel', value: 'name', type: 'string' },
      { text: 'Bereich', value: '', type: 'string' },
      { text: 'Datum', value: 'created_at', type: 'datetime' },
      { text: 'Autor', value: '', type: 'string' },
      { text: 'Status', value: '', type: 'string' },
      { text: '', value: 'mdi-email-outline', type: 'icon', emit: '', tooltip: '' },
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