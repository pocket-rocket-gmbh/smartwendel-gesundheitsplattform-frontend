import { defineStore } from "pinia";

export const useAppStore = defineStore({
  id: "app",
  state: () => ({
    dashboardBackLink: "",
    showTopbar: true,
    windowWidth: -1,
    loading: false,
  }),
});
