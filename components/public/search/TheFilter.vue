<template>
  <h2 class="is-primary is-uppercase mb-4">Suche filtern</h2>

  <div class="mb-4">
    <PublicFilterSelect
      :key="currentCategoryId"
      color="is-primary"
      filter-name="category"
      label="Leistungsbereich"
      endpoint="categories"
    />
  </div>

  <div class="mb-4">
    <PublicFilterSelect
      :disabled="!currentCategoryId"
      :key="currentCategoryId"
      color="is-primary"
      filter-name="subCategory"
      label="Leistungsart"
      :endpoint="`categories/${currentCategoryId}/sub_categories`"
    />
  </div>

  <div class="mb-4">
    <PublicFilterSelect
      :disabled="!currentSubCategoryId || !currentCategoryId"
      :key="currentSubCategoryId"
      color="is-primary"
      filter-name="subCategoryTags"
      label="Leistung"
      :endpoint="`categories/${currentCategoryId}/sub_categories`"
    />
  </div>

  <div class="text-info is-clickable font-weight-bold" @click="emitResetFilter"><nuxt-icon filled name="trash" class="mr-1" /> Alle Filter löschen</div>
</template>

<script lang="ts">
import { useFilterStore } from '@/store/filter'
export default defineComponent({
  setup () {
    const currentCategoryId = computed(() => {
      return useFilterStore().currentCategoryId
    })
    const currentSubCategoryId = computed(() => {
      return useFilterStore().currentSubCategoryId
    })

    const emitResetFilter = () => {
      useFilterStore().$patch({
        'currentCategoryId': null,
        'currentSubCategoryId': null,
        'currentSubCategoryTags': null
      })
      useNuxtApp().$bus.$emit('updateFacilitiesBasedOnFilterChange', null)
      useNuxtApp().$bus.$emit('clearSearch', null)
    }

    return {
      currentCategoryId,
      currentSubCategoryId,
      emitResetFilter
    }
  }
})
</script>