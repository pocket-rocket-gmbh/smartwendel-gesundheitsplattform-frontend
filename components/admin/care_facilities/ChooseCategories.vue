<template>
  <div>
    <div v-if="choosenSubCategory">
      <div @click="choosenSubCategory = null" class="is-clickable mb-3"><v-icon>mdi-arrow-left</v-icon></div>
      <h3>Bereich {{ choosenCategory.name }}</h3>
      <h3>Kategorie {{ choosenSubCategory.name }}</h3>
      <p class="my-3">Kategorien</p>

      <div class="item" v-for="(tag, index) in choosenSubCategory.tags" :key="index">
        <div>
          <v-icon class="is-clickable" @click="toggleChoosenTags(tag)" v-if="choosenTags.includes(tag)">
            mdi-checkbox-marked-circle-outline
          </v-icon>
          <v-icon class="is-clickable" @click="toggleChoosenTags(tag)" v-else>
            mdi-checkbox-blank-circle-outline
          </v-icon>
        </div>
        <div>{{ tag }}</div>
        <div></div>
      </div>
    </div>
    <div v-else-if="!choosenSubCategory && choosenCategory">
      <div @click="choosenSubCategory = null; choosenCategory = null;" class="is-clickable mb-3"><v-icon>mdi-arrow-left</v-icon></div>
      <h3>Unter-Kategorie {{ choosenCategory.name }}</h3>
      <p class="my-3">Unter-Kategorien</p>

      <div class="item" v-for="subCategory in choosenCategory.sub_categories" :key="subCategory.id">
        <div>
          <v-icon class="is-clickable" @click="toggleChoosenSubCategoryIds(subCategory.id)" v-if="choosenSubCategoryIds.includes(subCategory.id)">
            mdi-checkbox-marked-circle-outline
          </v-icon>
          <v-icon class="is-clickable" @click="toggleChoosenSubCategoryIds(subCategory.id)" v-else>
            mdi-checkbox-blank-circle-outline
          </v-icon>
        </div>
        <div>{{ subCategory.name }}</div>
        <div><v-icon v-if="choosenSubCategoryIds.includes(subCategory.id)" @click="choosenSubCategory = subCategory">mdi-arrow-right</v-icon></div>
      </div>
    </div>
    <div v-else-if="!choosenSubCategory && !choosenCategory">
      <p class="my-3">Bereich</p>

      <div class="item" v-for="category in categories" :key="category.id">
        <div>
          <v-icon class="is-clickable" @click="toggleChoosenCategoryIds(category.id)" v-if="choosenCategoryIds.includes(category.id)">
            mdi-checkbox-marked-circle-outline
          </v-icon>
          <v-icon class="is-clickable" @click="toggleChoosenCategoryIds(category.id)" v-else>
            mdi-checkbox-blank-circle-outline
          </v-icon>
        </div>
        <div>{{ category.name }}</div>
        <div><v-icon v-if="choosenCategoryIds.includes(category.id)" @click="choosenCategory = category">mdi-arrow-right</v-icon></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  emit: ['setCategoryIds', 'setSubCategoryIds', 'setTags'],
  props: {
    preSetCategoryIds: {
      type: Array
    },
    preSetSubCategoryIds: {
      type: Array
    },
    preSetTags: {
      type: Array
    }
  },
  setup(props, { emit }) {
    const categories = ref([])

    const choosenCategory = ref(null)
    const choosenSubCategory = ref(null)

    const choosenCategoryIds = ref([])
    const choosenSubCategoryIds = ref([])
    const choosenTags = ref([])

    const categoriesApi = useCollectionApi()
    categoriesApi.setBaseApi(usePrivateApi())
    categoriesApi.setEndpoint(`categories`)

    const getCategories = async () => {
      await categoriesApi.retrieveCollection()
      categories.value = categoriesApi.items.value
    }

    const toggleChoosenCategoryIds = async (categoryId:string) => {
      const foundCategory = choosenCategoryIds.value.find((cat:any) => cat === categoryId)
      if (foundCategory) {
        choosenCategoryIds.value = choosenCategoryIds.value.filter((cat:any) => cat !== categoryId)
      } else {
        choosenCategoryIds.value.push(categoryId)
      }

      emit('setCategoryIds', choosenCategoryIds)
    }

    const toggleChoosenSubCategoryIds = async (subCategoryId:string) => {
      const foundSubCategory = choosenSubCategoryIds.value.find((cat:any) => cat === subCategoryId)
      if (foundSubCategory) {
        choosenSubCategoryIds.value = choosenSubCategoryIds.value.filter((cat:any) => cat !== subCategoryId)
      } else {
        choosenSubCategoryIds.value.push(subCategoryId)
      }

      emit('setSubCategoryIds', choosenSubCategoryIds)
    }

    const toggleChoosenTags = async (tag:string) => {
      const foundTag = choosenTags.value.find((t:any) => t === tag)
      if (foundTag) {
        choosenTags.value = choosenTags.value.filter((t:any) => t !== tag)
      } else {
        choosenTags.value.push(tag)
      }

      emit('setTags', choosenTags)
    }

    onMounted(() => {

      if (props.preSetCategoryIds) {
        choosenCategoryIds.value = props.preSetCategoryIds
      }
      if (props.preSetSubCategoryIds) {
        choosenSubCategoryIds.value = props.preSetSubCategoryIds
      }
      if (props.preSetTags) {
        choosenTags.value = props.preSetTags
      }

      getCategories()
    })

    return {
      categories,
      choosenCategory,
      choosenSubCategory,
      toggleChoosenCategoryIds,
      toggleChoosenSubCategoryIds,
      choosenCategoryIds,
      choosenSubCategoryIds,
      toggleChoosenTags,
      choosenTags
    }
  },
})
</script>

<style lang="sass" scoped>
.item
  padding: 10px
  border-bottom: 1px solid grey
  display: grid
  grid-template-columns: 30px auto 20px
</style>