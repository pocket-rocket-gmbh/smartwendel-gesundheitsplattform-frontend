<template>
  <v-row>
    <v-col cols="6" md="4" v-for="(tag) in tags.slice(0, 10)" :key="tag.id">
      <v-checkbox class="mb-n10" :label="tag.name" v-model="tagIds" :value="tag.id" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const emit = defineEmits(['setCareFacilityTags'])
const props = defineProps({
  preSetTagIds: {
    type: Array
  }
})

const tagIds = ref([])

const loading = ref(false)
const api = useCollectionApi()
api.setBaseApi(usePrivateApi())
api.setEndpoint('tags')
const tags = api.items

const getItems = async () => {
  loading.value = true
  const options = { page: 1, per_page: 25, sort_by: 'name', sort_order: 'asc', searchQuery: null, concat: false, filters: [] }
  await api.retrieveCollection(options)
  loading.value = false
}

onMounted(() => {
  getItems()
})

watch(tagIds, () => {
  emit('setCareFacilityTags', tagIds.value)
})

watch(() => props.preSetTagIds, (first) => {
  tagIds.value = first
})
</script>

<style lang="sass" scoped>

</style>