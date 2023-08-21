import { Facility } from "~/store/searchFilter";

export const isCompleteFacility = (facility: Facility) => {
  return !(
    facility &&
    facility.name &&
    facility.logo_url &&
    facility.image_url &&
    facility.description &&
    facility.tag_category_ids?.length &&
    facility.street &&
    facility.community_id &&
    facility.zip &&
    facility.town &&
    facility.phone &&
    facility.email
  );
};
