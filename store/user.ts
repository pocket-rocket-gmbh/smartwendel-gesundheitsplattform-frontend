import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    currentUser: null,
    loggedIn: false
  })
})