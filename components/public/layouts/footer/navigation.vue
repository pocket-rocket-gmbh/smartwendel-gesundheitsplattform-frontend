<template>
	<div class="navigation">
		<h5>Landkreis Wunsiedel i. Fichtelgebirge</h5>
		<nav>
			<ul>
				<li>
					<nuxt-link class="is-dark-grey" href="mailto:EMAIL?subject=Kontakt">Kontakt</nuxt-link>
				</li>
				<li>
					<nuxt-link class="is-dark-grey" to="/rules_of_conduct">Nutzungsbedingungen</nuxt-link>
				</li>
				<li>
					<nuxt-link class="is-dark-grey" to="/privacy_policy">Datenschutzerklärung</nuxt-link>
				</li>
				<li>
					<nuxt-link class="is-dark-grey" to="/imprint">Impressum</nuxt-link>
				</li>
			</ul>
		</nav>
	</div>
</template>

<script setup lang="ts">
//
</script>

<style lang="scss" scoped>
@import '@/assets/sass/main.sass';

.navigation {
	display: flex;
	flex-direction: column;

	@include md {
		align-items: center;
	}

	h5 {
		font-weight: 700;
		font-size: 1.5rem;
		@include md {
			font-size: 1rem;
		}
	}

	ul {
		list-style-type: none;
		margin: 1.75rem 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
		line-height: 1.6rem;

		@include md {
			align-items: center;
		}

		li > a {
			color: $secondary-color;
			font-weight: 300;
		}
	}
}
</style>
