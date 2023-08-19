export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("fitText", {
    mounted: (el: HTMLElement, binding) => {
      if (!el.hasChildNodes()) return;
      const firstChild = el.firstChild as HTMLElement;

      const containerWidth = el.clientWidth;
      const containerHeight = el.clientHeight;

      const childWidth = firstChild.clientWidth;
      const childHeight = firstChild.clientHeight;

      if (childWidth < containerWidth && childHeight < containerHeight) return;

      let fontSize = binding.value.min || 16;
      firstChild.style.fontSize = fontSize + "px";
      let textWidth = firstChild.clientWidth;
      let textHeight = firstChild.clientHeight;

      while (fontSize < (binding.value.max || 45) && textWidth <= containerWidth && textHeight <= containerHeight) {
        firstChild.style.fontSize = fontSize + "px";
        textWidth = firstChild.clientWidth;
        textHeight = firstChild.clientHeight;
        fontSize++;
      }
      fontSize -= 2;
      firstChild.style.fontSize = fontSize + "px";
    },
  });
});
