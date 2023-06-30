import { ResultStatus } from "~/types/serverCallResult";

export type FilterType = "facility" | "service";

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

export const getMainFilters = async (filterType: FilterType) => {
  const api = useCollectionApi();
  api.setBaseApi(usePublicApi());
  api.setEndpoint(`tag_categories`);

  const response = await api.retrieveCollection();
  if (response.status === ResultStatus.FAILED) {
    throw response;
  }

  const filters: any[] = response?.data?.resources || [];
  const relevantFilter = filters.find((filter) =>
    filterType === "facility" ? filter.kind === "facility" : filter.kind !== "facility"
  );

  if (!relevantFilter) throw "Filter not found";

  return await getFilters(relevantFilter.id);
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
