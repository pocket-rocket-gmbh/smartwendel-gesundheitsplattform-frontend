<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ props }">
        <div class="field" v-bind="props" @click="handleClearTermSearch()">
          <label class="label is-white break-title"
            >Gemeinde
            <span v-if="filterStore.currentZips?.length >= 1"
              >({{ filterStore.currentZips?.length }})</span
            ></label
          >
          <div class="input">
            {{
              getAllSelectedCommunitiesName(filterStore.currentZips) ||
              "Gemeinde wählen"
            }}
          </div>
        </div>
      </template>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Gemeinde</v-toolbar-title>
          <v-btn variant="text" @click="dialog = false"> Schließen </v-btn>
        </v-toolbar>
        <div v-if="filterStore.filteredCommunities?.length">
          <div class="d-flex community-filter-options">
            <div
              v-for="community in filterStore.filteredCommunities"
              :key="community.id"
            >
              <label class="option ma-n1">
                <v-btn
                  hide-details
                  @click.prevent="handleOptionSelectCommunity(community)"
                  density="compact"
                  class="options-select general-font-size ma-2 text-none font-weight-light"
                  :class="{
                    'is-selected': filterStore.currentZips.includes(
                      community.zip
                    ),
                  }"
                >
                  {{ community.name }}
                </v-btn>
              </label>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import { useFilterStore } from "~/store/searchFilter";

const filterStore = useFilterStore();
const dialog = ref(false);

const getAllSelectedCommunitiesName = (zips: string[]) => {
  if (!zips.length) return "";
  const allSelectedCommunities = filterStore.allCommunities.filter(
    (community: any) => zips.includes(community.zip)
  );
  return allSelectedCommunities
    .map((community: any) => community.name)
    .join(", ");
};

const handleOptionSelectCommunity = (community: any) => {
  if (filterStore.currentZips.includes(community?.zip)) {
    filterStore.currentZips = filterStore.currentZips.filter(
      (item: any) => item !== community.zip
    );
  } else {
    filterStore.currentZips.push(community.zip);
  }
  filterStore.loadAllResults();
};
const handleClearTermSearch = () => {
  if (filterStore.currentSearchTerm) {
    filterStore.clearTermSearch();
  }
  return;
};

onMounted(async () => {
  await filterStore.loadAllCommunities();
});
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}

.content {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
