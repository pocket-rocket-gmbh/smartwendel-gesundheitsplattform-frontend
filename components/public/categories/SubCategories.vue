<template>
  <div class="sub-categories-wrapper general-font-size" >
    <v-row
      class="sub-category text-center align-center justify-center"
      :id="subCategory?.id.replaceAll('-', '')"
    >
      <v-col class="d-flex flex-column is-dark-grey justify-center">
        <div :class="[breakPoints.width.value < 960 ? 'mt-4' : '', breakPoints.width.value < 515 ? 'mt-15' : 'mt-5']">
          <span class="sub-category-name mt-5">{{ subCategory?.name }}</span>
        </div>
        <div>
          <span
            class="my-5 text-wrap sub-category-description general-font-size"
            v-html="subCategory?.description"
          ></span>
        </div>
      </v-col>
    </v-row>
    <div class="articles mt-15">
      <PublicContentBox
        v-for="subSubCategory in subSubCategories"
        :key="subSubCategory.id"
        :item="subSubCategory"
        :item-type="subSubCategory.kind"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBreakpoints } from '~/composables/ui/breakPoints';

const breakPoints = useBreakpoints();
const route = useRoute();
const props = defineProps<{
	subCategory: any;
	categoryId: string;
}>();

const subCategoryId = computed(() => {
	return route.query.sub_category_id as any;
});

const selectedId = ref(subCategoryId.value);

const goToSubCategory = () => {
	const id = selectedId.value;

	if (!id) return;
	const el = document.getElementById(id.replaceAll('-', ''));

	if (!el) return;

	const scrollToTargetAdjusted = (element: HTMLElement) => {
		const headerOffset = 225;
		const elementPosition = element.getBoundingClientRect().top;
		const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth',
		});
	};

	scrollToTargetAdjusted(el);
};

onMounted(() => {
	getSubSubCategories();

	useNuxtApp().$bus.$on('setSubCategory', (id: String) => {
		selectedId.value = id;
		goToSubCategory();
	});
});

const loading = ref(false);
const subSubCategories = ref(null);
const listApi = useCollectionApi();
listApi.setBaseApi(usePublicApi());

const getSubSubCategories = async () => {
	listApi.setEndpoint(
		`categories/${props.categoryId}/sub_categories/${props.subCategory.id}/sub_sub_categories`
	);
	const options = {
		page: 1,
		per_page: 999,
		sort_by: 'menu_order',
		sort_order: 'ASC',
		searchQuery: null as any,
		concat: false,
		filters: [] as any,
	};
	loading.value = true;
	await listApi.retrieveCollection(options);
	loading.value = false;
	subSubCategories.value = listApi.items.value as any;

	requestAnimationFrame(goToSubCategory);

	if (subCategoryId.value) {
		useNuxtApp().$bus.$emit('updateSubCategoriesFromUrl', subCategoryId.value);
	}
};
</script>
<style lang="scss">
@import '@/assets/sass/main.sass';

.sub-categories-wrapper {
	margin: 5rem 5rem 2rem 5rem;

	@include md {
		margin: 1rem;
		margin-top: 3rem;
	}

	.sub-category {
		scroll-margin: -200px;
	}

	.articles {
		display: grid;
		grid-gap: 2rem;
		grid-template-columns: 1fr 1fr;

		@include md {
			display: flex;
			flex-direction: column;
			gap: 2rem;
		}
	}
}

.sub-category-name {
	font-size: 26px;
	font-weight: 500;
}

.sub-category-description {
	line-height: 29px;
	a {
		font-weight: 500 !important;
		text-decoration: underline !important;
		&:visited {
			font-weight: 500 !important;
			text-decoration: underline !important;
		}
	}
}

a {
	color: $secondary-color !important;
}
</style>
