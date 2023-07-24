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
            @input="handleInput"
            @click="showPopover = true"
          />
          <img class="icon" :src="searchIcon" @click="routeToResults()" />
        </div>
      </form>

      <div v-show="filterStore.currentSearchTerm && showPopover" class="search-results-popover" ref="popoverParentRef">
        <div class="wrapper">
          <div v-if="filterStore.loading" class="result">
            <LoadingSpinner>Suchergebnisse werden geladen...</LoadingSpinner>
          </div>
          <template v-else>
            <div class="result" @click.stop="routeToResults()">
              <div class="icon">
                <img :src="getIconSourceFor()" />
              </div>
              <div class="name">{{ filterStore.currentSearchTerm }}</div>
            </div>
            <div
              class="result"
              v-for="result in filterStore.filteredResults"
              :key="result.id"
              @click.stop="routeToResults(result)"
            >
              <div class="icon">
                <img :src="getIconSourceFor(result.kind)" />
              </div>
              <div class="name">{{ result.name }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { Facility, FilterKind, useFilterStore } from "~/store/searchFilter";
import facilityIcon from "~/assets/icons/facilityTypes/facilities.svg";
import newsIcon from "~/assets/icons/facilityTypes/news.svg";
import eventsIcon from "~/assets/icons/facilityTypes/events.svg";
import searchIcon from "~/assets/icons/facilityTypes/search.svg";

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
    return router.push({ path: `/public/care_facilities/${result.id}` });
  }

  router.push({ path: "/public/search" });
};

onClickOutside(popoverParentRef, () => (showPopover.value = false));

const getIconSourceFor = (kind?: FilterKind) => {
  if (kind === "facility") return facilityIcon;
  if (kind === "course" || kind === "event") return eventsIcon;
  if (kind === "news") return newsIcon;
  return searchIcon;
};

const handleInput = () => {
  filterStore.onlySearchInTitle = true;
  filterStore.loadFilteredResults();
};

onMounted(async () => {
  filterStore.currentKinds = [];
  filterStore.currentTags = [];
  filterStore.currentZip = null;
  filterStore.onlySearchInTitle = true;
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

        .icon {
          width: 1.25rem;
        }

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
    left: 0;
    background-color: white;
    overflow: hidden;
    border-radius: 1.5rem;
    padding: 0.5rem;
    width: 70%;

    .wrapper {
      max-height: 300px;
      overflow-y: scroll;
      padding-right: 0.25rem;

      /* width */
      &::-webkit-scrollbar {
        width: 10px;
      }

      /* Track */
      &::-webkit-scrollbar-track {
        background: white;
        border-radius: 10px;
        margin: 1rem;
      }

      /* Handle */
      &::-webkit-scrollbar-thumb {
        background: #d3d3d3;
        border-radius: 10px;
      }

      /* Handle on hover */
      &::-webkit-scrollbar-thumb:hover {
        background: hsl(0, 0%, 73%);
      }

      .result {
        padding: 0.75rem;
        border-bottom: 1px solid #8ab61d;
        display: flex;
        align-items: center;
        gap: 0.75rem;

        &:last-child {
          border-bottom: none;
        }

        .name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 1.25rem;
          }
        }
      }
    }
  }
}
.v-input__icon.v-input__icon--append-outer i {
  font-size: 48px;
}
</style>
