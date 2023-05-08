<template>
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
      <v-col md="3" lg="2">
        <PublicSearchTheFilter />
      </v-col>
      <v-col md="9" lg="10" class="filtered-items mb-10">
        <PublicSearchTheFilteredCareFacilities :filterCriteria="filterCriteria"/>
      </v-col>
    </v-row>
  </v-container>
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

.filtered-items
  overflow-y: scroll
  min-height: 600px
  height: 600px
  padding-right: 10px


::-webkit-scrollbar 
  width: 16px
  height: 6px

::-webkit-scrollbar-track 
  -webkit-box-shadow: inset 0 0 6px #D3D3D3
  -webkit-border-radius: 6px
  border-radius: 6px

::-webkit-scrollbar-thumb 
  -webkit-border-radius: 6px
  border-radius: 6px
  background: #D3D3D3
  -webkit-box-shadow: inset 0 0 6px #D3D3D3

::-webkit-scrollbar-thumb:window-inactive 
  background: #D3D3D3

.sort-order
  width: 200px
</style>