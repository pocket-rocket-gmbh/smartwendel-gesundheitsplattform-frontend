<template>
  <div class="sub-categories-wrapper">
    <v-row class="sub-category text-center align-center justify-center" :id="subCategory?.id.replaceAll('-', '')">
      <v-col cols="12" md="10" class="d-flex is-dark-grey justify-center">
        <div>
          <h2 class="is-uppercase mt-5">{{ subCategory?.name }}</h2>
          <span class="my-5" v-html="subCategory?.description"></span>
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
  const el = document.getElementById(id.replaceAll("-", ""));

  if (!el) return;

  const scrollToTargetAdjusted = (element: HTMLElement) => {
    const headerOffset = 225;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  scrollToTargetAdjusted(el);
};

onMounted(() => {
  getSubSubCategories();

  useNuxtApp().$bus.$on("setSubCategory", (id: String) => {
    selectedId.value = id;
    goToSubCategory();
  });
});

const loading = ref(false);
const subSubCategories = ref(null);
const listApi = useCollectionApi();
listApi.setBaseApi(usePublicApi());

const getSubSubCategories = async () => {
  listApi.setEndpoint(`categories/${props.categoryId}/sub_categories/${props.subCategory.id}/sub_sub_categories`);
  const options = {
    page: 1,
    per_page: 25,
    sort_by: "menu_order",
    sort_order: "ASC",
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
    useNuxtApp().$bus.$emit("updateSubCategoriesFromUrl", subCategoryId.value);
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

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
</style>
