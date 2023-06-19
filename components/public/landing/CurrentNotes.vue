<template>
  <div class="mx-15">
    <div class="my-5">
      <v-row justify="space-between">
        <v-col class="d-flex justify-start align-center is-uppercase">
          <h2 class="is-green">Neuigkeiten</h2>
        </v-col>
      </v-row>
    </div>
    <v-row>
      <PublicContentBox
      v-for="news in newsArticles" :key="news.id"
      :item="news"
      :item-type="'news'"
    />

    </v-row>

    <!-- <div>
      <v-row>
      <v-col cols="12" md="6" offset="5" class="mt-10">
        <v-btn 
          v-if="!showingAllArticles"
          variant="outlined"
          size="large"
          rounded="pill"
          color="primary"
          @click="showMoreArticles()"
          >
          Mehr anzeigen
        </v-btn>
        <v-btn 
          v-if="showingAllArticles"
          variant="outlined"
          size="large"
          rounded="pill"
          color="primary"
          @click="showLessArticles()"
          >
          Weniger anzeigen
        </v-btn>
      </v-col>
    </v-row>
    </div> -->
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
      console.log(listApi.items.value)
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