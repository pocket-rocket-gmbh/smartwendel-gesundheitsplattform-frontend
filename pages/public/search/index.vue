<template>
  <div>
    <v-row class="mt-md-4 search-field-search">
      <v-row v-if="showingEventsCourses">
        <v-col class="d-flex align-center is-white" :class="breakPoints.width.value < 960 ? 'justify-center' : ''">
          <div>
            <div class="general-font-size text-h4 text-white word-break" lang="de">
              Kurse und Veranstaltungen
            </div>
            <div>
              <span
                class="is-white font-weight-medium general-font-size mt-3"
                v-if="filterStore.currentSearchTerm"
              >
                Suchbegriff: {{ filterStore.currentSearchTerm }}
              </span>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-col class="d-flex align-center is-white" v-if="!showingEventsCourses">
        <span
          class="is-white font-weight-medium general-font-size"
          :class="breakPoints.width.value < 960 ? 'd-flex align-center justify-center' : ''"
          v-if="filterStore.currentSearchTerm"
        >
          Suchbegriff: {{ filterStore.currentSearchTerm }}
        </span>
        <span class="ml-10 general-font-size">
          {{ filterStore.filteredResults.length + filterStore.filteredCategories.length}} Ergebnisse gefunden
        </span>
      </v-col>
      <v-col>
        <PublicSearchField
          class="search-fields"
          v-model="filterStore.currentSearchTerm"
          :filtered-items="filterStore.filteredResults"
          @update:model-value="handleInput"
          :isResultPage="true"
          :showing-events-courses="showingEventsCourses"
        />
      </v-col>
    </v-row>
  </div>
  <div class="search-page-wrapper">
    <div>
      <LoadingSpinner class="loading" v-if="filterStore.loading"
        >Ergebnisse werden geladen...</LoadingSpinner
      >
      <template v-else>
        <v-row
          v-if="
            !filterStore.filteredResults.length &&
            !filterStore.filteredCategories.length
          "
        >
          <v-col class="d-flex flex-column align-center justify-center">
            <div class="flex-column" align="center">
              <div class="general-font-size text-h4">
                Diese Stelle müssen wir noch fixen.
                <br />
                Leider haben wir kein Suchergebnis zu deiner Anfrage.
              </div>
            </div>
            <img :src="noResults" class="no-results-image mt-10" />
          </v-col>
        </v-row>
        <v-row class="mt-4" v-else>
          <v-col class="kinds">
            <v-btn
              v-for="(kind, index) in filteredKinds"
              :key="index"
              variant="outlined"
              size="large"
              rounded="lg"
              color="primary"
              class="kind general-font-size"
              @click="routeToFilterPage(kind)"
            >
              {{ getMappedKindName(kind) }}
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </div>
    <div class="container">
      <PublicContentBox
        v-for="category in filterStore.filteredResults"
        :key="category.id"
        :item="category"
      />
      <PublicContentBox
        v-for="category in filterStore.filteredCategories"
        :key="category.id"
        :item="category"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFilterStore } from "~/store/searchFilter";
import noResults from "~/assets/images/search_no_results.jpg";
import { useBreakpoints } from "~/composables/ui/breakPoints";

const breakPoints = useBreakpoints();

const filterStore = useFilterStore();
const router = useRouter();

const filteredKinds = computed(() => {
  return Array.from(
    new Set(filterStore.filteredResults.map((result:any) => result.kind))
  );
});
const goBack = () => {
  router.push({ path: "/" });
};

const getMappedKindName = (kind: "facility" | "news" | "event" | "course") => {
  if (kind === "facility") return "Zu den Anbietern";
  if (kind === "news") return "Zu den Beiträgen";
  if (kind === "event") return "Zu den Veranstaltungen";
  if (kind === "course") return "Zu den Kursen";
};

const routeToFilterPage = (kind: "facility" | "news" | "event" | "course") => {
  switch (kind) {
    case "event":
      return router.push({ path: "/public/search/events" });
    case "course":
      return router.push({ path: "/public/search/courses" });
    case "facility":
      return router.push({ path: "/public/search/facilities" });
    case "news":
      return router.push({ path: "/public/search/news" });
  }
};

const handleInput = () => {
  filterStore.onlySearchInTitle = false;
  filterStore.loadAllResults();
};

const showingEventsCourses = ref(false);

onMounted(async () => {
  if (router.currentRoute.value.query.searchType) {
    filterStore.currentKinds = ["event", "course"];
    showingEventsCourses.value = true;
  } else {
    filterStore.currentKinds = [];
  }
  filterStore.onlySearchInTitle = false;
  await filterStore.loadAllResults();
});
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

.search-page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 5rem;

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
.no-results-image {
  max-width: 800px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
}

.search-field-search {
  background: $green-gradient;
  padding: 2rem 5rem;
  @include md {
    padding: 2rem 2rem;
  }
}

.search-fields {
  width: 100%;
  justify-content: flex-end;
  display: flex;
}
</style>
