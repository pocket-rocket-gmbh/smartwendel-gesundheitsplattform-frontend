<template>
  <div class="mx-15">
    <div class="my-15">
      <v-row no-gutters>
        <v-col class="d-flex align-center">
          <div>
            <h2 class="is-primary text-h4 font-weight-bold text-uppercase mb-5">Kurse und Veranstaltungen</h2>
          </div>
        </v-col>
      </v-row>
    </div>
    <div class="articles">
      <PublicContentBox
        :size="6"
        v-for="courses in eventArticles"
        :key="courses.id"
        :item="courses"
        :item-type="'event'"
      />
    </div>
    <div>
      <v-row>
        <v-col md="12" class="d-flex justify-center mt-10">
          <v-btn variant="flat" color="primary" rounded="pill" size="large" @click="goToEvents()">
            <span> Mehr anzeigen </span>
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
    const eventArticles = ref(null);
    const router = useRouter();

    const listApi = useCollectionApi();
    listApi.setBaseApi(usePublicApi());

    const goToEvents = () => {
      router.push({ path: "/public/search/events" });
    };

    const getCoursesArticles = async () => {
      listApi.setEndpoint(`care_facilities?kind=event,course`);
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
      eventArticles.value = listApi.items.value as any;
    };

    onMounted(() => {
      getCoursesArticles();
    });
    return {
      eventArticles,
      goToEvents,
    };
  },
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.note-title
  font-weight: 600
  font-size: 22px

.note-text-link
  font-size: 18px

.articles
  display: flex

  @include md
    flex-direction: column
</style>
