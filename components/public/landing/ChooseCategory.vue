<template>
  <div class="choose-category" v-if="categories.length > 0">
    <div class="category-input py-2 px-4 mt-4" @click="chooseBoxOpen = !chooseBoxOpen">Leistung auswählen</div>
    <transition>
      <div class="choose-box py-2 px-4" v-if="chooseBoxOpen">
        <div v-for="category in categories" :key="category.id">
          <div class="category-headline mb-1"><i>{{ category.name }}</i></div>
          <div class="ml-5" v-if="category.sub_categories.length > 0">
            <div class="pa-2 selectable" v-for="sub in category.sub_categories" :key="sub.id">{{ sub.name }}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  setup () {
    const chooseBoxOpen = ref(false)

    const categoriesApi = useCollectionApi()
    categoriesApi.setBaseApi(usePublicApi())
    categoriesApi.setEndpoint(`categories`)
    const categories = categoriesApi.items

    const getCategories = async () => {
      const options = { page: 1, per_page: 25, sort_by: 'menu_order', sort_order: 'ASC', searchQuery: null, concat: false, filters: [] }
      await categoriesApi.retrieveCollection(options)
    }

    onMounted(() => {
      getCategories()
    })

    return {
      chooseBoxOpen,
      categories
    }
  }
})
</script>

<style lang="sass" scoped>
.choose-category
  position: relative
  .category-input
    border: 2px solid #015281
    border-radius: 58px
    cursor: pointer
  .choose-box
    border-radius: 20px
    background: white
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
    color: #015281
    position: absolute
    top: 50px
    left: 0
    width: 100%
    z-index: 100
    font-size: 18px
    .selectable
      cursor: pointer
      &:hover
        background: lightgrey
  .category-headline
    text-transform: uppercase
    font-weight: 700
</style>