import { IconArrowRight } from '@tabler/icons-vue';
<template>
	<div class="is-dark-green-background is-white-color" style="padding: 80px 0px">
		<v-container style="padding-top: 0; padding-bottom: 0">
			<div class="wrapper">
				<div class="text">
					<h3>Deine Stimme zählt!</h3>
					<p>
						Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptas magni
						quasi enim, facilis beatae maiores, deserunt dolor non quo numquam voluptatem tempora!
						Porro reprehenderit illum odit consequatur, nesciunt voluptatem.
					</p>
				</div>
				<div class="items-wrapper">
					<!-- <div style="background-color: green; flex-grow: 1; display: flex">
						
					</div> -->
					<div class="items">
						<div style="flex: 1">
							<div class="is-primary-background" style="aspect-ratio: 1"></div>
						</div>
						<div style="flex: 1">
							<div class="is-primary-background" style="aspect-ratio: 1"></div>
						</div>
						<div style="flex: 1">
							<div class="is-primary-background" style="aspect-ratio: 1"></div>
						</div>
						<div style="flex: 1">
							<div class="is-primary-background" style="aspect-ratio: 1"></div>
						</div>
					</div>
					<v-btn icon color="primary">
						<IconArrowRight />
					</v-btn>
				</div>
			</div>
		</v-container>
	</div>
</template>

<script setup lang="ts">
import { IconArrowRight } from '@tabler/icons-vue';
</script>

<style lang="scss" scoped>
@import '@/assets/sass/main.sass';

.wrapper {
	display: flex;
	flex-direction: row;
	gap: 1.75rem;

	@include md {
		flex-direction: column;
	}

	.text {
		width: 30%;
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
		@include md {
			width: 100%;
		}
	}
	.items-wrapper {
		width: 70%;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1.75rem;
		@include md {
			width: 100%;
		}

		.items {
			flex: 1;
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 1.75rem;
		}
	}
}
</style>
