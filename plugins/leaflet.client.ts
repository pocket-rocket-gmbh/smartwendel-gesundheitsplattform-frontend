import L from "leaflet";
import "../public/js/leaflet.mask";
import "leaflet.markercluster";

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.provide("L", L);
})
