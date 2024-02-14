<template>
	<footer>
		<v-row>
			<v-col :cols="12" :md="4" class="main">
				<h5>Landkreis Wunsiedel i. Fichtelgebirge</h5>
				<nav>
					<ul>
						<li>
							<nuxt-link class="is-dark-grey" href="mailto:EMAIL?subject=Kontakt">
								Kontakt
							</nuxt-link>
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
			</v-col>
			<v-col :cols="12" :md="4" class="logo">
				<img src="~/assets/images/logo.png" alt="logo" class="is-clickable" />
			</v-col>
			<v-col :cols="12" :md="4" class="register">
				<h6>Dein Angebot fehlt?</h6>
				<span>
					Du machst Kultur in unserem Landkreis?
					<br />
					Dann registriere dich jetzt!
				</span>
				<v-btn color="primary" rounded>Jetzt registrieren</v-btn>
			</v-col>
		</v-row>
	</footer>
</template>

<script setup lang="ts">
const route = useRoute();
import { useBreakpoints } from '~/composables/ui/breakPoints';

const breakPoints = useBreakpoints();

const currentRoute = computed(() => {
	return route.path as string;
});
</script>

<style lang="scss" scoped>
@import '@/assets/sass/main.sass';

footer {
	background-color: #c4c4c4;
	color: $secondary-color;
	padding: 46px 80px;

	h5 {
		font-size: 1.5rem;
		font-weight: 700;
	}
	h6 {
		font-size: 1.4rem;
		font-weight: 400;
	}

	.main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: left;
		gap: 28px;
		font-size: 1rem !important;

		ul {
			list-style-type: none;
			margin: 0;
			display: flex;
			flex-direction: column;
			gap: 10px;
			line-height: 1.6rem;

			li > a {
				color: $secondary-color;
				font-weight: 300;
			}
		}

		ul.social-buttons {
			display: flex;
			flex-direction: row;
			gap: 13px;
		}
	}
	.logo {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		img {
			max-height: 102px;
		}
	}
	.register {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-end;
		gap: 28px;
		@include md {
			background-color: red;
		}

		span {
			text-align: right;
		}
	}

	.social-button {
		width: 41px;
		height: 41px;
		border: 2px solid $dark-green;
		color: $dark-green !important;
	}
}
</style>
