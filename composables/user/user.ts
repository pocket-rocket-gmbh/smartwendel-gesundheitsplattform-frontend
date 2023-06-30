import { useUserStore } from "@/store/user";

export function useUser() {
  const userStore = useUserStore();
  const router = useRouter();
  const snackbar = useSnackbar();
  const currentUser = userStore.currentUser;

  const loggedIn = (): Boolean => {
    return currentUser !== null;
  };

  const isAdmin = (): Boolean => {
    if (currentUser) {
      return currentUser.role === "root" || currentUser.role === "admin";
    }
  };

  const setupFinished = async () => {
    if (isAdmin()) return true;

    const currentUserFacility = await getCurrentUserFacilities();

    const test =
      !!currentUserFacility &&
      !!currentUserFacility?.zip &&
      !!currentUserFacility?.town &&
      !!currentUserFacility?.street &&
      !!currentUserFacility?.phone &&
      !!currentUserFacility?.community &&
      !!currentUserFacility?.community_id;
    return test;
  };

  const isFacilityOwner = (): Boolean => {
    if (currentUser) {
      return currentUser.role === "facility_owner";
    }
  };

  const logout = () => {
    localStorage.removeItem("auth._token.jwt");
    userStore.currentUser = null;
    router.push({ path: "/" });
    snackbar.showSuccess("Sie wurden erfolgreich abgemeldet");
  };

  return {
    loggedIn,
    isAdmin,
    isFacilityOwner,
    currentUser,
    logout,
    setupFinished,
  };
}
