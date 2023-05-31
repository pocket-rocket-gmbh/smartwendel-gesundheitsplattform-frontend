<template>
  <PublicCategoriesSubCategories
    v-for="subCategory in subCategories"
    :key="subCategory.id"
    :sub-category="subCategory"
    :category-id="categoryId"
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  subCategories: {
    type: Array,
    required: true
  },
  categoryId: {
    required: true
  }
})

</script>
