<template>
  <div
    class="d-flex flex-column is-dark-grey stats-card"
    :class="hasFilter ? 'is-clickable' : ''"
    @click="redirectAndFilter"
  >
    <div class="d-flex align-center">
      <div>
        <div class="general-font-size word-break" lang="de">
          {{ item.title }}
          <v-icon size="x-small" v-if="hasFilter">mdi-filter-outline</v-icon>
        </div>
        <v-progress-circular
          :size="70"
          :width="7"
          color="primary"
          indeterminate
          v-if="loading"
          class="mt-2"
        ></v-progress-circular>
        <div class="text-h2 font-weight-bold stats-item" v-else>
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const router = useRouter();

const props = defineProps<{
  loading: boolean;
  item: {
    title: string;
    content: string;
    type?: string;
    query?: string;
  };
  complaints: any;
}>();

const hasFilter = computed(() => !!props.item.query && !!props.item.type);

const redirectAndFilter = () => {
  if (!props.item.type || !props.item.query) {
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
    case "complaints":
      path.value = "/admin/complaints";
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
  padding: 10px 20px;
  margin: 30px 0;
  border: 2px solid #58595e;
  min-height: 147px;
}

.stats-item {
  display: flex;
  flex-direction: column;
  min-width: 100%;
  padding: 20px 0 10px 0;
}

@import "@/assets/sass/main.sass";
</style>
