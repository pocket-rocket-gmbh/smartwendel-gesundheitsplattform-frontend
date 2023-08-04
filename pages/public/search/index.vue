<template>
  <div class="search-page-wrapper">
    <div>
      <v-row class="mt-4" v-if="filterStore.filteredResults.length">
        <v-col>
          <h2>Suchbegriff: {{ filterStore.currentSearchTerm }}</h2>
        </v-col>
      </v-row>

      <LoadingSpinner class="loading" v-if="filterStore.loading">Ergebnisse werden geladen...</LoadingSpinner>
      <template v-else>
        <v-row v-if="filteredKinds.length" class="mt-4">
          <v-col class="kinds">
            <v-btn
              v-for="kind in filteredKinds"
              :key="kind"
              variant="outlined"
              size="large"
              rounded="lg"
              color="primary"
              class="kind"
              @click="routeToFilterPage(kind)"
            >
              {{ getMappedKindName(kind) }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-else class="mt-15">
          <v-col class="d-flex justify-center">
            <div class="flex-column" align="center">
              <h2>Keine Ergebnisse für die Suche "{{ filterStore.currentSearchTerm }}" gefunden</h2>
              <v-btn class="mt-4" prepend-icon="mdi-chevron-left" @click="goBack()"> Zurück zur Suche </v-btn>
            </div>
          </v-col>
        </v-row>
      </template>
    </div>
    <div class="container">
      <PublicContentBox v-for="category in filterStore.filteredResults" :key="category.id" :item="category" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFilterStore } from "~/store/searchFilter";

const filterStore = useFilterStore();
const router = useRouter();

const filteredKinds = computed(() => {
  const uniqueKinds = [...new Set(filterStore.filteredResults.map((result) => result.kind))];
  const courseIndex = uniqueKinds.findIndex((kind) => kind === "course");
  const eventIndex = uniqueKinds.findIndex((kind) => kind === "event");

  if (courseIndex !== -1 && eventIndex !== -1) {
    uniqueKinds.splice(courseIndex, 1);
  }
  return uniqueKinds;
});
const goBack = () => {
  router.push({ path: "/" });
};

const getMappedKindName = (kind: "facility" | "news" | "event" | "course") => {
  if (kind === "facility") return "Zu den Einrichtungen";
  if (kind === "news") return "Zu den Beiträgen";
  if (kind === "event" || kind === "course") return "Zu den Kursen und Veranstaltungen";
};

const routeToFilterPage = (kind: "facility" | "news" | "event" | "course") => {
  switch (kind) {
    case "event":
    case "course":
      return router.push({ path: "/public/search/events" });
    case "facility":
      return router.push({ path: "/public/search/facilities" });
    case "news":
      return router.push({ path: "/public/search/news" });
  }
};

onMounted(async () => {
  filterStore.currentKinds = [];
  filterStore.onlySearchInTitle = false;
  await filterStore.loadAllResults();
  filterStore.loadFilteredResults();
});
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

.search-page-wrapper {
  padding: 2rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @include md {
    padding: 1rem;
  }

  .loading {
    margin-top: 4rem;
  }

  h1 {
    color: black;
  }
  .kinds {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;

    @include md {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
  .container {
    display: grid;
    grid-gap: 2rem;
    grid-template-columns: 1fr 1fr;

    @include md {
      gap: 2rem;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
