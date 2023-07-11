<template>
  <LoadingSpinner v-if="loading">Tags werden geladen... </LoadingSpinner>
  <div class="selection" v-else>
    <div v-for="(tag, index) in limitedTags" :key="tag.id">
      <v-checkbox
        v-if="!tag.subTags || !tag.subTags.length"
        class="mb-n10"
        :label="tag.name"
        v-model="filterStore.currentTags"
        :value="tag.id"
      />
      <div class="ml-2" v-else>
        <v-checkbox
          :density="'compact'"
          :key="tag.id"
          :hide-details="true"
          :label="tag.name"
          v-model="filterStore.currentTags"
          :value="tag.id"
          @click="handleSubTagParentClick(tag)"
        />
        <div class="ml-4">
          <v-checkbox
            v-for="(subTag, index) in tag.subTags"
            :density="'compact'"
            :key="subTag.id"
            :hide-details="true"
            :label="subTag.name"
            v-model="filterStore.currentTags"
            :value="subTag.id"
            @click="handleSubTagClick(subTag, tag)"
          />
        </div>
      </div>
    </div>
  </div>
  <v-btn class="my-5" variant="text" rounded="pill" @click="showMoreTags()" v-if="showMoreButton">
    <span> ... mehr laden </span>
  </v-btn>
</template>

<script setup lang="ts">
import { useFilterStore } from "~/store/searchFilter";

type Tag = {
  id: string;
  name: string;
  subTags?: Tag[];
};

const props = defineProps<{
  filterId: string;
}>();

const loading = ref(false);

const filterStore = useFilterStore();

const availableTags = ref<Tag[]>([]);
const maxTagsToShow = ref(5);
const showMoreButton = ref(true);

const limitedTags = computed(() => {
  return availableTags.value.slice(0, maxTagsToShow.value);
});

const showMoreTags = () => {
  maxTagsToShow.value += 5;
  if (maxTagsToShow.value >= availableTags.value.length) {
    showMoreButton.value = false;
  }
};

const getTags = async () => {
  loading.value = true;
  availableTags.value = await getFilters(props.filterId);

  for (const tag of availableTags.value) {
    const subTags = await getFilters(tag.id);
    if (!subTags.length) continue;
    tag.subTags = subTags;
  }

  loading.value = false;

  if (availableTags.value.length <= maxTagsToShow.value) showMoreButton.value = false;
};

const tick = () => new Promise((resolve) => requestAnimationFrame(resolve));

const handleSubTagParentClick = async (tag: Tag) => {
  if (!tag.subTags) return;
  await tick();
  if (filterStore.currentTags.includes(tag.id)) {
    filterStore.enableAllTags(tag.subTags.map((tag) => tag.id));
  } else {
    filterStore.disableAllTags(tag.subTags.map((tag) => tag.id));
  }
};

const handleSubTagClick = async (tag: Tag, parentTag: Tag) => {
  await tick();

  if (!filterStore.currentTags.includes(tag.id)) {
    const parentIndex = filterStore.currentTags.findIndex((item) => item === parentTag.id);
    if (parentIndex !== -1) filterStore.currentTags.splice(parentIndex, 1);
  } else {
    if (parentTag.subTags.map((subTag) => subTag.id).every((item) => filterStore.currentTags.includes(item))) {
      filterStore.currentTags.push(parentTag.id);
    }
  }
};

watch(props, () => {
  getTags();
});

onMounted(() => {
  getTags();
});
</script>
