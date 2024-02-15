<template>
	<div style="padding: 100px 0px">
		<v-container>
			<v-row>
				<v-col :cols="12" class="header">
					<h2 class="is-dark-green-color">Neuigkeiten</h2>
					<v-btn color="primary" rounded class="d-none d-md-block">Mehr Anzeigen</v-btn>
				</v-col>

				<v-col
					v-for="article of newsArticles"
					:key="article.id"
					:cols="4"
					class="d-none d-md-block"
				>
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
				<v-col :cols="12" class="d-md-none">
					<v-carousel height="auto" hideDelimiterBackground :showArrows="false" v-if="newsArticles">
						<v-carousel-item v-for="article of newsArticles" :key="article.id">
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
