<template>
	<div style="padding: 100px 0px">
		<v-container>
			<v-row>
				<v-col
					:cols="12"
					style="display: flex; justify-content: space-between; align-items: center"
				>
					<h2 class="is-dark-green-color">Veranstaltungen</h2>
					<v-btn color="primary" rounded>Mehr Anzeigen</v-btn>
				</v-col>
				<v-col v-for="event of events" :key="event.id" :cols="4">
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

				<!-- <v-col :cols="12">
					<v-btn color="primary" rounded>Mehr Anzeigen</v-btn>
				</v-col> -->
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
