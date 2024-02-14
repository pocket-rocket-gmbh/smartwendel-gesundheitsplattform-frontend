<template>
	<div class="basic-search-box mt-6">
		<div class="content" ref="contentWrapperRef" v-resize="updatePopoverWidth">
			<v-row>
				<v-col class="d-flex">
					<span class="general-font-size text-h4 text-white">{{ subTitle }}</span>
					<v-btn
						v-if="useUser().isAdmin()"
						prepend-icon="mdi-content-copy"
						variant="outlined"
						rounded="pill"
						color="red darken-2"
						class="mx-5 mt-1"
						@click="copySearchFilterUrl"
					>
						Such-Filter kopieren
					</v-btn>
				</v-col>
				<v-col v-if="filterKind === 'facility'" md="2" class="d-flex justify-end">
					<v-btn
						variant="outlined"
						min-width="250px"
						max-width="250px"
						rounded="pill"
						size="large"
						color="white"
						@click="emit('toggleMap')"
						class="general-font-size"
					>
						<span v-if="showMap">Listenansicht</span>
						<span v-else>Kartenansicht</span>
					</v-btn>
				</v-col>
			</v-row>
			<v-row>
				<v-col v-if="filterKind !== 'event' && filterKind !== 'news'">
					<div class="field general-font-size">
						<label class="label is-white">
							<div class="search-term general-font-size">
								<p v-if="filterTitle">{{ filterTitle }}</p>
								<p v-else class="waiting general-font-size">
									<span>.</span>
									<span>.</span>
									<span>.</span>
								</p>
							</div>
						</label>
						<FacilityFilterSelection
							v-model="filterStore.currentFacilityTags"
							:popover-width="popoverWidth"
							:filter-kind="filterKind"
						/>
					</div>
				</v-col>
				<v-col v-if="filterKind !== 'event' && filterKind !== 'news'">
					<div class="field general-font-size">
						<label class="label is-white general-font-size">Gemeinde</label>
						<div class="select-wrapper">
							<div class="popover general-font-size" ref="popoverParentRef2" v-auto-animate>
								<div
									class="input"
									@click="
										showPopover = !showPopover;
										handleClearTermSearch();
									"
								>
									<div class="input-title">
										{{
											getAllSelectedCommunitiesName(filterStore.currentZips) || 'Gemeinde wählen'
										}}
									</div>
									<div class="actions">
										<div class="chevron" :class="[showPopover ? 'up' : 'down']"></div>
									</div>
								</div>
								<div
									class="popover-content general-font-size"
									:width="popoverWidth ? `${popoverWidth}px` : 'max-content'"
									v-if="showPopover"
									v-auto-animate
								>
									<div v-if="filterStore.filteredCommunities?.length">
										<div class="d-flex community-filter-options">
											<div v-for="community in filterStore.filteredCommunities" :key="community.id">
												<label class="option ma-n1">
													<v-btn
														hide-details
														@click.prevent="handleOptionSelectCommunity(community)"
														density="compact"
														class="options-select general-font-size ma-2 text-none font-weight-light"
														:class="{
															'is-selected': filterStore.currentZips.includes(community.zip),
														}"
													>
														{{ community.name }}
													</v-btn>
												</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</v-col>
				<v-col
					v-if="filterKind !== 'event' && filterKind !== 'news'"
					md="1"
					class="d-flex justify-center align-end is-white mb-4"
				>
					<div class="label general-font-size">oder</div>
				</v-col>
				<v-col>
					<div class="field general-font-size">
						<label class="label is-white">
							<div class="search-term">
								<p class="general-font-size" v-if="searchTitle">{{ searchTitle }}</p>
								<p v-else class="waiting general-font-size">
									<span>.</span>
									<span>.</span>
									<span>.</span>
								</p>
							</div>
						</label>
						<PublicSearchField
							v-model="filterStore.currentSearchTerm"
							:filtered-items="filterStore.filteredResults"
							:default-route-to="'/public/search'"
							:default-styling="true"
							@update:model-value="handleInput"
							:kind="filterKind"
						/>
					</div>
				</v-col>
				<v-col class="d-flex align-end field">
					<v-btn
						class="general-font-size"
						min-width="250px"
						max-width="250px"
						size="large"
						variant="outlined"
						rounded="pill"
						color="white"
						@click="filterStore.clearSearch()"
					>
						<span>Filter löschen</span>
					</v-btn>
				</v-col>
			</v-row>
		</div>
	</div>
	<v-row class="has-bg-darken-grey text-white">
		<v-col class="d-flex justify-center align-center bottom-actions mx-3">
			<LoadingSpinner v-if="filterStore.loading" />
			<span class="general-font-size" v-else-if="filterStore.filteredResults.length">
				{{ filterStore.filteredResults.length }}
				<span v-if="filterStore.currentKinds.includes('facility')">Anbieter</span>
				<span v-else-if="filterStore.currentKinds.includes('event')">
					<span v-if="filterStore.filteredResults.length === 1">Veranstaltung</span>
					<span v-else>Veranstaltungen</span>
				</span>
				<span v-else-if="filterStore.currentKinds.includes('news')">
					<span v-if="filterStore.filteredResults.length === 1">Beitrag</span>
					<span v-else>Beiträge</span>
				</span>
				<span v-else-if="filterStore.currentKinds.includes('course')">
					<span v-if="filterStore.filteredResults.length === 1">Kurs</span>
					<span v-else>Kurse</span>
				</span>
			</span>
			<span class="general-font-size" v-else-if="!appStore.loading">
				Leider keine Ergebnisse gefunden. Bitte passe deine Suche an.
			</span>
			<span v-else>Bitte warten...</span>
		</v-col>
	</v-row>
