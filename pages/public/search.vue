<template>
  <ClientOnly>
    <v-container class="limited offset">
      <PublicSearchTheBasicSearchBox />
      <v-row>
        <v-col align="right">
          <div class="sort-order mt-3">
            <v-select
                variant="underlined"
                v-model="filterCriteria"
                :items="items"
                label="Sortierung"
              />
            </div>
        </v-col>
      </v-row>
      <v-row class="mt-1">
        <v-col md="4" lg="3">
          <PublicSearchTheFilter />
        </v-col>
        <v-col md="8" lg="9" class="filtered-items mb-10">
          <PublicSearchTheFilteredCareFacilities :filterCriteria="filterCriteria"/>
        </v-col>
      </v-row>
    </v-container>
  </ClientOnly>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({

  setup(props) {
    const filterCriteria = ref('ASC')
    const items = 
      ['ASC', 'DESC']

    onMounted(() => {
    
    })

    return {
      filterCriteria,
      items
    }
  }
})
</script>
<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.sort-order
  width: 200px
</style>