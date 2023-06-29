<template>
  <div class="choose-category">
    <div class="category-input is-dark-grey py-2">
      <form @submit.prevent="routeToResults()">
        <div class="input-wrapper">
          <input
            type="text"
            v-model="filterStore.currentSearchTerm"
            class="input"
            placeholder="Suchebegriff eingeben"
            @input="filterStore.loadFilteredResults"
            @click="showPopover = true"
          />
          <v-icon @click="routeToResults()">mdi-magnify</v-icon>
        </div>
      </form>

      <div v-show="filterStore.currentSearchTerm && showPopover" class="search-results-popover" ref="popoverParentRef">
        <div v-if="filterStore.loading" class="result">
          <LoadingSpinner>Suchergebnisse werden geladen...</LoadingSpinner>
        </div>
        <template v-else>
          <div class="result" @click.stop="routeToResults()">{{ filterStore.currentSearchTerm }}</div>
          <div
            class="result"
            v-for="result in filterStore.filteredResults"
            :key="result.id"
            @click.stop="routeToResults(result)"
          >
            <div class="name">{{ result.name }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { Facility, useFilterStore } from "~/store/searchFilter";

const filterStore = useFilterStore();

const api = useCollectionApi();
api.setBaseApi(usePublicApi());

const router = useRouter();

const popoverParentRef = ref();
const showPopover = ref(false);

const routeToResults = (result?: Facility) => {
  if (!result) {
    filterStore.currentSearchTerm = filterStore.currentSearchTerm;
    router.push({ path: "/public/search" });
    return;
  }

  if (result.kind === "facility") {
    return router.push({ path: `/public/care_facilities/${result.id}` });
  }
  if (result.kind === "course" || result.kind === "event") {
    return router.push({ path: `/public/care_facilities/${result.id}` });
  }
  if (result.kind === "news") {
    return router.push({ path: `/public/news/${result.id}` });
  }

  router.push({ path: "/public/search" });
};

onClickOutside(popoverParentRef, () => (showPopover.value = false));

onMounted(async () => {
  filterStore.currentKinds = [];
  await filterStore.loadAllResults();
});
</script>

<style lang="scss" scoped>
.choose-category {
  position: relative;
  flex-direction: row;

  .category-input {
    border: 2px solid white;
    background: white;
    height: 50px;
    border-radius: 50px;
    cursor: pointer;
    color: grey;
    width: 70%;
    font-weight: 700;
    display: flex;
    align-items: center;

    form {
      flex: 1;

      .input-wrapper {
        display: flex;
        padding: 0 1rem;
        align-items: center;
        flex: 1;

        .input {
          flex: 1;
          outline: none;
          border: none;

          &::placeholder {
            opacity: 0.5;
          }
        }
      }
    }
  }

  .search-results-popover {
    position: absolute;
    top: calc(100% + 2px);
    width: 60%;
    left: 0;
    background-color: white;

    .result {
      padding: 1rem;
      border-bottom: 1px solid rgba(black, 0.4);

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
.v-input__icon.v-input__icon--append-outer i {
  font-size: 48px;
}
</style>
