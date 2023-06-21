export type CollapsibleFieldItem = {
  text: string;
  value: string;
  type: "icon" | "string";
  emit?: string;
  tooltip?: string;
};

export type AdditionalRaw = {
  type: "raw";
  value: any;
};

export type AdditionalApi = {
  type: "api";
  endpoint: string;
  paths: string[];
};

export type CollapsibleListItemAdditionalData = AdditionalRaw | AdditionalApi;

export type CollapsibleListItem = {
  id: string;
  title: string;
  additionalData?: CollapsibleListItemAdditionalData;
  next?: CollapsibleListItem[];
};
