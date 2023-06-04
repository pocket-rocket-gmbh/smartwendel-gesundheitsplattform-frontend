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
  background: linear-gradient(89.48deg, #91A80D 19.14%, #BAC323 42.28%, #9EA100 83.7%)
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