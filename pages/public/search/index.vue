<template>
  <ClientOnly>
    <v-container class="limited mt-8 mb-8">
      <v-row class="mt-4">
        <v-col>
          <h1>Suchbegriff: {{ filterStore.currentSearchQuery }}</h1>
        </v-col>
      </v-row>

      <v-row v-if="filteredKinds.length" class="mt-4">
        <v-col class="kinds">
          <v-btn
            v-for="kind in filteredKinds"
            :key="kind"
            variant="outlined"
            size="large"
            rounded="lg"
            color="primary"
            @click="routeToFilterPage(kind)"
          >
            {{ getMappedKindName(kind) }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-else>
        <h2>Keine Ergebnisse für die Suche "{{ filterStore.currentSearchQuery }}" gefunden</h2>
      </v-row>

      <v-row class="mt-4">
        <PublicContentBox v-for="category in filteredCategories" :key="category.id" :item="category" />
      </v-row>
    </v-container>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useFilterStore } from "~/store/searchFilter";

const filterStore = useFilterStore();
const router = useRouter();

const categoriesApi = useCollectionApi();
categoriesApi.setBaseApi(usePublicApi());
categoriesApi.setEndpoint(`care_facilities?kind=event,course,facility,news`);
const categories = categoriesApi.items;

const filteredCategories = ref([]);

const filteredKinds = ref([]);

const getCategories = async () => {
  const options = {
    page: 1,
    per_page: 25,
    sort_by: "menu_order",
    sort_order: "ASC",
    searchQuery: null as any,
    concat: false,
    filters: [] as any,
  };
  await categoriesApi.retrieveCollection(options);
};

const getFilteredData = async () => {
  await categoriesApi.retrieveCollection();

  const filtered = categories.value.filter((category) => {
    const categoryName = (category.name as string).toUpperCase();

    const nameMatch = categoryName.includes(filterStore.currentSearchQuery.toUpperCase());

    const subCategoryMatch = (category.sub_categories as any[]).some((subCategory) => {
      const subCategoryName = (subCategory.name as string).toUpperCase();
      return subCategoryName.includes(filterStore.currentSearchQuery.toUpperCase());
    });

    return nameMatch || subCategoryMatch;
  });

  filteredCategories.value = [...filtered];

  filteredKinds.value = [...new Set(filteredCategories.value.map((item) => item.kind))];
};

const getMappedKindName = (kind: "facility" | "news" | "event" | "course") => {
  if (kind === "facility") return "Zu den Einrichtungen";
  if (kind === "news") return "Zu den Beiträgen";
  if (kind === "course") return "Zu den Kursen";
  if (kind === "event") return "Zu den Veranstaltungen";
};

const routeToFilterPage = (kind: "facility" | "news" | "event" | "course") => {
  switch (kind) {
    case "event":
    case "course":
      return router.push({ path: "/public/search/events" });
    case "facility":
      return router.push({ path: "/public/search/facilities" });
    case "news":
      return router.push({ path: "/public/news" });
  }
};

onMounted(async () => {
  // if (!filterStore.currentSearchQuery) {
  //   return router.push("/");
  // }

  // filterStore.currentSearchQuery = "";

  // await getCategories();
  await getFilteredData();
});
</script>

<style lang="sass" scoped>
h1
  color: black

.kinds
  display: flex
  gap: 2rem
</style>
