import { defineStore } from 'pinia'

export const useStatusLoadingFilter = defineStore({
  id: 'statusLoadingFilter',
  state: () => ({
    categoryLoaded: false,
    servicesLoaded: false,
  })
})