</template>
<script setup lang="ts">
import { type FilterKind, useFilterStore } from '~/store/searchFilter';
import { useAppStore } from '@/store/app';
import { onClickOutside } from '@vueuse/core';

const appStore = useAppStore();

const snackbar = useSnackbar();

const showPopover = ref(false);

const props = defineProps<{
	title: string;
	subTitle: string;
	filterKind: FilterKind;
	mapControls?: boolean;
	showMap?: boolean;
}>();

const filterStore = useFilterStore();

const emit = defineEmits<{
	(event: 'toggleMap'): void;
}>();

const popoverParentRef2 = ref<HTMLDivElement>();

onClickOutside(popoverParentRef2, () => (showPopover.value = false));

const getAllSelectedCommunitiesName = (zips: string[]) => {
	if (!zips.length) return '';
	const allSelectedCommunities = filterStore.allCommunities.filter((community) =>
		zips.includes(community.zip)
	);
	return allSelectedCommunities.map((community) => community.name).join(', ');
};

const handleOptionSelectCommunity = (community: any) => {
	if (filterStore.currentZips.includes(community?.zip)) {
		filterStore.currentZips = filterStore.currentZips.filter((item) => item !== community.zip);
	} else {
		filterStore.currentZips.push(community.zip);
	}
};

const contentWrapperRef = ref<HTMLDivElement>();
const popoverWidth = ref(0);

const updatePopoverWidth = () => {
	if (!contentWrapperRef.value) return;
	popoverWidth.value = contentWrapperRef.value.getBoundingClientRect().width;
};

const handleInput = () => {
	filterStore.onlySearchInTitle = false;
	filterStore.loadAllResults();
};

const handleClearTermSearch = () => {
	if (filterStore.currentSearchTerm) {
		filterStore.clearTermSearch();
	}
	return;
};

const filterTitle = ref('');
const searchTitle = ref('');
const setFilterTitle = () => {
	if (props.filterKind === 'facility') {
		filterTitle.value = 'Branche';
		searchTitle.value = 'Anbieter suchen';
	}
	if (props.filterKind === 'event') {
		filterTitle.value = 'Suche nach Veranstaltungen';
		searchTitle.value = 'Veranstaltung suchen';
	}
	if (props.filterKind === 'news') {
		filterTitle.value = 'Suche nach Neuigkeiten';
		searchTitle.value = 'Nachrichten suchen';
	}
	if (props.filterKind === 'course') {
		filterTitle.value = 'Themengebiet';
		searchTitle.value = 'Kurs suchen';
	}
};

const copySearchFilterUrl = () => {
	snackbar.showSuccess('Filter in Zwischenablage gespeichert!');
	const url = filterStore.getUrlQuery();
	navigator.clipboard.writeText(url);
};

onMounted(async () => {
	await filterStore.loadAllCommunities();
	updatePopoverWidth();
	setFilterTitle();
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
.basic-search-box
  // background: linear-gradient(88.43deg, #91A80D 13.65%, #BAC323 35.37%, #9EA100 82.27%)
  background: $dark-green
  padding: 2rem 5rem

  @include md
    padding: 1rem

.align-end
  display: flex
  align-items: flex-end
  justify-content: flex-end

.title
  text-transform: uppercase
  font-size: 3rem
  text-align: center
  color: white

.no-entries
  background-color: #636362
  color: white
  padding: 1rem 1.5rem
  border-radius: 2rem
  width: fit-content
  margin-left: auto

.center
  display: flex
  align-items: center

.bottom-actions
  height: 50px

.select-wrapper
  position: relative
  display: flex
  align-items: center

  .select
    cursor: pointer

  &::after
    content: ""
    width: 20px
    height: 20px
    position: absolute
    right: 0.75rem
    background-repeat: no-repeat
    background-position: center
    pointer-events: none

.search-term
  display: flex
  align-items: center
  gap: 1rem

.bordered
  --v-btn-height: 38px

  @keyframes blink
    0%
      opacity: .2
    20%
      opacity: 1
    100%
      opacity: .2

.waiting span
  animation-name: blink
  animation-duration: 1.4s
  animation-iteration-count: infinite
  animation-fill-mode: both


.waiting span:nth-child(2)
  animation-delay: .2s

.waiting span:nth-child(3)
  animation-delay: .4s

.community-filter-options
  width: 50vh
  flex-wrap: wrap
  gap: .5rem
</style>
