import * as L from "leaflet";
import "../public/js/leaflet.mask";
import "leaflet.markercluster";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      L,
    },
  };
});
