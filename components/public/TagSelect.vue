<template>
  <v-checkbox class="mb-n12" v-for="tag in tags" :key="tag.id" :label="tag.name" v-model="selectedTags" :value="tag.id" />
</template>

<script setup lang="ts">
import { useFilterStore } from "~/store/filter"
const loading = ref(false)
const api = useCollectionApi()
api.setBaseApi(usePublicApi())
api.setEndpoint(`tags?scope=care_facility`)
const tags = api.items
const selectedTags = ref([])

const getTags = async () => {
  loading.value = true
  const options = { page: 1, per_page: 25, sort_by: 'name', sort_order: 'asc', searchQuery: null as any, concat: false, filters: null as any }
  await api.retrieveCollection(options as any)
  loading.value = false
}

onMounted(() => {
  getTags()
})

watch(selectedTags, () => {
  useFilterStore().currentTags = selectedTags.value
  useNuxtApp().$bus.$emit('updateFacilitiesBasedOnFilterChange', 'tags')
})


</script>

<style lang="sass" scoped>

</style>