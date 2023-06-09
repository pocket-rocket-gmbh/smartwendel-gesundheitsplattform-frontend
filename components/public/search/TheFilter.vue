<template>
  <h2 class="is-dark-grey is-uppercase mb-4">Suche filtern</h2>

  <div class="mb-4">
    <PublicFilterSelect
      :key="currentCategoryId"
      color="is-primary"
      filter-name="category"
      label="Bereich"
      endpoint="categories"
    />
  </div>
  <div class="mb-4">
    <PublicFilterSelect
      :disabled="!currentCategoryId"
      :key="currentCategoryId"
      color="is-primary"
      filter-name="subCategory"
      label="Schwerpunkt"
      :endpoint="`categories/${currentCategoryId}/sub_categories`"
    />
  </div>

  <div class="mb-4">
    <PublicFilterSelect
      :disabled="!currentSubCategoryId || !currentCategoryId"
      :key="currentSubCategoryId"
      color="is-primary"
      filter-name="subSubCategory"
      label="Schwerpunkt-Kategorie"
      :endpoint="`categories/${currentCategoryId}/sub_categories/${currentSubCategoryId}/sub_sub_categories`"
    />
  </div>
  <div>Weitere Auswahlmöglichkeiten</div>
  <PublicTagSelect />
  <div>
    <v-btn 
      prepend-icon="mdi-trash-can-outline"
      size="small"
      class="mt-4"
      variant="text"
      color="secondary"
      rounded="pill"
      @click="emitResetFilter"
        >
        Alle Filter löschen
    </v-btn>
  </div>
    
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
        'currentSubSubCategoryId': null,
        'currentTags': null
      })
      useNuxtApp().$bus.$emit('updateFacilitiesBasedOnFilterChange', null)
      useNuxtApp().$bus.$emit('clearSearch', null)
      useNuxtApp().$bus.$emit('clearTags', null)
    }

    return {
      currentCategoryId,
      currentSubCategoryId,
      emitResetFilter
    }
  }
})
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

</style>