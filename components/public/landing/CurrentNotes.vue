<template>
  <div class="mx-15">
    <div class="my-10">
      <v-row justify="space-between">
        <v-col class="d-flex justify-start align-center is-uppercase">
          <div class="is-primary text-h4 font-weight-bold text-uppercase">Beiträge</div>
        </v-col>
      </v-row>
    </div>
    <v-row>
      <PublicContentBox v-for="news in newsArticles" :key="news.id" :item="news" :item-type="'news'" />
    </v-row>
    <div>
      <v-row>
        <v-col md="12" class="d-flex justify-center mt-10">
          <v-btn variant="outlined" size="large" rounded="pill" color="primary" @click="goToNews()">
            Mehr anzeigen
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script lang="ts">
export default defineComponent({
  setup() {
    const loading = ref(false);
    const newsArticles = ref(null);
    const router = useRouter();

    const listApi = useCollectionApi();
    listApi.setBaseApi(usePublicApi());

    const goToNews = () => {
      router.push({ path: "/public/search/news" });
    };

    const getNewsArticles = async () => {
      listApi.setEndpoint(`care_facilities?kind=news`);
      const options = {
        page: 1,
        per_page: 2,
        sort_by: "menu_order",
        sort_order: "ASC",
        searchQuery: null as any,
        concat: false,
        filters: [] as any,
      };
      loading.value = true;
      await listApi.retrieveCollection(options);
      loading.value = false;
      newsArticles.value = listApi.items.value as any;
    };

    onMounted(() => {
      getNewsArticles();
    });
    return {
      newsArticles,
      goToNews,
    };
  },
});
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
