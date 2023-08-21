import { Facility, FilterType } from "~/store/searchFilter";

export type CreateEditFacility = Partial<
  Facility & {
    offlineImageFiles?: string[];
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

export type CreateEditStep = {
  label: string;
  description: string;
  props: string[];
  placeholder?: string;
  tooltip?: string;
  justSome?: boolean;
  specialFilter?: FilterType;
  checkHandler?: (item: any) => boolean
};
export type CreateEditSteps<T extends string> = {
  [key in T]: CreateEditStep;
};
