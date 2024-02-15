<template>
	<div style="padding: 100px 0px">
		<v-container>
			<v-row>
				<v-col :cols="4" class="d-none d-md-block">
					<div style="margin: -50px">
						<v-img :src="img"></v-img>
					</div>
				</v-col>
				<v-col :cols="12" :md="8">
					<div class="wrapper">
						<h2>Deine lokale Kulturbörse</h2>

						<p>
							Willkommen auf unserer lokalen Kulturbörse, dem Herzstück für kulturellen Austausch
							und Inspiration in unserer Gemeinde. Hier findest du ein reichhaltiges Angebot an
							kulturellen Veranstaltungen, Workshops, Ausstellungen und vielem mehr, die alle
							Facetten unseres vielfältigen kulturellen Erbes zum Leben erwecken. Tauche ein in die
							lebendige Welt der Kunst, Musik, Theater und Literatur, und entdecke neue Horizonte
							und Perspektiven. Unsere Kulturbörse verbindet Künstler, Kreative und
							Kulturbegeisterte, um gemeinsam eine lebendige und dynamische kulturelle Landschaft zu
							gestalten. Mache mit, teile deine Leidenschaften und erlebe die Fülle kultureller
							Schätze, die unsere Gemeinschaft zu bieten hat.
						</p>

						<div>
							<v-btn variant="elevated" color="primary" rounded>Angebote finden</v-btn>
						</div>
					</div>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script setup lang="ts">
import img from '@/assets/images/cultural-exchange.png';
</script>

<style lang="scss">
@import '@/assets/sass/main.sass';

.wrapper {
	display: flex;
	flex-direction: column;
	gap: 50px;
	width: 70%;
	color: $dark-green;

	@include md {
		width: 100%;
		align-items: center;
		text-align: center;
	}
}
</style>
