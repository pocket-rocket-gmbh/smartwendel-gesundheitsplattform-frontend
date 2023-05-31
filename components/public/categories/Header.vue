<template>
  <div class="header">
    <div class=" d-inline align-center justify-center">
      <div class="title-bar is-uppercase has-font-size-big d-flex align-center justify-center">
        <div>
          <h2 class="is-white">{{ category.name }}</h2>
        </div>
      </div>
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
  margin-top: -20px
  height: 60px
  width: 50%
  color: $dark-green
  left: 50%
  transform: translate(50%)

.is-selected
  background: red

.header
  z-index: -1!important
</style>