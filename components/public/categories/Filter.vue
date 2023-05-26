<template>
  <div class="my-5">
    <div class="menu-bar d-flex is-uppercase align-center justify-center">
      <v-slide-group
        size="large"
        class="category-chips my-8"
        multiple
        column
      >
      <v-chip
          size="x-large"
          @click=""
        >      
        Alle
        </v-chip>
        <v-chip
          filter-icon="mdi-plus"
          v-for="item in category?.sub_categories"
          size="x-large"
          :key="item.id"
          item-title="name_with_projects_count"
          input-value="id"
          @click=""
          class="mx-1"
          prepend-icon="mdi-checkbox-multiple-blank"
        >      
          {{ item.name }}
        </v-chip>
      </v-slide-group>
    </div>
  </div>
</template>
<script lang="ts" setup>
  const props = defineProps({
    category: {
      required: true
    },
  })
const category = ref(props.category)
</script>
<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
.title-bar
  background: linear-gradient(90deg, #91A80D 46.67%, #BAC323 84.36%, #9EA100 97.5%)
  height: 200px

.menu-bar
  background: $light-grey
  border-radius: 20px
  margin-top: -50px
  height: 60px
  width: 50%
  color: $dark-green
  left: 50%
  transform: translate(50%)

.is-selected
  background: red
</style>