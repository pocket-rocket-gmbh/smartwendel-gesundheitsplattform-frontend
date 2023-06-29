<template>
  <ClientOnly>
    <v-container class="limited mt-8 mb-8">
      <v-row class="mt-4">
        <v-col>
          <h1>Suchbegriff: {{ filterStore.currentSearchTerm }}</h1>
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
        <h2>Keine Ergebnisse für die Suche "{{ filterStore.currentSearchTerm }}" gefunden</h2>
      </v-row>

      <v-row class="mt-4">
        <PublicContentBox v-for="category in filterStore.filteredResults" :key="category.id" :item="category" />
      </v-row>
    </v-container>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useFilterStore } from "~/store/searchFilter";

const filterStore = useFilterStore();
const router = useRouter();

const filteredKinds = computed(() => {
  return [...new Set(filterStore.filteredResults.map((result) => result.kind))];
});

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
      return router.push({ path: "/public/search/news" });
  }
};

onMounted(async () => {
  filterStore.onlySearchInTitle = false;
  if (!filterStore.allResults || !filterStore.allResults.length) {
    await filterStore.loadAllResults();
  }
  filterStore.loadFilteredResults();
});
</script>

<style lang="sass" scoped>
h1
  color: black

.kinds
  display: flex
  gap: 2rem
</style>
