import { defineStore } from 'pinia'

export const useFilterStore = defineStore({
  id: 'filter',
  state: () => ({
    currentCategoryId: null,
    currentSubCategoryId: null,
    currentSubCategoryTags: null
  })
})