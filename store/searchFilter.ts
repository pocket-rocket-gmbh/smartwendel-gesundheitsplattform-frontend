import { defineStore } from "pinia";

export const filterSortingDirections = ["Z-A", "A-Z"] as const;

export type CategoriesFilter = "category" | "subCategory" | "subSubCategory" | "tags";
export type FilterKind = "facility" | "news" | "event" | "course";
export type FilterType = "filter_facility" | "filter_service" | "certificate" | "documents" | "opening_hours" | "phone";
export type FilterTag = {
  id: string;
  menu_order: number;
  name: string;
  scope: string;
};

export type User = {
  id: string;
  name: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  role: string;
  register_token?: string;
};

export type Facility = {
  [x: string]: any;
  id: string;
  name: string;
  description?: string;
  kind: FilterKind;
  filterType: FilterType;
  tags: FilterTag[];
  zip?: string;
  street?: string;
  latitude?: string;
  longitude?: string;
  town?: string;
  phone?: string;
  email?: string;
  url?: string;
  url_kind?: "internal" | "external";
  image_url?: string;
  created_at: Date;
  user: User;
  user_care_facility_name: string;
  logo?: string;
  logo_url?: string;
  community_id?: string;
  tag_category_ids?: string[];
  user_care_facility?: Facility;
};

export type Filter = {
  currentSearchTerm: string;
  currentTags: string[];
  currentZips: string[];
  filterSort: (typeof filterSortingDirections)[number];
  loading: boolean;
  mapFilter: string;
  currentKinds: FilterKind[];
  allCategories: any[];
  filteredCategories: any[];

  //
  allUnalteredResults: Facility[];
  allResults: Facility[];
  filteredResults: Facility[];
  onlySearchInTitle: boolean;

  allFilters: null | any[];
  allCommunities: null | any[];
  filteredCommunities: null | any[];
  mainFilters: null | any[];
};

const initialFilterState: Filter = {
  currentSearchTerm: "",
  currentTags: [],
  currentZips: [],
  filterSort: "A-Z",
  loading: false,
  mapFilter: null,
  currentKinds: [],
  allCategories: [],
  filteredCategories: [],

  //
  allUnalteredResults: [],
  allResults: [],
  filteredResults: [],
  onlySearchInTitle: false,

  allFilters: null,
  allCommunities: null,
  filteredCommunities: null,
  mainFilters: null,
};

