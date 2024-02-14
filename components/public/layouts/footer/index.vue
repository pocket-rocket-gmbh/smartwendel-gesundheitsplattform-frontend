<template>
	<footer>
		<v-container>
			<v-row>
				<v-col :cols="12" class="logo top-logo">
					<nuxt-link to="/">
						<img src="~/assets/images/logo.png" alt="logo" />
					</nuxt-link>
				</v-col>
			</v-row>
			<v-row>
				<v-col :cols="12" :md="6" :lg="4" class="main">
					<PublicLayoutsFooterNavigation />
					<PublicLayoutsFooterSocialButtons />
				</v-col>
				<v-col :cols="12" :lg="4" class="logo center-logo">
					<nuxt-link to="/">
						<img src="~/assets/images/logo.png" alt="logo" />
					</nuxt-link>
				</v-col>
				<v-col :cols="12" :md="6" :lg="4" class="register">
					<PublicLayoutsFooterRegister />
				</v-col>
			</v-row>
		</v-container>
	</footer>
</template>

<style lang="scss" scoped>
@import '@/assets/sass/main.sass';

footer {
	background-color: #f5f5f5;
	color: $secondary-color;
	padding: 46px 80px;
	font-size: 1rem;
	@include md {
		font-size: 0.875rem;
	}

	.main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: left;
		font-size: 1rem !important;
		@include md {
			font-size: 0.875rem;
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

	.top-logo {
		display: none;
		@include lg {
			text-align: center;
			display: block;
		}
	}

	.center-logo {
		@include lg {
			display: none;
		}
	}
}
</style>
