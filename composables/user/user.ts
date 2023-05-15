import { useUserStore } from "@/store/user"

export function useUser() {

  const userStore = useUserStore()
  const router = useRouter()
  const snackbar = useSnackbar()
  const currentUser = userStore.currentUser

  const loggedIn = ():Boolean => {
    return currentUser !== null
  }

  const isAdmin = ():Boolean => {
    if (currentUser) {
      return currentUser.role === 'root' || currentUser.role === 'admin'
    }
  }

  const logout = () => {
    localStorage.removeItem('auth._token.jwt')
    userStore.currentUser = null
    router.push({ path: '/' })
    snackbar.showSuccess('Sie wurden erfolgreich abgemeldet')
  }

  return {
    loggedIn,
    isAdmin,
    currentUser,
    logout
  } 
}
