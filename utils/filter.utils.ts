import type { FilterKind, FilterType } from "~/store/searchFilter";
import { ResultStatus } from "~/types/serverCallResult";

export const getFilters = async (parentId: string) => {
  const api = useCollectionApi();
  api.setBaseApi(usePublicApi());
  api.setEndpoint(`tag_categories?parent_id=${parentId}`);

  const relevantFilterResponse = await api.retrieveCollection({
    page: 1,
    per_page: 999,
    sort_by: "menu_order",
    sort_order: "asc",
    searchQuery: null as any,
    concat: false,
    filters: [] as any,
  });
  if (relevantFilterResponse.status === ResultStatus.FAILED) {
    throw relevantFilterResponse;
  }
  const filterItemOptions: any[] = relevantFilterResponse?.data?.resources || [];
  return filterItemOptions;
};

export const getMainFilters = async (filterType: FilterType, filterKind: FilterKind) => {
  const api = useCollectionApi();
  api.setBaseApi(usePublicApi());
  api.setEndpoint(`tag_categories`);

  const response = await api.retrieveCollection();
  if (response.status === ResultStatus.FAILED) {
    throw response;
  }

  const filters: any[] = response?.data?.resources || [];
  const relevantFilter = filters.find((filter) => filter.filter_type === filterType && filter.kind === filterKind);

  if (!relevantFilter) return [];

  return await getFilters(relevantFilter.id);
};

export const getAllFilters = async () => {
  const api = useCollectionApi();
  api.setBaseApi(usePublicApi());
  api.setEndpoint(`tag_categories?show_all=${true}`);
  const response = await api.retrieveCollection({
    page: 1,
    per_page: 999,
    sort_by: "menu_order",
    sort_order: "asc",
    searchQuery: null as any,
    concat: false,
    filters: [] as any,
  });

  if (response.status === ResultStatus.FAILED) {
    throw response;
  }

  return (response?.data?.resources || []) as any[];
};

export const getCurrentUserFacilities = async () => {
  const api = useCollectionApi();
  api.setBaseApi(usePrivateApi());
  api.setEndpoint("care_facilities?kind=facility");
  const res = await api.retrieveCollection();
  if (res.status !== ResultStatus.SUCCESSFUL) return [];

  const userFacility = res?.data?.resources[0];

  if (!userFacility) return [];

  return userFacility;
};

export const filterKindToFilterScope = (kind: FilterKind) => {
  if (kind !== "facility") return kind;

  return "care_facility";
};
