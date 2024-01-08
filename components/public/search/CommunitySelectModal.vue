<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" :scrim="false" transition="dialog-bottom-transition">
      <template v-slot:activator="{ props }">
        <div class="field" v-bind="props" @click="handleClearTermSearch()">
          <label class="label is-white">Gemeinde</label>
          <div class="input">{{ activeCommunityName || "Gemeinde wählen" }}</div>
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
        <div class="content">
          <label class="option">
            <v-radio
              :model-value="!filterStore.currentZip"
              @click.prevent="handleCommunitySelect(null)"
              hide-details
              density="compact"
              :label="'Keine Auswahl'"
              color="#8AB61D"
            />
            <v-divider></v-divider>
          </label>
          <label class="option" v-for="(community, index) in communities">
            <v-radio
              :model-value="filterStore.currentZip === community.zip"
              @click.prevent="handleCommunitySelect(community)"
              hide-details
              density="compact"
              :label="community.name"
              color="#8AB61D"
            />
            <v-divider v-if="index !== communities?.length - 1"></v-divider>
          </label>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import { useFilterStore } from "~/store/searchFilter";

const filterStore = useFilterStore();
const dialog = ref(false);
const communities = ref<any[]>([]);

const activeCommunityName = computed(() => {
  return communities.value?.find((community) => community.zip === filterStore.currentZip)?.name;
});

const handleCommunitySelect = (community: { name: string; zip: string }) => {
  filterStore.currentZip = community?.zip || null;
};

const handleClearTermSearch = () => {
  if (filterStore.currentSearchTerm) {
    filterStore.clearTermSearch();
  }
  return;
};

onMounted(async () => {
  communities.value = await filterStore.loadAllCommunities();
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
