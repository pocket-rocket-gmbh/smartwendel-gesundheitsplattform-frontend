import { defineStore } from 'pinia'

export const useTooltipsStore = defineStore({
  id: 'tooltips',
  state: () => ({
    tooltips: null
  })
})