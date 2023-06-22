type EmitAction = "CREATE" | "EDIT" | "DELETE";

export type AdditionalRaw = {
  type: "raw";
  value: any;
};

export type AdditionalApi = {
  type: "api";
  endpoint: string;
  path: string;
};

export type CollapsibleListItemAdditionalData = AdditionalRaw | AdditionalApi;

export type CollapsibleListItem = {
  id: string;
  title: string;
  additionalData?: CollapsibleListItemAdditionalData;
  canAddAdditionalData?: boolean;
  addEntryButtonText?: string;
  specialActionOnEditClick?: string;
  next?: CollapsibleListItem[];
};
