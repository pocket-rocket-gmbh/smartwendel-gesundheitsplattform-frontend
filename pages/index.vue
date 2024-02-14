<template>
	<div>
		<div class="background">
			<PublicLandingHeader />
		</div>
		<div>
			<!-- <PublicLandingCurrentNotes /> -->
			<!-- <div class="divider"></div> -->
			<!-- <PublicLandingCategories /> -->
			<!-- <PublicLandingCurrentRecommendations /> -->
			<!-- <PublicLandingCurrentEvents /> -->
			<!-- <div class="divider"></div> -->
			<!-- <PublicLandingHelplinks /> -->
			<PublicLandingNews />
			<v-container style="padding: 0">
				<div style="border-top: 2px solid #f5f5f5"></div>
			</v-container>
			<PublicLandingCategoriesNew />
			<PublicLandingCta />
			<PublicLandingEvents />
			<v-container style="padding: 0">
				<div style="border-top: 2px solid #f5f5f5"></div>
			</v-container>
			<PublicLandingCulturalExchange />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/app';

const appStore = useAppStore();
</script>

<style lang="scss" scoped>
@import '@/assets/sass/base/breakpoints';
@import '@/assets/sass/main.sass';

.background {
	width: 100vw;
	height: 100vh;
	background: url('../assets/images/header.png') no-repeat center center;
	background-repeat: no-repeat;
	background-size: cover;
	background-position: right bottom;

	@include sm {
		background-position: center;
		background-size: cover;
		height: 90vh;
	}

	@include md {
		background-position: center;
		background-size: cover;
		background-position: right top;
		height: 70vh;
	}
}

.divider {
	margin: 5rem;

	@include md {
		margin: 1rem;
	}
}

.row {
	@include sm {
		max-width: 100%;
		margin: 0;
	}
}

.header-wrapper {
	@include sm {
		padding: 0;
	}
}
</style>
