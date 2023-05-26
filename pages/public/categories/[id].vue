<template>
  <div v-if="finishedLoading">
    <PublicCategoriesHeader :category="category" />
    <PublicCategoriesFilter :category="category"/>
    <PublicCategoriesContent :sub-sub-categories="subSubCategories" :sub-category="subCategory" />
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
  return category.value !== null && subSubCategories.value !== null && subCategory.value !== null
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
  getSubSubCategories()
})
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.title-bar
  background: linear-gradient(90deg, #91A80D 46.67%, #BAC323 84.36%, #9EA100 97.5%)
  height: 200px

.is-selected
  background: red


</style>