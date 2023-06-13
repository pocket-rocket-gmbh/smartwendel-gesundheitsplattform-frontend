<template>
  <div class="choose-category" v-if="categories.length > 0">
    <div class="category-input is-dark-grey py-2">
      <div class="input-wrapper">
        <input
          type="text"
          v-model="searchTerm"
          class="input"
          @input="getFilteredData()"
          placeholder="Suchebegriff eingeben"
        />
        <v-icon>mdi-magnify</v-icon>
      </div>

      <ul v-if="searchTerm.length" class="list">
        <li
          v-for="category in filteredCategories"
          :key="category.id"
          @click.stop="setFilterAndMove(category?.id, category.sub_category?.id)"
        >
          <div class="choose-box py-2 px-4">
            <p class="category-headline">
              <span v-if="category.name">{{ category.name }}</span>
            </p>
            <div
              class="results-content-wrap"
              v-for="sub_category in category.sub_categories"
              :key="sub_category?.id"
              @click.stop="setFilterAndMove(category.id, sub_category.id)"
            >
              <p class="is-clickable pa-2 selectable" v-if="sub_category.name">{{ sub_category.name }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFilterStore } from "~/store/facilitySearchFilter";

const filterStore = useFilterStore();

const categoriesApi = useCollectionApi();
categoriesApi.setBaseApi(usePublicApi());
categoriesApi.setEndpoint(`categories`);
const categories = categoriesApi.items;
const router = useRouter();
const searchTerm = ref("");

const getCategories = async () => {
  const options = {
    page: 1,
    per_page: 25,
    sort_by: "menu_order",
    sort_order: "ASC",
    searchQuery: null as any,
    concat: false,
    filters: [] as any,
  };
  await categoriesApi.retrieveCollection(options);
};

const setFilterAndMove = (categoryId: string, subCategoryId: string) => {
  if (!subCategoryId) {
    filterStore.updateCategoriesFilter("category", categoryId);
  } else {
    filterStore.currentCategoryId = categoryId;
    filterStore.updateCategoriesFilter("subCategory", subCategoryId);
  }

  console.log(categoryId, subCategoryId);

  router.push({ path: "/public/search" });
};

const filteredCategories = computed(() => {
  const filtered = categories.value.filter((category) => {
    const categoryName = (category.name as string).toUpperCase();

    const nameMatch = categoryName.includes(searchTerm.value.toUpperCase());

    const subCategoryMatch = (category.sub_categories as any[]).some((subCategory) => {
      const subCategoryName = (subCategory.name as string).toUpperCase();
      return subCategoryName.includes(searchTerm.value.toUpperCase());
    });

    return nameMatch || subCategoryMatch;
  });

  console.log(filtered);
  return filtered;
});

const getFilteredData = async () => {
  await categoriesApi.retrieveCollection();
};

onMounted(() => {
  getCategories();
});
</script>

<style lang="sass" scoped>
.choose-category
  position: relative
  flex-direction: row

  .category-input
    border: 2px solid white
    background: white
    height: 50px
    border-radius: 50px
    cursor: pointer
    color: grey
    width: 70%
    font-weight: 700
    display: flex
    align-items: center

    .input-wrapper
      display: flex
      padding: 0 1rem
      align-items: center
      flex: 1

      .input
        flex: 1
        outline: none
        border: none

        &::placeholder
          opacity: 0.5

  .list
   list-style: none
   position: absolute
   top: 50px
   width: 60%

   .choose-box
    border-radius: 20px
    background: white
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
    color: #015281
    font-size: 18px

    .selectable
      cursor: pointer

      &:hover
        background: lightgrey

    .category-headline
      text-transform: uppercase
      font-weight: 700

.v-input__icon.v-input__icon--append-outer i
  font-size: 48px
</style>
