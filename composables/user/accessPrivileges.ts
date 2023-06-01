import { useUserStore } from "@/store/user"

export function useAccessPrivileges() {
  const userStore = useUserStore()

  const currentUser = () => {
    return userStore.currentUser
  }

  const currentOrganization = () => {
    return userStore.currentUser?.organization
  }

  const lockedAttributes = () => {
    if (currentUser()) {
      return currentUser().permissions.locked_attributes
    }
    return undefined
  }

  const endpointPermissions = () => {
    if (currentUser()) {
      return currentUser().permissions.endpoints
    }
    return undefined
  }

  const canAccessAttribute = (endpoint:string, attribute:string) => {
    if (lockedAttributes()) {
      const locked = lockedAttributes()[endpoint]
      if (locked) {
        return !locked.includes(attribute)
      }
    }
    return true
  }

  const canAccessEndpointAction = (endpoint:string, action:string) => {
    if (endpointPermissions()) {
      const perm = endpointPermissions()[endpoint]
      if (perm) {
        return perm[action]
      } else {
        return false
      }
    }
    return true
  }

  const canAccessModule = (module:string) => {
    if (currentOrganization()){
      return currentOrganization().modules_allowed.includes(module)
    } else {
      return false
    }
  }

  return {
    canAccessAttribute,
    canAccessEndpointAction,
    canAccessModule
  }
}