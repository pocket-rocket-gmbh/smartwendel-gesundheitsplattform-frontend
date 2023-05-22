<template>
  <div class=" d-inline align-center justify-center">
    <div class="title-bar is-uppercase has-font-size-big d-flex align-center justify-center">
    <div>
      <h2 class="is-white">{{ category?.name }}</h2>
    </div>
  </div>

  </div>
  <div class="menu-bar d-flex is-uppercase align-center justify-center" >
    <div v-for="(item, index) in category?.sub_categories" :key="index">
    <span class="px-5 is-clickable">{{ item.name }}</span>
      </div>
 </div>
 <div class="mt-10" v-for="(categories, index) in category?.sub_categories" :kex="index" >
  {{categories.name}}
 </div>

</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({

  setup(props) {
    const route = useRoute()
    const category = ref([])
    const loading = ref(false)


    const categoryId = computed(() => {
      return route.params.id
    })

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
    })

    return {
      category
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


</style>