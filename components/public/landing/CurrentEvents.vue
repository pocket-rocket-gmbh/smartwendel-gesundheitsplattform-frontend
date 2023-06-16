<template>
  <div class="mx-15">
    <div class="my-15">
      <v-row no-gutters>
        <v-col class="d-flex align-center">
          <div>
            <img src="~/assets/images/logo.png" width="190"/>
          </div>
          <div class="mx-15">
            <h2 class="is-primary">Kurse & Veranstaltungen</h2>
          </div>
        </v-col>
      </v-row>
    </div>
    <v-row>
      <PublicContentBox
      v-for="courses in eventArticles" :key="courses.id"
      :item="courses"
      :item-type="'events'"
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
    </div>   -->
  </div>
 
</template>
<script lang="ts">
export default defineComponent({
  setup() {
  const loading = ref(false)
  const eventArticles = ref(null)

  const listApi = useCollectionApi()
  listApi.setBaseApi(usePublicApi())

  const getCoursesArticles = async () => {
      listApi.setEndpoint(`care_facilities?kind=event`)
      const options = { page: 1, per_page: 25, sort_by: 'menu_order', sort_order: 'ASC', searchQuery: null as any, concat: false, filters: [] as any }
      loading.value = true
      await listApi.retrieveCollection(options)
      loading.value = false
      console.log(listApi.items.value)
      eventArticles.value = listApi.items.value as any
    }

    onMounted(() => {
      getCoursesArticles()
  })
      return {
        eventArticles,
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


</style>