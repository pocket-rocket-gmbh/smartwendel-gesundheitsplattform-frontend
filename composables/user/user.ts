import { useUserStore } from "@/store/user";

export function useUser() {
  const userStore = useUserStore();
  const router = useRouter();
  const snackbar = useSnackbar();
  const currentUser = userStore.currentUser;

  const loggedIn = (): Boolean => {
    return currentUser !== null;
  };

  const loginCount = (): Number => {
    return currentUser?.login_count || 0;
  };

  const isAdmin = (): Boolean => {
    if (currentUser) {
      return currentUser.role === "root" || currentUser.role === "admin" || currentUser.role === "care_facility_admin";
    }
  };

  const isSuperAdmin = (): Boolean => {
    if (currentUser) {
      return currentUser.role === "root" || currentUser.role === "care_facility_admin";
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

  const facilityFinished = async () => {
    if (isAdmin()) return true;

    const currentUserFacility = await getCurrentUserFacilities();

    return isCompleteFacility(currentUserFacility);
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
    snackbar.showSuccess("Du wurdest erfolgreich abgemeldet");
  };

  return {
    loggedIn,
    isAdmin,
    isSuperAdmin,
    isFacilityOwner,
    currentUser,
    logout,
    setupFinished,
    facilityFinished,
    loginCount
  };
}
