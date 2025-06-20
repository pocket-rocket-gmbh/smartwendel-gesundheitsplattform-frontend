const handler = (onResizeCallback: any) => {
  return () => {
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    onResizeCallback({ width, height });
  };
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("resize", {
    mounted: (el, binding) => {
      const onResizeCallback = binding.value;
      window.addEventListener("resize", handler(onResizeCallback));
    },
    beforeUnmount: (el, binding) => {
      const onResizeCallback = binding.value;
      window.removeEventListener("resize", handler(onResizeCallback));
    },
  });
});
