<template>
  <div v-if="finishedLoading">
    <div class="">
      <PublicLayoutsHeader :category="category" :sub-categories="subCategories" />
    </div>
    <div>
      <PublicCategoriesFilter :sub-categories="subCategories"/>
    </div>
    <div class="content">
      <PublicCategoriesContent
      :sub-categories="subCategories"
      :category-id="category.id"
    />
    </div>
  </div>

</template>
<script lang="ts" setup>
const route = useRoute()
const loading = ref(false)

const categoryId = computed(() => {
  return route.params.id as string
})

const subCategoryId = computed(() => {
  return route.query.sub_category_id as string
})

const finishedLoading = computed (() => {
  return category.value !== null
})

const category = ref(null)
const showApi = useCollectionApi()
showApi.setBaseApi(usePublicApi())

const getCategory = async () => {
  showApi.setEndpoint(`categories/${categoryId.value}`)
  loading.value = true
  await showApi.getItem()
  loading.value = false
  category.value = showApi.item.value as any
}

const subCategory = ref(null)
const listSubCategoryApi = useCollectionApi()
listSubCategoryApi.setBaseApi(usePublicApi())

const getSubCategory = async () => {
  listSubCategoryApi.setEndpoint(`categories/${subCategoryId.value}`)
  loading.value = true
  await listSubCategoryApi.getItem()
  loading.value = false
  subCategory.value = listSubCategoryApi.item.value as any
}

const subCategories = ref(null)
const listSubCategoriesApi = useCollectionApi()
listSubCategoriesApi.setBaseApi(usePublicApi())

const getSubCategories = async () => {
  listSubCategoriesApi.setEndpoint(`categories/${categoryId.value}/sub_categories`)
  const options = { page: 1, per_page: 25, sort_by: 'menu_order', sort_order: 'ASC', searchQuery: null as any, concat: false, filters: [] as any }
  loading.value = true
  await listSubCategoriesApi.retrieveCollection(options)
  loading.value = false
  subCategories.value = listSubCategoriesApi.items.value as any
}

const subSubCategories = ref(null)
const listApi = useCollectionApi()
listApi.setBaseApi(usePublicApi())

const getSubSubCategories = async () => {
  listApi.setEndpoint(`categories/${categoryId.value}/sub_categories/${subCategoryId.value}/sub_sub_categories`)
  loading.value = true
  await listApi.retrieveCollection()
  loading.value = false
  subSubCategories.value = listApi.items.value as any
}

onMounted(() => {
  getCategory()
  getSubCategory()
  getSubCategories()
  getSubSubCategories()
})
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

</style>