<template>
	<div style="padding: 100px 0px">
		<v-container>
			<v-row>
				<v-col :cols="12" class="header">
					<h2 class="is-dark-green-color">Veranstaltungen</h2>
					<v-btn color="primary" rounded class="d-none d-md-block">Mehr Anzeigen</v-btn>
				</v-col>

				<v-col v-for="event of events" :key="event.id" :cols="4" class="d-none d-md-block">
					<PublicContentCard
						:title="event.name"
						:imageUrl="event.image_url"
						:tags="event.tags
                      .map((x: any) => x.name)"
						:date="new Date(event.created_at)"
					>
						<template #content>
							<p v-html="event.excerpt"></p>
						</template>
					</PublicContentCard>
				</v-col>
				<v-col :cols="12" class="d-md-none">
					<v-carousel height="auto" hideDelimiterBackground :showArrows="false" v-if="events">
						<v-carousel-item v-for="article of events" :key="article.id">
							<div style="padding-bottom: 50px">
								<PublicContentCard
									:title="article.name"
									:imageUrl="article.image_url"
									:tags="article.tags
                      .map((x: any) => x.name)"
									:date="new Date(article.created_at)"
								>
									<template #content>
										<p v-html="article.excerpt"></p>
									</template>
								</PublicContentCard>
							</div>
						</v-carousel-item>
					</v-carousel>
				</v-col>

				<v-col :cols="12" style="display: flex; justify-content: center" class="d-md-none">
					<v-btn color="primary" rounded>Mehr Anzeigen</v-btn>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script setup lang="ts">
const events = ref<any[]>([]);

const getEvents = async () => {
	const api = useCollectionApi();
	api.setBaseApi(usePublicApi());
	api.setEndpoint(`care_facilities?kind=event,course`);

	await api.retrieveCollection({
		page: 1,
		per_page: 3,
		sort_by: 'menu_order',
		sort_order: 'ASC',
		searchQuery: null as any,
		concat: false,
		filters: [] as any,
	});
	events.value = api.items.value;
};

onMounted(() => {
	getEvents();
});
</script>

<style lang="scss" scoped>
@import '@/assets/sass/main.sass';

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	@include md {
		justify-content: center;
	}
}
</style>
