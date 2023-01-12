import { useSnackbarStore } from "@/store/snackbar"

export function useSnackbar() {

  const snackbarStore = useSnackbarStore()

  const show = (message: string, color: string, timeout: number) => {
    snackbarStore.$patch((state) => {
      state.content = message
      state.color = color
      state.timeout = timeout
    })
  }

  const showInfo = (message: string) => {
    show(message, 'info', 3000)
  }

  const showSuccess = (message: string) => {
    show(message, 'success', 2000)
  }

  const showError = (message: string) => {
    show(message, 'error', 5000)
  }

  return {
    show,
    showInfo,
    showSuccess,
    showError
  }
}
