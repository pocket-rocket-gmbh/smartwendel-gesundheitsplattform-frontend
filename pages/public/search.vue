<template>
  <div>
    <PublicSearchTheBasicSearchBox />

    <v-row>
      <v-col md="2">
        <h2 class="is-primary">Suche filtern</h2>

        <PublicFilterSelect
          :key="currentCategoryId"
          color="is-primary"
          filter-name="category"
          label="Leistungsbereich"
          endpoint="categories"
        />

        <PublicFilterSelect
          :disabled="!currentCategoryId"
          :key="currentCategoryId"
          color="is-primary"
          filter-name="subCategory"
          label="Leistungsart"
          :endpoint="`categories/${currentCategoryId}/sub_categories`"
        />

        <PublicFilterSelect
          :disabled="!currentSubCategoryId || !currentCategoryId"
          :key="currentSubCategoryId"
          color="is-primary"
          filter-name="subCategoryTags"
          label="Leistung"
          :endpoint="`categories/${currentCategoryId}/sub_categories`"
        />
      </v-col>
      <v-col md="10">
        Right
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts">
import { useFilterStore } from '@/store/filter'
export default defineComponent({
  setup () {
    const currentCategoryId = computed(() => {
      return useFilterStore().currentCategoryId
    })
    const currentSubCategoryId = computed(() => {
      return useFilterStore().currentSubCategoryId
    })

    return {
      currentCategoryId,
      currentSubCategoryId
    }
  }
})
</script>