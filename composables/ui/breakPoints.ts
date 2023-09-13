import { computed, onMounted, onUnmounted, ref } from "vue";

export enum BreakPoints {
  "xs" = 360,
  "sm" = 600,
  "md" = 960,
  "lg" = 1264,
  "xl" = 1904,
}

export const useBreakpoints = () => {
  const windowWidth = ref(window.innerWidth);

  const onWidthChange = () => {
    windowWidth.value = window.innerWidth;
  };

  onMounted(() => window.addEventListener("resize", onWidthChange));
  onUnmounted(() => window.removeEventListener("resize", onWidthChange));

  const type = computed(() => {
    if (windowWidth.value < BreakPoints.xs) return "xs";
    if (windowWidth.value >= BreakPoints.xs && windowWidth.value < BreakPoints.sm) return "sm";
    if (windowWidth.value >= BreakPoints.sm && windowWidth.value < BreakPoints.md) return "md";
    if (windowWidth.value >= BreakPoints.md && windowWidth.value < BreakPoints.lg) return "lg";
    return "xl";
  });

  const width = computed(() => windowWidth.value);

  const isMobile = computed(() => width.value < BreakPoints.md);

  return { width, type, isMobile };
};
