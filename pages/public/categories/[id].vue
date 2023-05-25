<template>
  <div>
    <div class=" d-inline align-center justify-center">
      <div class="title-bar is-uppercase has-font-size-big d-flex align-center justify-center">
      <div>
        <h2 class="is-white">{{ category?.name }}</h2>
      </div>
    </div>
    </div>
    <div class="menu-bar d-flex is-uppercase align-center justify-center">
      <v-slide-group
        size="large"
        class="category-chips my-8"
        multiple
        column
      >
      <v-chip
          size="x-large"
          @click=""
        >      
        Alle
        </v-chip>
        <v-chip
          filter-icon="mdi-plus"
          v-for="item in category?.sub_categories"
          size="x-large"
          :key="item.id"
          item-title="name_with_projects_count"
          input-value="id"
          @click=""
          class="mx-1"
          prepend-icon="mdi-checkbox-multiple-blank"
        >      
          {{ item.name }}
        </v-chip>
      </v-slide-group>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({

  setup(props) {
    const route = useRoute()
    const category = ref([])
    const loading = ref(false)
    const selectedSubCategoryId = ref(null)

    const categoryId = computed(() => {
      return route.params.id
    })

    const getSubCategoryId = () => {
      route.query.sub_category_id = selectedSubCategoryId.value
    }

    const showApi = useCollectionApi()
    showApi.setBaseApi(usePublicApi())

    const getCategory = async () => {
      showApi.setEndpoint(`categories/${categoryId.value}`)

      loading.value = true
      await showApi.getItem()
      loading.value = false
      category.value = showApi.item.value
    }


    onMounted(() => {
      getCategory()
      getSubCategoryId()
    })

    return {
      category,
      getSubCategoryId,
      selectedSubCategoryId
    }
  }
})
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.title-bar
  background: linear-gradient(90deg, #91A80D 46.67%, #BAC323 84.36%, #9EA100 97.5%)
  height: 200px

.menu-bar
  background: $light-grey
  border-radius: 20px
  margin-top: -20px
  height: 60px
  width: 50%
  color: $dark-green
  left: 50%
  transform: translate(50%)

.is-selected
  background: red


</style>