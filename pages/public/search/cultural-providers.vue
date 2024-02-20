<template>
	<ClientOnly>
		<div>
			<PublicSearchTheBasicSearchBox
				title="Anbietersuche"
				sub-title="Kultur erleben - Anbieter finden!"
				:map-controls="true"
				:show-map="showMap"
				@toggle-map="mapToogle"
				:filter-kind="'facility'"
			/>

			<v-container fluid>
				<v-row>
					<v-col :cols="12" class="d-none d-md-block">
						<v-skeleton-loader type="card" v-if="appStore.loading"></v-skeleton-loader>
						<ClientMap
							:locations="locations"
							v-if="showMap && !appStore.loading"
							ref="map"
							:auto-fit="false"
							:center-point="{
								lat: 50.03646,
								lng: 12.00258,
							}"
							:min-zoom="11"
						/>
					</v-col>

					<v-col :cols="12" :md="4">
						<PublicSearchTheFilter :filterKind="'facility'" />
					</v-col>
					<v-col :cols="12" :md="8">
						<PublicSearchTheFilteredCareFacilities @showOnMap="handleShowOnMap" />
					</v-col>
				</v-row>
			</v-container>

			<v-row v-if="!filterStore.filteredResults.length && !appStore.loading">
				<v-col class="d-flex flex-column align-center justify-center">
					<div class="flex-column" align="center">
						<div class="general-font-size text-h4">
							Leider haben wir kein Suchergebnis zu deiner Anfrage.
						</div>
					</div>
					<img :src="noResults" class="no-results-image mt-10" />
				</v-col>
			</v-row>
		</div>
	</ClientOnly>
</template>

<script setup lang="ts">
import { useFilterStore } from '~/store/searchFilter';
import type { MapLocation } from '~/types/MapLocation';
import { BreakPoints, useBreakpoints } from '~/composables/ui/breakPoints';
import { useAppStore } from '~/store/app';
import noResults from '~/assets/images/search_no_results.jpg';

const appStore = useAppStore();

const filterStore = useFilterStore();
const breakpoints = useBreakpoints();
const showMap = ref(true);

watch(
	() => filterStore.filterSort,
	() => {
		filterStore.loadAllResults();
	}
);

watch(
	() => filterStore.filteredResults,
	() => updateLocations()
);

watch(
	() => appStore.loading,
	() => {
		if (appStore.loading) return;
		filterStore.loadAllResults();
	}
);

const showSearchFilter = computed(() => {
	return breakpoints.width.value > BreakPoints.md;
});

const locations = ref<MapLocation[]>([]);
const getLocationsFromFacilies = async (facilities: any[]) => {
	locations.value = [];

	for (const facility of facilities) {
		if (
			facility.geocode_address?.length &&
			facility.geocode_address[0] &&
			facility.geocode_address[0].lon &&
			facility.geocode_address[0].lat
		) {
			locations.value.push({
				id: facility.id,
				latitude: parseFloat(facility.geocode_address[0].lat),
				longitude: parseFloat(facility.geocode_address[0].lon),
				draggable: false,
				name: facility.name,
				url: `${window.location.origin}/public/care_facilities/${facility.id}`,
				imageUrl: facility.logo_url,
				kind: facility.kind,
			});
		}

		facility.locations.forEach((location: any) => {
			locations.value.push({
				id: facility.id,
				longitude: parseFloat(location.longitude),
				latitude: parseFloat(location.latitude),
				draggable: false,
				name: facility.name,
				url: `${window.location.origin}/public/care_facilities/${facility.id}`,
				imageUrl: facility.logo_url,
				kind: facility.kind,
			});
		});
	}
};

const handleShowOnMap = () => {
	showMap.value = true;
};

const updateLocations = () => {
	getLocationsFromFacilies(filterStore.filteredResults);
};

const mapToogle = () => {
	showMap.value = !showMap.value;
};

onMounted(async () => {
	await nextTick();
	filterStore.currentKinds = ['facility'];
	filterStore.updateFromUrlQuery();
	filterStore.loadAllResults();
	showMap.value = !breakpoints.isMobile.value;
});

onBeforeUnmount(() => {
	filterStore.resetAllFilters();
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.container
  padding: 2rem 5rem
  display: flex
  gap: 1rem

  @include md
    padding: 1rem

  .filters
    flex: 1

  .results
    flex: 2

  .row
    max-width: 100%
    margin: 0
    gap: 1rem
    @include md
      margin: 0

  .map-widget
    align-self: stretch

.filter-control
  background-color: $dark-green
</style>
