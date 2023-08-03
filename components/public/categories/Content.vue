<template>
  <template v-for="(subCategory, index) in filteredSubCategories" :key="subCategory?.id">
    <v-divider v-if="index !== 0" class="my-5"></v-divider>
    <div v-else class="mt-10">&nbsp;</div>

    <PublicCategoriesSubCategories :sub-category="subCategory" :category-id="categoryId" />
  </template>
</template>

<script lang="ts" setup>
const props = defineProps<{
  subCategories: any[];
  categoryId: string;
}>();

const filteredSubCategories = computed(() => {
  return props.subCategories.filter((category: any) => category?.sub_sub_categories?.length);
});
</script>
