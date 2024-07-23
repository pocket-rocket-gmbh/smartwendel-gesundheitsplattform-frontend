<template>
  <div
    class="d-flex flex-column is-dark-grey stats-card"
    :class="[hasFilter && item.content > 0 ? 'is-clickable' : 'opacity-60 cursor-not-allowed', item.hasNoSpace ? 'mt-n1' : '', loading ? 'cursor-progress' : '']"
    @click="redirectAndFilter"
  >
    <div class="d-flex align-center">
      <div>
        <div
          class="general-font-size word-break"
          lang="de"
        >
          {{ item.title }}
          <v-icon
            size="x-small"
            v-if="hasFilter && item.content > 0"
            >mdi-filter-outline</v-icon
          >
          <v-icon
            size="x-small"
            v-if="hasFilter && item.content === 0"
            disabled
            >mdi-filter-remove-outline</v-icon
          >
        </div>

        <span
          v-if="!loading"
          style="font-size: 14px"
          ><i>{{ item.info }}</i></span
        >
        <v-progress-circular
          :size="70"
          :width="7"
          color="primary"
          indeterminate
          v-if="loading"
          class="mt-2"
        ></v-progress-circular>
        <div
          class="stats-item"
          v-else
        >
          <span
            class="text-h2 font-weight-bold"
             :class="[item.info ? '' : 'pt-6']"
          >
            {{ item.content }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const router = useRouter();

const props = defineProps<{
  loading: boolean;
  item: Item;
}>();

type Item = {
  title: string;
  content?: number;
  type?: 'facility' | 'course' | 'event' | 'users' | 'news';
  query?: string;
  info?: string;
  hasNoSpace?: boolean;
};

const hasFilter = computed(() => !!props.item.query && !!props.item.type);

const redirectAndFilter = () => {
  if (!props.item.type || !props.item.query || props.item.content === 0) {
    return;
  }
  const path = ref<string>("");
  switch (props.item.type) {
    case "facility":
      path.value = "/admin/care_facilities";
      break;
    case "course":
      path.value = "/admin/courses";
      break;
    case "event":
      path.value = "/admin/events";
      break;
    case "users":
      path.value = "/admin/users";
      break;
    case "news":
      path.value = "/admin/news_articles";
      break;
    default:
      break;
  }
  router.push({
    path: path.value,
    query: { filter: props.item.query },
  });
};
</script>
<style lang="scss">
.stats-card {
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 10px 10px;
  margin: 30px 0;
  border: 2px solid #58595e;
  min-height: 147px;
}

.stats-item {
  display: flex;
  flex-direction: column;
  min-width: 100%;
}

@import "@/assets/sass/main.sass";
</style>
