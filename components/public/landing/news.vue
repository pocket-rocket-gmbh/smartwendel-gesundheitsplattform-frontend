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

				<v-col v-for="article of newsArticles" :cols="4">
					<v-card style="border-radius: 20px">
						<v-img :src="article.image_url" />
						<div style="background-color: #f4f5f7; color: #565657; padding: 12px">
							<div style="display: flex; flex-direction: row; justify-content: space-between">
								<div style="display: flex; flex-direction: row; align-items: center; gap: 3px">
									<IconTag :size="18" class="is-primary-color" />
									<span style="font-size: 10px">
										{{
											article.tags
												.map((x: any) => x.name)
												.splice(0, 3)
												.join(', ')
										}}
									</span>
								</div>
								<div style="display: flex; flex-direction: row; align-items: center; gap: 3px">
									<IconCalendar :size="18" class="is-primary-color" />
									<span style="font-size: 10px">
										{{ new Date(article.created_at).toLocaleDateString() }}
									</span>
								</div>
							</div>
							<div style="padding-top: 6px">
								<hr style="border: none; border-top: 1px solid #c5c5c5" />
							</div>
							<div style="display: flex; flex-direction: column; gap: 20px; padding: 14px 0px">
								<h3 class="is-primary-color" style="font-weight: 400; font-size: 1.1875rem">
									{{ article.name }}
								</h3>
								<div v-html="article.excerpt" style="font-size: 1rem; font-weight: 300"></div>
								<div>
									<v-btn size="small" rounded variant="outlined">
										Zum Beitrag
										<IconArrowRight :size="18" />
									</v-btn>
								</div>
							</div>
						</div>
					</v-card>
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
