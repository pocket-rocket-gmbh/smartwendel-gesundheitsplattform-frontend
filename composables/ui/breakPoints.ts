import { computed, onMounted, onUnmounted, ref } from "vue";

export enum BreakPoints {
  "xs" = 360,
  "sm" = 600,
  "md" = 960,
  "lg" = 1264,
  "xl" = 1904,
}

export const useBreakpoints = () => {
  console.log(process.client)
  const width = ref(process.client ? window.innerWidth : 0);
  const type = ref("md");
  const isMobile = ref(false);

  const getType = () => {
    if (width.value < BreakPoints.xs) return "xs";
    if (width.value >= BreakPoints.xs && width.value < BreakPoints.sm) return "sm";
    if (width.value >= BreakPoints.sm && width.value < BreakPoints.md) return "md";
    if (width.value >= BreakPoints.md && width.value < BreakPoints.lg) return "lg";
    return "xl";
  };

  function handler() {
    width.value = window.innerWidth;
    type.value = getType();
    isMobile.value = width.value < BreakPoints.md;
  }

  onMounted(() => {
    window.addEventListener("resize", handler);
    handler();
  });
  onUnmounted(() => window.removeEventListener("resize", handler));

  return { width, type, isMobile };
};
