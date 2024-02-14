<template>
	<div style="padding: 100px 0px">
		<v-container>
			<v-row>
				<v-col :cols="4">
					<div style="margin: -50px">
						<v-img :src="img"></v-img>
					</div>
				</v-col>
				<v-col :cols="8">
					<div
						style="display: flex; flex-direction: column; gap: 50px; width: 70%"
						class="is-dark-green-color"
					>
						<h2>Deine lokale Kulturbörse</h2>

						<p>
							Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
							invidunt
							<br />
							<br />
							At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no
							sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
							consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
							dolore magna aliquyam erat, sed diam voluptua.
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
