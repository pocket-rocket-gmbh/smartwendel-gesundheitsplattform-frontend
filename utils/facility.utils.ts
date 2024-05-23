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
    facility.authorized_represent_name
  );
};
export const isCompleteEvent = (facility: Facility) => {
  return !(
    facility &&
    facility.name &&
    facility.name_instructor &&
    facility.description &&
    facility.description !== "<p><br></p>" &&
    facility.tags?.length &&
    facility.event_dates?.length &&
    facility.community_id &&
    facility.zip &&
    facility.town &&
    facility.phone &&
    facility.street
  );
};
export const isCompleteCourse = (facility: Facility) => {
  return !(
    facility &&
    facility.name &&
    facility.name_instructor &&
    facility.image_url &&
    facility.description &&
    facility.description !== "<p><br></p>" &&
    facility.tag_category_ids?.length &&
    facility.event_dates?.length &&
    facility.street &&
    facility.community_id &&
    facility.zip &&
    facility.town
  );
};

export const isCompleteNews = (facility: Facility) => {
  return !(
    facility &&
    facility.name &&
    facility.name_responsible_person &&
    facility.description &&
    facility.description !== "<p><br></p>" &&
    facility.tags?.length
  );
};
