import { Facility } from "~/store/searchFilter";

export type CreateEditFacility = Partial<
  Facility & {
    offlineImageFile?: string;
    offlineLocations?: { latitude: number; longitude: number }[];
    offlineDocuments?: {
      document: string;
      documentname: string;
      tag: "documents" | "insurance";
    }[];
    additional_address_info: string;
    community_id?: string;
  }
>;
