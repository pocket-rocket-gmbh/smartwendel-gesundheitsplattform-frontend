<template>
  <v-container class="my-5">
    {{ sub_categoryContent }}
  </v-container>
  
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
    const route = useRoute()
    const api = useCollectionApi()


    const getItems = async () => {
      
      api.setBaseApi(usePublicApi())
      api.setEndpoint(`categories/${sub_categoryId.value}/sub_categories`)
      await api.retrieveCollection()
    }
    const sub_categoryContent = api.items

  

    const sub_categoryId = computed(() => {
      return route.params.id
    })


    onMounted(() => {
      getItems()

    })

      return {
        sub_categoryId,
        sub_categoryContent
    }
  },
})
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

</style>