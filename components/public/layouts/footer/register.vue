<template>
	<div class="register">
		<h6>Dein Angebot fehlt?</h6>
		<span>
			Du machst Kultur in unserem Landkreis?
			<br />
			Dann registriere dich jetzt!
		</span>
		<v-btn color="primary" rounded>Jetzt registrieren</v-btn>
	</div>
</template>

<style lang="scss" scoped>
@import '@/assets/sass/main.sass';

.register {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-end;
	gap: 28px;

	@include md {
		align-items: center;
	}

	h6 {
		font-weight: 400;
		font-size: 1.4rem;
		text-transform: uppercase;

		@include md {
			font-size: 1.125rem;
		}
	}

	span {
		text-align: right;
		@include md {
			text-align: center;
		}
	}
}
</style>
