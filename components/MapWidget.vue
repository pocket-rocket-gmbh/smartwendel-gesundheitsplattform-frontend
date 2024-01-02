<template>
  <div class="mapwidget" :id="mapWidgetId"></div>
  <div align="right" class="my-2 has-text-white">
    <p class="general-font-size">© GeoBasis-DE / BKG (2023)</p>
  </div>
</template>

<script setup lang="ts">
import { PropType, onMounted, onUnmounted } from "vue";
import L, { LatLngExpression, Map } from "leaflet";
import "../js/leaflet.mask";
import "leaflet.markercluster";
import { MapLocation } from "@/types/MapLocation";

import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

type Location = {
  id: string;
  longitude: number;
  latitude: number;
};

const props = defineProps({
  zoomControl: {
    type: Boolean,
    default: true,
  },
  minZoom: {
    type: Number,
    default: 1,
  },
  maxZoom: {
    type: Number,
    default: 17,
  },
  defaultZoom: {
    type: Number,
  },
  autoFit: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    required: false,
    type: Boolean,
  },
  locations: {
    type: Array as PropType<MapLocation[]>,
    default(): MapLocation[] {
      return [];
    },
  },
  centerPoint: {
    type: Object as PropType<LatLngExpression>,
  },
  zoom: {
    type: Boolean,
    default: true,
  },
  centerZoom: {
    type: Boolean,
    default: false,
  },
  drag: {
    type: Boolean,
    default: true,
  },
  tap: {
    type: Boolean,
    default: true,
  },
  attributionFontSize: {
    type: Number,
    default: 12,
  },
});

const emit = defineEmits<{
  (event: "markerClick", target: any): void;
  (event: "scroll"): void;
}>();

const mapWidgetId = "map" + Math.floor(Math.random() * 100000000000); // THIS IS A WORKAROUND  'const mapWidgetId = 'map' + self.crypto.randomUUID()'

let locationMarkers: Array<L.Marker<any>> = []; // TEMP ANY LocationMarker
let map: Map = null;
let facilitiesClusterlayer: any = null;
let eventsClusterlayer: any = null;

let programmaticScrollInProgress = false;

watch(props, () => {
  refreshView();
});

onUnmounted(() => {
  clearMap();
});

onMounted(async () => {
  map = L.map(mapWidgetId, {
    zoomControl: props.zoomControl,
  });
    //L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { // OpenStreetMaps for testing.
    L.tileLayer('https://api.maptiler.com/maps/1273b8ef-8485-4e5e-9b5f-0e676ef766c1/256/{z}/{x}/{y}.png?key=tVi34bM6PTUr9iztZ0dR', { // MapTiler Development for usage on developer workstations.
    // L.tileLayer('https://api.maptiler.com/maps/1273b8ef-8485-4e5e-9b5f-0e676ef766c1/256/{z}/{x}/{y}.png?key=ZKYxdvnMOpWy7cmBIb2L', { // MapTiler Production: Commit only with this line active!!!.
      minZoom: props.minZoom,
      maxZoom: props.maxZoom
    }).addTo(map);

  createAttribution();
  if (!props.zoom) {
    disableZoom();
  } else {
    // Enable mouse wheel zoom after map has been clicked once to avoid zooming when scrolling over the page.
    map.scrollWheelZoom.disable();
    map.once("focus", function () {
      map.scrollWheelZoom.enable();
    });
  }
  if (props.centerZoom) {
    enableCenterZoom();
  }
  if (!props.drag) {
    disableDragging();
  }
  if (!props.tap) {
    disableTapping();
  }
  map.on("moveend", function () {
    if (!programmaticScrollInProgress) {
      emit("scroll");
    }
  });
  if (props.centerPoint) {
    programmaticScrollInProgress = true;
    map.setView(props.centerPoint, getZoom());
    programmaticScrollInProgress = false;
  }

  // @ts-expect-error no type
  L.mask("/LKWND.geojson", { fillOpacity: 0.7, restrictBounds: false }).addTo(map);

  refreshView();
});

