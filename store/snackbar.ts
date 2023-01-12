import { defineStore } from 'pinia'

export const useSnackbarStore = defineStore({
  id: 'snackbar',
  state: () => ({
    content: null,
    color: null,
    timeout: 0
  })
})