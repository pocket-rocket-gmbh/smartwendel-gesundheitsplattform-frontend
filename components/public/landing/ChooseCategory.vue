<template>
  <div class="choose-category" v-if="categories.length > 0">
    <div>
      <div class="category-input is-dark-grey py-2 d-flex align-center">
          <v-text-field
            @click="chooseBoxOpen = !chooseBoxOpen"
            variant="plain"
            autocomplete="off"
            v-model="searchTerm"
            placeholder="Suchebegriff eingeben"
            class="px-5 py-3 font-weight-bold"
            @input="getFilteredData()"
          >
          <template v-slot:append-inner>
            <v-icon class="pt-3">mdi-magnify</v-icon>
          </template>
          </v-text-field>
        <ul
          v-if="searchTerm?.length"
          class=""
        >
          <li
            v-for="category in categories"
            :key="category.id"
            @click="setFilterAndMove(category?.id, category.sub_category?.id)"
            class=""
          >
            <div class="choose-box py-2 px-4">
              <div class="results-content-wrap" v-for="sub_category in category.sub_categories" :key="sub_category?.id" @click="setFilterAndMove(category.id, sub_category.id)">
                <p class="category-headline"><span v-if="category.name">{{ category.name }}</span></p>
                <p class="is-clickable pa-2 selectable" v-if="sub_category.name">{{ sub_category.name }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useFilterStore } from '@/store/filter'
export default defineComponent({
  setup () {
    const chooseBoxOpen = ref(false)

    const categoriesApi = useCollectionApi()
    categoriesApi.setBaseApi(usePublicApi())
    categoriesApi.setEndpoint(`categories`)
    const categories = categoriesApi.items
    const router = useRouter()
    const searchTerm = ref('')

    const getCategories = async () => {
      const options = { page: 1, per_page: 25, sort_by: 'menu_order', sort_order: 'ASC', searchQuery: null, concat: false, filters: [] }
      await categoriesApi.retrieveCollection(options)
    }

    const setFilterAndMove = (categoryId:string, subCategoryId: string) => {
      useFilterStore().$patch({
        'currentCategoryId': categoryId,
        'currentSubCategoryId': subCategoryId
      })

      router.push({ path: '/public/search'})
    }

    const getFilteredData = async () => {
      await categoriesApi.retrieveCollection()
    }

    onMounted(() => {
      getCategories()
    })

    return {
      chooseBoxOpen,
      categories,
      setFilterAndMove,
      searchTerm,
      getFilteredData
    }
  }
})
</script>

<style lang="sass" scoped>
.choose-category
  position: relative
  .category-input
    border: 2px solid white
    background: white
    height: 50px
    border-radius: 50px
    cursor: pointer
    color: grey
    width: 70%
    font-weight: 700
  .choose-box
    border-radius: 20px
    background: white
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
    color: #015281
    position: absolute
    top: 50px
    left: 0
    width: 60%
    z-index: 100
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