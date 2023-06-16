import axios from "axios";
import { defineStore } from "pinia";

export const filterSortingDirections = ["Aufsteigend", "Absteigend"] as const;

export type CategoriesFilter = "category" | "subCategory" | "subSubCategory" | "tags";

type Filter = {
  currentSearchQuery: string;
  currentCategoryId: string;
  currentSubCategoryId: string;
  currentSubSubCategoryId: string;
  currentTags: string[];
  filterSort: (typeof filterSortingDirections)[number];
  careFaclities: any[];
  loading: boolean;
  mapFilter: string;
};

const initialFilterState: Filter = {
  currentSearchQuery: "",
  currentCategoryId: null,
  currentSubCategoryId: null,
  currentSubSubCategoryId: null,
  currentTags: [],
  filterSort: "Aufsteigend",
  careFaclities: [],
  loading: false,
  mapFilter: null,
};

export const useFilterStore = defineStore({
  id: "filter",
  state: () => initialFilterState,
  getters: {
    filterInfo: (state) => {
      return {
        currentSearchQuery: state.currentSearchQuery,
        currentCategoryId: state.currentCategoryId,
        currentSubCategoryId: state.currentSubCategoryId,
        currentSubSubCategoryId: state.currentSubSubCategoryId,
        currentTags: state.currentTags,
        filterSort: state.filterSort,
      };
    },
  },
  actions: {
    setFilterInfo(newFilterInfo: typeof this.filterInfo) {
      this.currentSearchQuery = newFilterInfo.currentSearchQuery;
      this.currentCategoryId = newFilterInfo.currentCategoryId;
      this.currentSubCategoryId = newFilterInfo.currentSubCategoryId;
      this.currentSubSubCategoryId = newFilterInfo.currentSubSubCategoryId;
      this.currentTags = newFilterInfo.currentTags;
      this.filterSort = newFilterInfo.filterSort;
    },
    updateUrlQuery() {
      const filterUrl = `?filter=${JSON.stringify(this.filterInfo)}`;
      const url = `${window.location.origin}${window.location.pathname}${filterUrl}`;
      window.history.pushState({ path: url }, "", url);
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
    },
    clearSearch() {
      this.currentSearchQuery = "";
      this.currentCategoryId = null;
      this.currentSubCategoryId = null;
      this.currentSubSubCategoryId = null;
      this.currentTags = [];
      this.mapFilter = null;

      this.loadCareFacilities();
    },
    updateCategoriesFilter(toUpdate: CategoriesFilter, value: string | string[]) {
      this.mapFilter = null;

      if (toUpdate === "category" && typeof value === "string") {
        this.currentCategoryId = value;
        this.currentSubCategoryId = null;
        this.currentSubSubCategoryId = null;
      }
      if (toUpdate === "subCategory" && typeof value === "string") {
        this.currentSubCategoryId = value;
        this.currentSubSubCategoryId = null;
      }
      if (toUpdate === "subSubCategory" && typeof value === "string") {
        this.currentSubSubCategoryId = value;
      }
      if (toUpdate === "tags" && Array.isArray(value)) {
        this.currentTags = value;
      }
    },
    async loadCareFacilities(endpoint: string = "care_facilities?kind=facility") {
      this.loading = true;

      const filters = [];

      if (this.currentCategoryId) {
        filters.push({ field: "care_facility_category", value: this.currentCategoryId });
      }
      if (this.currentSubCategoryId) {
        filters.push({ field: "care_facility_sub_category", value: this.currentSubCategoryId });
      }
      if (this.currentSubSubCategoryId) {
        filters.push({ field: "care_facility_sub_sub_category", value: this.currentSubSubCategoryId });
      }
      if (this.currentTags) {
        filters.push({ field: "care_facility_tags", value: this.currentTags });
      }

      const options = {
        page: 1,
        per_page: 25,
        sort_by: "name",
        sort_order: this.filterSort == "Aufsteigend" ? "ASC" : "DESC",
        searchQuery: this.currentSearchQuery,
        concat: false,
        filters,
      };

      const careFaclitiesApi = useCollectionApi();
      careFaclitiesApi.setBaseApi(usePublicApi());
      careFaclitiesApi.setEndpoint(endpoint);

      await careFaclitiesApi.retrieveCollection(options as any);

      const allFacilities = careFaclitiesApi.items.value;

      const getLatLngFromZipCodeAndStreet = async (zipCode: string, street: string) => {
        const { data } = await axios.get(
          `https://geocode.maps.co/search?postalcode=${zipCode}&street=${street}&country=DE`
        );

        if (!data.length) {
          return null;
        }

        const bestResult = data[0];

        return [bestResult.lat, bestResult.lon];
      };

      for (const facility of allFacilities) {
        if (facility.zip && facility.street) {
          const response = await getLatLngFromZipCodeAndStreet(facility.zip, facility.street);

          if (response) {
            const [lat, lon] = response;

            facility.latitude = lat;
            facility.longitude = lon;
          }
        }
      }

      this.careFaclities = allFacilities;
      this.loading = false;

      if (this.mapFilter) {
        this.careFaclities = this.careFaclities.filter((facility) => facility.id === this.mapFilter);
      }

      this.updateUrlQuery();
    },
  },
});
