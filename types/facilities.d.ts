import { Facility } from "~/store/searchFilter";

export type CreateEditFacility = Partial<
  Facility & {
    offlineImageFile?: string;
    offlineLocations?: { latitude: number; longitude: number }[];
    additional_address_info: string;
    community_id?: string;
  }
>;
