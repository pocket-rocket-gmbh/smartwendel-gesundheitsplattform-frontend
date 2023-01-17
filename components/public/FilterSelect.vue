<template>
  <div :class="['field select', color]">
    <label class="label" v-if="label">{{ label }}</label>
    <select @change="setSelectValue" v-model="selected" :disabled="disabled">
      <option value="">Bitte wählen</option>
      <option v-for="item in filteredItems" :key="item.id" :value="item.id">{{ item.name }}</option>
    </select>
  </div>
</template>

<script lang="ts">
import { useFilterStore } from '@/store/filter'
export default defineComponent({
  props: {
    label: {
      type: String,
      required: false
    },
    endpoint: {
      type: String,
      required: true
    },
    preSelectedValue: {
      type: String,
      required: false
    },
    filterName: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const loading = ref(false)
    const selected = ref('')
    const items = ref([])

    const filteredItems = computed(() => {
      if (props.filterName === 'subCategoryTags') {
        const foundItem = items.value.filter((item:any) => item.id === useFilterStore().currentSubCategoryId)[0]
        if (foundItem) {
          return foundItem.tags.map((item:any) => { return { id: useUuidGenerator().getUuidV4(), name: item }})
        }
      }
      return items.value
    })

    const setSelectValue = (e:any) => {
      if (props.filterName === 'category') {
        useFilterStore().$patch({
          'currentCategoryId': e.target.value,
          'currentSubCategoryId': null,
          'currentSubCategoryTag': null
        })
      }
      if (props.filterName === 'subCategory') {
        useFilterStore().$patch({
          'currentSubCategoryId': e.target.value,
          'currentSubCategoryTag': null
        })
      }
      if (props.filterName === 'subCategoryTags') {
        useFilterStore().$patch({
          'currentSubCategoryTag': e.target.value
        })
      }
    }

    const api = useCollectionApi()
    api.setBaseApi(usePublicApi())
    api.setEndpoint(props.endpoint)

    const getItems = async () => {
      loading.value = true
      const options = { page: 1, per_page: 25, sort_by: 'name', sort_order: 'asc', searchQuery: null, concat: false, filters: [] }
      await api.retrieveCollection(options)
      items.value = api.items.value as any
      loading.value = false
    }

    onMounted(async () => {
      await getItems()

      // pre set values
      if (props.filterName === 'category' && useFilterStore().currentCategoryId) {
        selected.value = useFilterStore().currentCategoryId
      }

      if (props.filterName === 'subCategory' && useFilterStore().currentSubCategoryId) {
        selected.value = useFilterStore().currentSubCategoryId
      }
    })

    return {
      setSelectValue,
      items,
      selected,
      filteredItems
    }
  },
})
</script>

<style lang="sass" scoped>
</style>