const refreshView = async () => {
  clearMap();

  locationMarkers = [];

  // @ts-expect-error no type
  facilitiesClusterlayer = L.markerClusterGroup({
    iconCreateFunction: function (cluster: any) {
      return L.divIcon({
        html: cluster.getAllChildMarkers().length.toString(),
        className: "clustericon",
        iconSize: L.point(40, 40),
      });
    },
    showCoverageOnHover: false,
  });
  // @ts-expect-error no type
  eventsClusterlayer = L.markerClusterGroup({
    iconCreateFunction: function (cluster: any) {
      return L.divIcon({
        html: cluster.getAllChildMarkers().length.toString(),
        className: "clustericon",
        iconSize: L.point(40, 40),
      });
    },
    showCoverageOnHover: false,
  });

  props.locations.forEach((location: MapLocation) => {
    const mapMarkerIcon = L.icon({
      iconUrl: "/map-marker-green.svg",
      shadowUrl: null,
      iconSize: [60, 60], // size of the icon
      shadowSize: [0, 0], // size of the shadow
      iconAnchor: [30, 51], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 0], // the same for the shadow
      popupAnchor: [-5, -55], // point from which the popup should open relative to the iconAnchor
    });
    const marker = new L.Marker([location.latitude, location.longitude], {
      icon: mapMarkerIcon,
      draggable: location.draggable,
    });

    const popup = L.popup().setContent(
      `
      <div class="popup">
  ${location.imageUrl ? '<img class="background" src="' + location.imageUrl + '" />' : ""}
  <h2 class="name">
    <div style="text-align: center">
      <span>${location.name}</span>
      </div>
      </h2>
      <div class="action">
        <a class="link" style="text-align: center" href="${
          location.url
        }" target="_blank">Mehr Details</a>
        </div>
        </div>
        `
    );

    if (!props.isEdit) {
      marker.bindTooltip(location.name);
      marker.bindPopup(location.name);
      marker.bindPopup(popup);
    }
    // @ts-expect-error no id on type marker
    marker.id = location.id;

    locationMarkers.push(marker);

    marker.on("click", function (marker: any) {
      emit("markerClick", marker.sourceTarget);
    });

    if (location.kind === "event") {
      eventsClusterlayer.addLayer(marker);
    } else {
      facilitiesClusterlayer.addLayer(marker);
    }
  });

  const handleClusterClick = (cluster: any) => {
    // If this is a cluster click and not a marker click.
    if (cluster.layer._childCount) {
      // Zoom to bounds if the map is not at its highest zoom level.
      // @ts-expect-error wrong type
      if (map._zoom < props.maxZoom) {
        cluster.layer.zoomToBounds();
      }
      // Otherwise perform spider legging.
      else {
        cluster.layer.spiderfy();
      }
    }
  };

  facilitiesClusterlayer.on("click", handleClusterClick);
  eventsClusterlayer.on("click", handleClusterClick);

  map.addLayer(facilitiesClusterlayer);
  map.addLayer(eventsClusterlayer);

  const group = L.featureGroup(locationMarkers);
  if (!group || !group.getBounds().isValid()) return;

  map.fitBounds(group.getBounds(), {
    padding: [100, 100],
  });
};

const getLocations = (): Array<Location> => {
  const result: Location[] = [];

  locationMarkers.forEach((element) => {
    result.push({
      // @ts-expect-error no id on type marker
      id: element?.id,
      longitude: element.getLatLng().lng,
      latitude: element.getLatLng().lat,
    });
  });

  return result;
};

const clearMap = () => {
  if (facilitiesClusterlayer) {
    map.removeLayer(facilitiesClusterlayer);
    facilitiesClusterlayer.clearLayers();
    facilitiesClusterlayer = null;
  }
  if (eventsClusterlayer) {
    map.removeLayer(eventsClusterlayer);
    eventsClusterlayer.clearLayers();
    eventsClusterlayer = null;
  }
};

const getZoom = () => {
  if (props.defaultZoom) {
    return props.defaultZoom;
  }

  return props.minZoom;
};

const createAttribution = () => {
  map.attributionControl.addAttribution(
    `<span style="font-size: ${props.attributionFontSize}px"><a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a></span>`
  );
  map.attributionControl.setPrefix("");
  map.attributionControl.getContainer().style.height = `${
    props.attributionFontSize + 4
  }px`;
  map.attributionControl.getContainer().style.paddingRight = "2px";
  map.attributionControl.getContainer().style.paddingLeft = "2px";
  map.attributionControl.getContainer().style.paddingTop = getTopPaddingFromFontSize(
    props.attributionFontSize
  );
  map.attributionControl.getContainer().style.lineHeight = `${props.attributionFontSize}px`;
};

const getTopPaddingFromFontSize = (fontsize: number) => {
  if (fontsize < 8) {
    return "0px";
  } else if (fontsize < 10) {
    return "1px";
  } else {
    return "2px";
  }
};

const disableAll = () => {
  disableZoom();
  disableDragging();
  disableTapping();
};

const disableZoom = () => {
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
};

const enableCenterZoom = () => {
  map.options.scrollWheelZoom = "center";
};

const disableDragging = () => {
  map.dragging.disable();
  map.keyboard.disable();
};

const disableTapping = () => {
  if (map.tap) {
    map.tap.disable();
  }
};

defineExpose({
  refreshView,
  getLocations,
});
</script>

<style lang="scss">
.mapwidget {
  height: 60vh;
  z-index: 0;
}

@media only screen and (max-width: 960px) {
  .mapwidget {
    height: 60vh;
  }
}

div.clustericon {
  background-color: #007344;
  text-align: center;
  font-size: 1.5em;
  border-radius: 25px;
  color: white;
  display: grid;
  place-items: center;
}

.leaflet-popup-content-wrapper {
  padding: 0;
  overflow: hidden;
  width: 250px;
  min-height: 125px;
  text-align: left;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  justify-content: space-between;
  display: flex;

  .leaflet-popup-content {
    min-width: 250px;
    max-width: 250px;
    display: flex;
    text-align: center;
    margin: 0;
    position: relative;
    flex-direction: column;
    align-items: center;

    .popup {
      .background {
        height: 150px;
        width: 100%;
        object-fit: cover;
      }

      .name {
        font-size: 22px;
        line-height: 1.3;
        margin-top: 0.5rem;
      }

      .action {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;

        .link {
          text-decoration: none;
          color: #212120;
          font-weight: bold;
          background-color: #91a80d;
          color: white;
          border-radius: 1rem;
          padding: 1rem;
        }
      }
    }
  }
}
</style>
