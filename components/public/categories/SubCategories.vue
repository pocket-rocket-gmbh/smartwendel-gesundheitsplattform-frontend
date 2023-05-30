<template>
  <div class="mx-15 my-10" v-if="subSubCategories?.length > 0">
    <v-row class="sub-category" :id="subCategory?.id.replaceAll('-', '')" >
      <v-col class="d-flex is-dark-grey">
        <div>
          <h2 class="is-uppercase my-5">{{ subCategory?.name }}</h2>
          <span class="my-5" v-html="subCategory?.description"></span>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <PublicContentBox
      v-for="subSubCategory in subSubCategories" :key="subSubCategory.id"
      :item="subSubCategory"
    />
    
    </v-row>
    
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const props = defineProps({
  subCategory: {
    required: true
  },
  categoryId: {
    required: true
  }
})

const subCategoryId = computed(() => {
  return route.query.sub_category_id as any
})

const selectedId = ref(subCategoryId.value)

const goToSubCategory= () => {
  const id = selectedId.value;
  if (id) {
    const el = document.getElementById(id.replaceAll('-', ''));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block:'center'  });
    }
  }
}

onMounted(() => {
  getSubSubCategories()
  useNuxtApp().$bus.$on('setSubCategory', (id:String) => {
    selectedId.value = id
    goToSubCategory()
  })
  goToSubCategory()
})

const loading = ref(false)
const subSubCategories = ref(null)
const listApi = useCollectionApi()
listApi.setBaseApi(usePublicApi())

const getSubSubCategories = async () => {
  listApi.setEndpoint(`categories/${props.categoryId}/sub_categories/${props.subCategory.id}/sub_sub_categories`)
  const options = { page: 1, per_page: 25, sort_by: 'menu_order', sort_order: 'ASC', searchQuery: null as any, concat: false, filters: [] as any }
  loading.value = true
  await listApi.retrieveCollection(options)
  loading.value = false
  subSubCategories.value = listApi.items.value as any
}

</script>
<style lang="sass" scoped>
.sub-category
  scroll-margin: -200px
</style>