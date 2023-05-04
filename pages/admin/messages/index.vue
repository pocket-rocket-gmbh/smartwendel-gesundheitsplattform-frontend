<template>
  <div>
    <h2>Nachrichten</h2>
    <DataTable
      :fields="fields"
      endpoint=""
    />

    <DeleteItem
      v-if="confirmDeleteDialogueOpen"
      @close="itemId = null; confirmDeleteDialogueOpen = false"
      :item-id="itemId"
      endpoint=""
      term="diese Nachricht"
    />
  </div>
</template>
<script lang="ts">
export default defineComponent({
  name: 'AdminMessagesIndex',
  setup() {
    definePageMeta({
      layout: "admin",
    })
    const fields = ref([
      { text: 'Beantwortet', endpoint: 'care_facilities', type: 'switch', fieldToSwitch: 'is_active' },
      { text: 'Betreff', value: '', type: 'string' },
      { text: 'eingetroffen am', value: 'created_at', type: 'datetime' },
      { text: '', value: 'mdi-info', type: 'icon', emit: '', tooltip: '' },
    ])

    const dialog = ref(false)
    const item = ref({ name: '' })
    const loading = ref(false)
    const confirmDeleteDialogueOpen = ref(false)
    const itemId = ref(null)

    const openDeleteDialogue = (id:string) => {
      itemId.value = id
      confirmDeleteDialogueOpen.value = true
    }

    return {
      fields,
      loading,
      dialog,
      item,
      confirmDeleteDialogueOpen,
      itemId,
      openDeleteDialogue
    }
  }
})
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"

</style>