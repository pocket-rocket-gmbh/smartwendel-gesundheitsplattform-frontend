import type { Facility } from "~/store/searchFilter";

export const isCompleteFacility = (facility: Facility) => {
  return !(
    facility &&
    facility.name &&
    facility.logo_url &&
    facility.image_url &&
    facility.description &&
    facility.description !== "<p><br></p>" &&
    facility.tag_category_ids?.length &&
    facility.street &&
    facility.community_id &&
    facility.zip &&
    facility.town &&
    facility.phone &&
    facility.email &&
    facility.name_responsible_person
  );
};

