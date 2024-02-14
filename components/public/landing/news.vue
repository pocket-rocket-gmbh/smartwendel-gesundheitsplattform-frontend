<template>
	<div style="padding: 100px 0px">
		<v-container>
			<v-row>
				<v-col
					:cols="12"
					style="display: flex; justify-content: space-between; align-items: center"
				>
					<h2>Neuigkeiten</h2>
					<v-btn color="primary" rounded>Mehr Anzeigen</v-btn>
				</v-col>
				<v-col v-for="article of newsArticles" :key="article.id" :cols="4">
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
				</v-col>

				<!-- <v-col :cols="12">
					<v-btn color="primary" rounded>Mehr Anzeigen</v-btn>
				</v-col> -->
			</v-row>
		</v-container>
	</div>
</template>

<script setup lang="ts">
import { IconTag, IconCalendar, IconArrowRight } from '@tabler/icons-vue';

const newsArticles = ref<any[]>([]);

const getNews = async () => {
	const api = useCollectionApi();
	api.setBaseApi(usePublicApi());
	api.setEndpoint(`care_facilities?kind=news`);

	await api.retrieveCollection({
		page: 1,
		per_page: 3,
		sort_by: 'created_at',
		sort_order: 'DESC',
		searchQuery: null as any,
		concat: false,
		filters: [] as any,
	});
	newsArticles.value = api.items.value;
};

onMounted(() => {
	getNews();
});
</script>
