<template>
  <div class="basic-search-box mt-4">
    <h2 class="is-uppercase">Wählen Sie hier Ihre Suchkriterien aus</h2>

    <v-row>
      <v-col>
        <div class="field">
          <label class="label">Einrichtung, Arzt, Name etc.</label>
          <input type="text" class="input" v-model="searchQuery" />
        </div>
      </v-col>
      <v-col>
        <PublicFilterSelect
          :key="currentCategoryId"
          color="is-white"
          filter-name="category"
          label="Leistungsbereich"
          endpoint="categories"
        />
      </v-col>
      <v-col align="right">
        <v-btn
          class="mt-7"
          variant="flat"
          color="info"
          rounded="pill"
          @click="emitSearch"
        >
          Suche starten
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>
s
<script lang="ts">
import { useFilterStore } from '@/store/filter';

export default defineComponent({
  setup () {
    const searchQuery = ref('')
    const filterStore = useFilterStore()

    if (useNuxtApp().$bus) {
      useNuxtApp().$bus.$on("clearSearch", () => {
        searchQuery.value = ''
      })
    }
    
    const currentCategoryId = computed(() => {
      return filterStore.currentCategoryId
    })

    const emitSearch = () => {
      useNuxtApp().$bus.$emit('emitFacilitySearch', searchQuery.value)
    }

    return {
      useFilterStore,
      searchQuery,
      currentCategoryId,
      emitSearch
    }
  }
})
</script>

<style lang="sass" scoped>
.basic-search-box
  background: linear-gradient(180deg, #007EC3 0%, #005180 100%)
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
  border-radius: 20px
  padding: 20px
</style>