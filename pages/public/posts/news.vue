<template>
  <v-row>
    <v-col class="flex-column align-start justify-start">
      <PublicCategoriesHeader :category="null" title="News und Beiträge"/>
    </v-col>
  </v-row>
  <div class="mx-15 my-10">    
    <PublicNewsTheFilter />
    <v-row>
      <PublicContentBox
        v-for="news in newsArticles" :key="news.id"
        :item="news"
        :item-type="'news'"
      />
    </v-row>
  </div>
</template>
<script lang="ts">
export default defineComponent({
  setup() {
  const loading = ref(false)
  const newsArticles = ref(null)

  const listApi = useCollectionApi()
  listApi.setBaseApi(usePublicApi())

  const getNewsArticles = async () => {
    listApi.setEndpoint(`care_facilities?kind=news`)
    const options = { page: 1, per_page: 25, sort_by: 'menu_order', sort_order: 'ASC', searchQuery: null as any, concat: false, filters: [] as any }
    loading.value = true
    await listApi.retrieveCollection(options)
    loading.value = false
    newsArticles.value = listApi.items.value as any
  }

    onMounted(() => {
      getNewsArticles()
  })
      return {
      newsArticles,
    }
  },
})
</script>

<style lang="sass" scoped>

.note-title
  font-weight: 600
  font-size: 22px

.note-text-link
  font-size: 18px

.default-button
  color: red


</style>