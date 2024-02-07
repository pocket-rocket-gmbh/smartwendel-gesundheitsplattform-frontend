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
    sanitized_documents: string[];
    additional_address_info: string;
    community_id?: string;
    is_active?: boolean;
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
  checkHandler?: (item: any) => boolean;
};
export type CreateEditSteps<T extends string> = {
  [key in T]: CreateEditStep;
};

export type RequiredField = {
  props: string[];
  justSome?: boolean;
  specialFilter?: FilterType;
  checkHandler?: (item: any) => boolean;
};
