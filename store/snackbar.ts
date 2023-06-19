import { defineStore } from "pinia";

export const useSnackbarStore = defineStore({
  id: "snackbar",
  state: () => ({
    content: null,
    color: null,
    timeout: 0,
    visible: false,
  }),
  actions: {
    showSnackbar(content: string, color: string, timeout: number) {
      this.content = content;
      this.color = color;
      this.timeout = timeout;
      this.visible = true;

      setTimeout(() => {
        this.content = null;
        this.color = null;
        this.timeout = 0;
        this.visible = false;
      }, this.timeout);
    },
  },
});
