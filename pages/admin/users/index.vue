<template>
  <div>
    <h2>Benutzer</h2>
    <v-btn elevation="0" variant="outlined" @click="itemId = null; createEditDialogOpen = true">Neuer Benutzer</v-btn>
    <DataTable
      :fields="fields"
      endpoint="users"
      @openCreateEditDialog="openCreateEditDialog"
      @openDeleteDialog="openDeleteDialog"
      @mailUser="mailUser"
      ref="dataTableRef"
    />

    <AdminUsersCreateEdit
      :item-id="itemId"
      v-if="createEditDialogOpen"
      @close="itemId = null; createEditDialogOpen = false; itemId = null; dataTableRef?.resetActiveItems()"
      @refreshCollection="getUsers()"
    />

    <DeleteItem
      v-if="confirmDeleteDialogOpen"
      @close="itemId = null; confirmDeleteDialogOpen = false; dataTableRef?.resetActiveItems()"
      :item-id="itemId"
      endpoint="users"
      term="diesen Benutzer"
    />
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: "admin",
})

const fields = ref([
  { text: 'Aktiv', endpoint: 'users', type: 'switch', fieldToSwitch: 'is_active_on_health_scope' },
  { text: 'Vorname', value: 'firstname', type: 'string' },
  { text: 'Nachname', value: 'lastname', type: 'string' },
  { text: 'E-Mail', value: 'email', type: 'string' },
  { text: 'Einrichtung',endpoint: 'users',  value: 'care_facilities', type: "facilities" },
  { text: 'Zuletzt gesehen', value: 'last_seen', type: 'datetime' },
  { text: '', value: 'mdi-email-outline', type: 'icon', emit: 'mailUser', tooltip: 'E-Mail an Benutzer' },
])

const loading = ref(false)
const createEditDialogOpen = ref(false)
const confirmDeleteDialogOpen = ref(false)
const itemId = ref(null)
const filter = ref({ page: 1, per_page: 1000, sort_by: 'created_at', sort_order: 'DESC', searchQuery: null, concat: false, filters: [] })
const dataTableRef = ref();

const openCreateEditDialog = (id:string) => {
  itemId.value = id
  createEditDialogOpen.value = true
}

const openDeleteDialog = (id:string) => {
  itemId.value = id
  confirmDeleteDialogOpen.value = true
}

onMounted(() => {
  getUsers()
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

const getUsers = async () => {
  loading.value = true
  await api.retrieveCollection(filter.value)
  loading.value = false
}
</script>
<style lang="sass">
@import "@/assets/sass/main.sass"

</style>