<template>
	<ul class="social-buttons">
		<li>
			<v-btn href="TODO" target="_blank" variant="outlined" icon class="social-button">
				<v-icon>mdi-facebook</v-icon>
			</v-btn>
		</li>
		<li>
			<v-btn href="TODO" target="_blank" variant="outlined" icon class="social-button">
				<v-icon>mdi-instagram</v-icon>
			</v-btn>
		</li>
		<li>
			<v-btn href="TODO" target="_blank" variant="outlined" icon class="social-button">
				<v-icon>mdi-youtube</v-icon>
			</v-btn>
		</li>
		<li>
			<v-btn href="TODO" target="_blank" variant="outlined" icon class="social-button">
				<v-icon>mdi-linkedin</v-icon>
			</v-btn>
		</li>
	</ul>
</template>

<style lang="scss" scoped>
@import '@/assets/sass/main.sass';

.social-buttons {
	list-style-type: none;
	margin: 0;
	display: flex;
	flex-direction: row;
	gap: 13px;

	@include md {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.social-button {
		width: 41px;
		height: 41px;
		border: 2px solid $primary-color;
		color: $primary-color !important;
	}
}
</style>
