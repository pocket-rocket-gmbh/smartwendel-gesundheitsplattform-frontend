import axios from "axios";
import { defineStore } from "pinia";
import { getMainFilters } from "../utils/filter.utils";

export const filterSortingDirections = ["Aufsteigend", "Absteigend"] as const;

export type CategoriesFilter = "category" | "subCategory" | "subSubCategory" | "tags";
export type FilterKind = "facility" | "news" | "event" | "course";

export type Filter = {
  currentSearchQuery: string;
  currentTags: string[];
  currentZip: string;
  filterSort: (typeof filterSortingDirections)[number];
  filterResults: any[];
  loading: boolean;
  mapFilter: string;
  currentKinds: FilterKind[];
};

const initialFilterState: Filter = {
  currentSearchQuery: "",
  currentTags: [],
  currentZip: null,
  filterSort: "Aufsteigend",
  filterResults: [],
  loading: false,
  mapFilter: null,
  currentKinds: [],
};

export const useFilterStore = defineStore({
  id: "filter",
  state: () => initialFilterState,
  getters: {
    filterInfo: (state) => {
      return {
        currentSearchQuery: state.currentSearchQuery,
        currentZip: state.currentZip,
        currentTags: state.currentTags,
        filterSort: state.filterSort,
        currentKinds: state.currentKinds,
      };
    },
  },
  actions: {
    setFilterInfo(newFilterInfo: typeof this.filterInfo) {
      this.currentSearchQuery = newFilterInfo.currentSearchQuery;
      this.currentZip = newFilterInfo.currentZip;
      this.currentTags = newFilterInfo.currentTags;
      this.filterSort = newFilterInfo.filterSort;
      this.currentKinds = newFilterInfo.currentKinds;
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
      this.currentZip = null;
      this.currentTags = [];
      this.mapFilter = null;

      this.loadCareFacilities();
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
    async loadCareFacilities(endpoint: string = "care_facilities") {
      this.loading = true;

      const filters = [];

      if (this.currentTags) {
        filters.push({ field: "care_facility_tag_categories", value: this.currentTags });
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
      careFaclitiesApi.setEndpoint(`${endpoint}?kind=${this.currentKinds.join(",")}`);

      await careFaclitiesApi.retrieveCollection(options as any);

      const allFacilities = careFaclitiesApi.items.value;

      const getLatLngFromZipCodeAndStreet = async (zipCode: string, street: string) => {
        try {
          const { data } = await axios.get(
            `https://geocode.maps.co/search?postalcode=${zipCode}&street=${street}&country=DE`
          );

          if (!data.length) {
            return null;
          }

          const bestResult = data[0];

          return [bestResult.lat, bestResult.lon];
        } catch (err) {
          console.error(err);
          return null;
        }
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

      this.filterResults = allFacilities;
      this.loading = false;

      if (this.mapFilter) {
        this.filterResults = this.filterResults.filter((facility) => facility.id === this.mapFilter);
      }

      // this.updateUrlQuery();
    },
  },
});
