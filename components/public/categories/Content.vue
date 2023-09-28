<template>
  <template v-for="(subCategory, index) in subCategories" :key="subCategory?.id">
    <v-divider v-if="index !== 0" class="my-5"></v-divider>
    <div v-else class="mt-md-10">&nbsp;</div>

    <PublicCategoriesSubCategories :sub-category="subCategory" :category-id="categoryId" />
  </template>
</template>

<script lang="ts" setup>
const props = defineProps<{
  subCategories: any[];
  categoryId: string;
}>();
</script>