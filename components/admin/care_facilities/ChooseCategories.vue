<template>
  <div>
    <div v-if="choosenSubSubCategory">
      <div @click="choosenSubSubCategory = null" class="is-clickable mb-3"><v-icon>mdi-arrow-left</v-icon></div>
      <h3>Unter-Kategorie {{ choosenSubSubCategory.name }}</h3>
      <h3>Kategorie {{ choosenSubCategory.name }}</h3>
      <p class="my-3">Tags</p>

      <div v-if="choosenSubSubCategory.tags > 0">
        <div class="item" v-for="(tag, index) in choosenSubSubCategory.tags" :key="index">
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
      <div v-else>
        <i>Keine Tags verfügbar</i>
      </div>
    </div>
    <div v-else-if="choosenSubCategory && !choosenSubSubCategory">
      <div @click="choosenSubCategory = null" class="is-clickable mb-3"><v-icon>mdi-arrow-left</v-icon></div>
      <h3>Bereich {{ choosenCategory.name }}</h3>
      <h3>Kategorie {{ choosenSubCategory.name }}</h3>
      <p class="my-3">Unter-Kategorie</p>
      <div v-if="choosenSubCategory.sub_sub_categories.length > 0">
        <div class="item" v-for="subSubCategory in choosenSubCategory.sub_sub_categories" :key="subSubCategory.id">
          <div>
            <v-icon class="is-clickable" @click="toggleChoosenSubSubCategoryIds(subSubCategory.id)" v-if="choosenSubSubCategoryIds.includes(subSubCategory.id)">
              mdi-checkbox-marked-circle-outline
            </v-icon>
            <v-icon class="is-clickable" @click="toggleChoosenSubSubCategoryIds(subSubCategory.id)" v-else>
              mdi-checkbox-blank-circle-outline
            </v-icon>
          </div>
          <div>{{ subSubCategory.name }}</div>
          <div><v-icon v-if="choosenSubSubCategoryIds.includes(subSubCategory.id)" @click="choosenSubSubCategory = subSubCategory">mdi-arrow-right</v-icon></div>
        </div>
      </div>
      <div v-else>
        <i>Keine Unter-Kategorien verfügbar</i>
      </div>
    </div>
    <div v-else-if="!choosenSubCategory && choosenCategory">
      <div @click="choosenSubCategory = null; choosenCategory = null;" class="is-clickable mb-3"><v-icon>mdi-arrow-left</v-icon></div>
      <h3>Bereich {{ choosenCategory.name }}</h3>
      <p class="my-3">Kategorien</p>

      <div v-if="choosenCategory.sub_categories.length > 0">
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
      <div v-else>
        <i>Keine Kategorien verfügbar</i>
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
  emit: ['setCategoryIds', 'setSubCategoryIds', 'setSubSubCategoryIds', 'setTags'],
  props: {
    preSetCategoryIds: {
      type: Array
    },
    preSetSubCategoryIds: {
      type: Array
    },
    preSetSubSubCategoryIds: {
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
    const choosenSubSubCategory = ref(null)

    const choosenCategoryIds = ref([])
    const choosenSubCategoryIds = ref([])
    const choosenSubSubCategoryIds = ref([])
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

    const toggleChoosenSubSubCategoryIds = async (subSubCategoryId:string) => {
      const foundSubSubCategory = choosenSubSubCategoryIds.value.find((cat:any) => cat === subSubCategoryId)
      if (foundSubSubCategory) {
        choosenSubSubCategoryIds.value = choosenSubSubCategoryIds.value.filter((cat:any) => cat !== subSubCategoryId)
      } else {
        choosenSubSubCategoryIds.value.push(subSubCategoryId)
      }

      emit('setSubSubCategoryIds', choosenSubSubCategoryIds)
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
      getCategories()
    })

    watch(() => props.preSetCategoryIds, (first) => {
      choosenCategoryIds.value = first
    })
    watch(() => props.preSetSubCategoryIds, (first) => {
      choosenSubCategoryIds.value = first
    })
    watch(() => props.preSetSubSubCategoryIds, (first) => {
      choosenSubSubCategoryIds.value = first
    })
    watch(() => props.preSetTags, (first) => {
      choosenTags.value = first
    })

    return {
      categories,
      choosenCategory,
      choosenSubCategory,
      choosenSubSubCategory,
      toggleChoosenCategoryIds,
      toggleChoosenSubCategoryIds,
      toggleChoosenSubSubCategoryIds,
      choosenCategoryIds,
      choosenSubCategoryIds,
      choosenSubSubCategoryIds,
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