export const useFilterStore = defineStore({
  id: "filter",
  state: () => initialFilterState,
  getters: {
    filterInfo: (state) => {
      return {
        currentSearchTerm: state.currentSearchTerm,
        currentZips: state.currentZips,
        currentTags: state.currentTags,
        filterSort: state.filterSort,
        currentKinds: state.currentKinds,
      };
    },
  },
  actions: {
    setFilterInfo(newFilterInfo: typeof this.filterInfo) {
      this.currentSearchTerm = newFilterInfo.currentSearchTerm;
      this.currentZips = newFilterInfo.currentZips;
      this.currentTags = newFilterInfo.currentTags;
      this.filterSort = newFilterInfo.filterSort;
      this.currentKinds = newFilterInfo.currentKinds;
    },
    getUrlQuery() {
      const filterUrl = `?filter=${JSON.stringify(this.filterInfo)}`;
      const url = `${window.location.origin}${window.location.pathname}${filterUrl}`;
      // window.history.pushState({ path: url }, "", url);
      return url;
    },
    updateFromUrlQuery() {
      const getCurrentQueryParams = (): { [key: string]: string } => {
        const params: { [key: string]: string } = {};
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.forEach((value, key) => {
          params[key] = value;
        });
        return params;
      };

      const { filter } = getCurrentQueryParams();

      if (!filter) return;

      this.setFilterInfo(JSON.parse(filter));
      // const url = `${window.location.origin}${window.location.pathname}`;
      // window.history.pushState({ path: url }, "", url);
    },
    async clearSearch() {
      this.currentSearchTerm = "";
      this.currentZips = [];
      this.currentTags = [];
      this.mapFilter = null;

      await this.loadAllResults();
      this.loadFilteredResults();
    },
    async clearTermSearch() {
      this.currentSearchTerm = "";
      await this.loadAllResults();
      this.loadFilteredResults();
    },
    enableAllTags(tags: string[]) {
      this.currentTags = [...new Set([...this.currentTags, ...tags])];
    },
    disableAllTags(tags: string[]) {
      tags.forEach((tag) => {
        const index = this.currentTags.findIndex((item) => item === tag);
        if (index !== -1) this.currentTags.splice(index, 1);
      });
    },
    async loadAllCommunities() {
      if (this.allCommunities) return this.allCommunities;

      const api = useCollectionApi();
      api.setBaseApi(usePublicApi());
      api.setEndpoint(`communities`);

      await api.retrieveCollection();

      this.allCommunities = api.items.value;

      return this.allCommunities;
    },
    async loadAllFilters() {
      if (this.allFilters) return this.allFilters;

      this.allFilters = await getAllFilters();

      return this.allFilters;
    },
    async loadMainFilters(filterKind: FilterKind) {
      if (this.mainFilters) return this.mainFilters;

      this.mainFilters = await getMainFilters("filter_facility", filterKind);

      return this.mainFilters;
    },
    async checkIfMultipleFacilityFiltersAreSelected() {
      if (!this.currentKinds?.length || !this.currentTags?.length) return [];

      const filterKind = this.currentKinds[0];

      const mainFilters = await this.loadMainFilters(filterKind);
      const allFilters = await this.loadAllFilters();

      const allOptions = mainFilters.map((filter) => allFilters.filter((item) => item.parent_id === filter.id));

      const relevantItems = [];
      for (const block of allOptions) {
        const multipleOccuredInBlock = block.filter((item) => this.currentTags.includes(item.id));

        if (multipleOccuredInBlock.length) {
          relevantItems.push(multipleOccuredInBlock);
        }
      }

      return relevantItems.flat();
    },
    async loadUnalteredAllResults() {
      const options = {
        page: 1,
        per_page: 1000,
      };

      const api = useCollectionApi();
      api.setBaseApi(usePublicApi());
      api.setEndpoint(`care_facilities`);

      await api.retrieveCollection(options as any);

      this.allUnalteredResults = api.items.value;
    },
    async loadAllCategories() {
      const options = {
        page: 1,
        per_page: 1000,
      };

      const api = useCollectionApi();
      api.setBaseApi(usePublicApi());
      api.setEndpoint(`categories`);

      await api.retrieveCollection(options as any);

      this.allCategories = api.items.value
        .map((item) => {
          return item.sub_sub_categories;
        })
        .flat();
    },
    loadFilteredCategories() {
      if (!this.allCategories.length) return;
      this.filteredCategories = this.allCategories.filter((result) => {
        return (
          result.name.toUpperCase().includes(this.currentSearchTerm.toUpperCase()) ||
          result.description?.toUpperCase().includes(this.currentSearchTerm.toUpperCase())
        );
      });
    },
    loadFilteredCommunities() {
      if (!this.allCommunities.length) return;
      this.filteredCommunities = this.allCommunities
        .filter((community) => community.care_facilities_active_count > 0)
        .filter((community) => {
          if (!this.filteredResults?.length) return true;

          return this.filteredResults.find((result) => result.community_id === community.id || this.currentZips.includes(result.zip));
        });
      return this.filteredCommunities;
    },
    async loadAllResults() {
      this.loading = true;

      const multipleFacilityFiltersSelected = await this.checkIfMultipleFacilityFiltersAreSelected();

      const tagsToFilter = [...this.currentTags];

      if (multipleFacilityFiltersSelected.length) {
        multipleFacilityFiltersSelected.forEach((item) => {
          tagsToFilter.splice(
            tagsToFilter.findIndex((tag) => tag === item.id),
            1
          );
        });
      }

      this.allResults = this.allUnalteredResults
        .filter((result) => {
          return this.currentKinds.length ? this.currentKinds.includes(result.kind) : true;
        })
        .filter((result) => {
          return this.currentZips?.length ? this.currentZips.includes(result?.zip) : true;
        })
        .filter((result) => {
          if (!tagsToFilter.length) return true;

          return tagsToFilter.every((tag) => {
            return result.tag_category_ids.includes(tag);
          });
        });

      useNuxtApp().$bus.$emit("filtersUpdated");

      this.loading = false;

      this.loadFilteredResults(multipleFacilityFiltersSelected);
    },
    loadFilteredResults(filterCategories?: { id: string }[]) {
      if (this.loading || !this.allResults) return;

      const filteredResults: Facility[] = this.allResults
        .filter((result) => {
          return this.currentZips?.length ? this.currentZips.includes(result.zip) : true;
        })
        .filter((result) => {
          return (
            result.name.toUpperCase().includes(this.currentSearchTerm.toUpperCase()) ||
            (!this.onlySearchInTitle &&
              (result.description?.toUpperCase().includes(this.currentSearchTerm.toUpperCase()) ||
                result.tags.find((tag) => tag.name.toUpperCase().includes(this.currentSearchTerm.toUpperCase()))))
          );
        })

        .filter((facility) => {
          if (!filterCategories?.length) return true;

          return filterCategories.some((category) => facility.tag_category_ids.includes(category.id));
        });

      if (this.mapFilter) {
        this.filteredResults = filteredResults.filter((facility) => facility.id === this.mapFilter);
        return;
      }

      this.filteredResults = filteredResults;
    },
    toggleSort() {
      this.filterSort = this.filterSort === "A-Z" ? "Z-A" : "A-Z";
    },
    resetAllFilters() {
      this.currentSearchTerm = "";
      this.currentTags = [];
      this.currentZips = [];
      this.filterSort = "A-Z";
      this.loading = false;
      this.mapFilter = null;
      this.currentKinds = [];
      this.allResults = [];
      this.filteredResults = [];
      this.onlySearchInTitle = false;
      this.mainFilters = null;
      this.filteredCategories = [];
    },
  },
});
