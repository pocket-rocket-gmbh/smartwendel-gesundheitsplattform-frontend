<template>
  <PublicCategoriesSubCategories
    v-for="subCategory in subCategories"
    :key="subCategory?.id"
    :sub-category="subCategory"
    :category-id="categoryId"
  />
</template>

<script lang="ts" setup>
const props = defineProps<{
  subCategories: any[];
  categoryId: string;
}>();
</script>
