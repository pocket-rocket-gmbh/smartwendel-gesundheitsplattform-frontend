<template>
  <div class="search-field">
    <div
      class="category-input is-dark-grey"
      :class="[defaultStyling ? 'default' : 'styled']"
    >
      <div class="form">
        <div class="input-wrapper" :class="[defaultStyling ? 'field' : '']">
          <input
            type="text"
            @keyup.enter="handlePressEnter($event)"
            :value="modelValue"
            class="input is-dark-grey general-font-size"
            :placeholder="placeholderText"
            @input="handleInput"
            @click="showPopover = true"
            :disabled="filterStore.mapFilter?.length ? true : false"
            :class="filterStore.mapFilter?.length ? 'cursor-not-allowed opacity-60' : ''"
          />
          <img
            v-if="!kind"
            class="icon"
            :src="searchIcon"
            @click="
              routeToResults();
              trackSearch();
            "
          />
        </div>
      </div>

      <div
        v-show="modelValue && showPopover"
        class="search-results-popover is-dark-grey general-font-size"
        :class="[defaultStyling ? 'default' : 'styled']"
        ref="popoverParentRef"
      >
        <div class="wrapper">
          <div v-if="loading" class="result">
            <LoadingSpinner :style="'inline'"
              >Suchergebnisse werden geladen...</LoadingSpinner
            >
          </div>
          <template v-else>
            <div
              v-if="!kind"
              class="result"
              @click.stop="
                routeToResults();
                trackSearch();
              "
            >
              <div class="icon">
                <img :src="getIconSourceFor()" />
              </div>
              <div class="name">{{ modelValue }}</div>
            </div>
            <div
              v-if="!searchItems?.length && kind"
              class="name is-dark-grey general-font-size"
            >
              Keine Ergebnisse gefunden
            </div>
            <div
              class="result is-dark-grey general-font-size"
              v-for="result in searchItems"
              :key="result.id"
              @click.stop="
                routeToResults(result);
                trackSearch();
              "
            >
              <div class="icon">
                <img :src="getIconSourceFor(result.kind)" />
              </div>
              <div v-if="searchItems?.length" class="name">
                {{ result.name }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import {
  default as coursesIcon,
  default as eventsIcon,
} from "~/assets/icons/facilityTypes/events.svg";
import facilityIcon from "~/assets/icons/facilityTypes/facilities.svg";
import newsIcon from "~/assets/icons/facilityTypes/news.svg";
import searchIcon from "~/assets/icons/facilityTypes/search.svg";
import {
  type Facility,
  type FilterKind,
  useFilterStore,
} from "~/store/searchFilter";

const props = defineProps<{
  modelValue: string;
  filteredItems: Facility[];
  defaultStyling?: boolean;
  loading?: boolean;
  defaultRouteTo?: string;
  kind?: string;
  isResultPage?: boolean;
  filteredCategories?: any[];
  showingEventsCourses?: boolean;
}>();

const searchItems = computed(() => {
  if (props.showingEventsCourses) {
    return props.filteredItems.filter(
      (item: any) => item.kind === "event" || item.kind === "course"
    );
  } else {
    return props.filteredItems;
  }
});

const filterStore = useFilterStore();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const router = useRouter();
const popoverParentRef = ref();
const showPopover = ref(false);

const trackSearch = () => {
  window._paq.push(["trackEvent", "Gesucht:", `${props.modelValue}`]);
};

const placeholderText = ref("");

const setPlaceholderText = () => {
  if (props.kind === "facility") {
    placeholderText.value = "Name, Fachrichtung,…";
  } else if (props.kind === "event") {
    placeholderText.value = "Name, Thema, Angebote,…";
  } else if (props.kind === "course") {
    placeholderText.value = "Name, Kursinhalt,…";
  } else if (props.kind === "news") {
    placeholderText.value = "Name, Thema,…";
  } else if (props.showingEventsCourses) {
    placeholderText.value = "Kursen, Veranstaltungen,…";
  } else {
    placeholderText.value = "Suche nach Themen, Anbietern, Kursen,…";
  }
};

const handlePressEnter = (e: KeyboardEvent) => {
  if (props.kind) {
    showPopover.value = false;
    return;
  }
  if (e.key === "Enter") {
    routeToResults();
    trackSearch();
  }
};

const routeToResults = (result?: Facility) => {
  if (result?.kind) {
    router.push({ path: `/public/care_facilities/${result.id}` });
  } else {
    router.push({ path: "/public/search" });
  }
};

onClickOutside(popoverParentRef, () => (showPopover.value = false));

const getIconSourceFor = (kind?: FilterKind) => {
  if (kind === "facility") return facilityIcon;
  if (kind === "course") return coursesIcon;
  if (kind === "event") return eventsIcon;
  if (kind === "news") return newsIcon;
  return searchIcon;
};

const handleInput = (e: Event) => {
  filterStore.clearSearch();
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};

onMounted(() => {
  setPlaceholderText();
});
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main";

.search-field {
  position: relative;
  flex-direction: row;

  .category-input {
    &.default {
      cursor: pointer;
      width: 100%;
      display: flex;
      align-items: center;
      padding: 0;

      .form {
        flex: 1;
        .field {
          display: flex;
          align-items: center;
          position: relative;
          margin-bottom: 0;

          .input {
            min-width: 100%;
          }

          .icon {
            position: absolute;
            right: 0.75rem;
          }
        }
      }
    }

    &.styled {
      border: 2px solid white;
      background: white;
      height: 50px;
      border-radius: 50px;
      cursor: pointer;
      color: grey;
      width: 100%;
      font-weight: 700;
      display: flex;
      align-items: center;
      padding: 0 8px;

      @include md {
        width: 100%;
      }

      .form {
        flex: 1;

        .input-wrapper {
          display: flex;
          padding: 0 1rem;
          align-items: center;
          flex: 1;
          @include md {
            font-size: 1rem;
          }

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

    @include md {
      width: 100%;
    }
  }

  .search-results-popover {
    position: absolute;
    top: calc(100% + 2px);
    background-color: white;
    overflow: hidden;
    padding: 0.5rem;
    z-index: 10;
    margin: 0 -10px;
    width: 100%;
    border: 1px solid #8ab61d;

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

    &.default {
      width: 100%;
      border-radius: 10px;
      margin: 0;
    }

    &.styled {
      border-radius: 1.5rem;
    }

    @include md {
      width: 100%;
    }
  }
}

.input {
  color: #58595e;
}
</style>
