<template>
  <div>
    <h2>Benutzer</h2>
    <v-btn elevation="0" variant="outlined" @click="itemId = null; createEditDialogueOpen = true">Neuer Benutzer</v-btn>
    <DataTable
      :fields="fields"
      endpoint="users"
      @openCreateEditDialogue="openCreateEditDialogue"
      @openDeleteDialogue="openDeleteDialogue"
      @mailUser="mailUser"
    />

    <AdminUsersCreateEdit
      :item-id="itemId"
      v-if="createEditDialogueOpen"
      @close="itemId = null; createEditDialogueOpen = false"
      @refreshCollection="getItem()"
    />

    <DeleteItem
      v-if="confirmDeleteDialogueOpen"
      @close="itemId = null; confirmDeleteDialogueOpen = false"
      :item-id="itemId"
      endpoint="care_facilities"
      term="diese Einrichtung"
    />
  </div>
</template>
<script lang="ts">
export default defineComponent({
  name: 'AdminUsersIndex',
  setup() {
    definePageMeta({
      layout: "admin",
    })

    const fields = ref([
      { text: 'Aktiv', endpoint: 'users', type: 'switch', fieldToSwitch: 'is_active' },
      { text: 'Vorname', value: 'firstname', type: 'string' },
      { text: 'Nachname', value: 'lastname', type: 'string' },
      { text: 'E-Mail', value: 'email', type: 'string' },
      { text: 'Rolle', value: 'role', type: 'string' },
      { text: 'Zuletzt gesehen', value: 'last_seen', type: 'datetime' },
      { text: '', value: 'mdi-email-outline', type: 'icon', emit: 'mailUser', tooltip: 'E-Mail an Benutzer' },
    ])

    const dialog = ref(false)
    const item = ref({ name: '' })
    const loading = ref(false)
    const createEditDialogueOpen = ref(false)
    const confirmDeleteDialogueOpen = ref(false)
    const itemId = ref(null)
    const filter = ref({ page: 1, per_page: 1000, sort_by: 'created_at', sort_order: 'DESC', searchQuery: null, concat: false, filters: [] })

    const openCreateEditDialogue = (id:string) => {
      itemId.value = id
      createEditDialogueOpen.value = true
    }

    const openDeleteDialogue = (id:string) => {
      itemId.value = id
      confirmDeleteDialogueOpen.value = true
    }

    onMounted(() => {
      getItem()
    })

    const mailUser = async (id:String) => {
      const user = users.value.find(user => user.id === id)
      if (process.client && user) {
        window.location.href = `mailto:${user.email}`
      }
    }

    const api = useCollectionApi()
    api.setBaseApi(usePrivateApi())
    api.setEndpoint('users')
    const users = api.items

    const getItem = async () => {
      loading.value = true
      await api.retrieveCollection(filter.value)
      loading.value = false
    }

    return {
      getItem,
      fields,
      loading,
      dialog,
      mailUser,
      item,
      createEditDialogueOpen,
      confirmDeleteDialogueOpen,
      itemId,
      users,
      openCreateEditDialogue,
      openDeleteDialogue
    }
  }
})
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"

</style>