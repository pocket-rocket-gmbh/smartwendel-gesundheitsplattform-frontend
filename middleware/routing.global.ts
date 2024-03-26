import { useUserStore } from "../store/user"
import { ResultStatus } from "@/types/serverCallResult"

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const router = useRouter()
    const userStore = useUserStore()
    const privateApi = usePrivateApi()

    const isRestrictedPath = to.fullPath.includes('/admin')
    const jwt = localStorage.getItem('auth._token.jwt')
    const user = userStore.currentUser

    // No token and restricted path -> redirect to login page.
    if (jwt === null && isRestrictedPath) {
      router.replace({ path: '/login' })
      return
    }

    // Try to get user information if there is a token.
    if (jwt !== null && user === null) {
      const response = await privateApi.call('get', '/users/me', null)
      if (response.status === ResultStatus.SUCCESSFUL) {
        userStore.currentUser = response.data.resource
      }
    }

    // Prevent non-admin users from accessing admin pages.
    if (isRestrictedPath && (!useUser().isAdmin() && !useUser().isFacilityOwner())) {
      router.replace({ path: '/' })
    }
  }
})