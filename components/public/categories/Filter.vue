<template>
  <div class="my-5">
    <div class="menu-bar d-flex is-uppercase align-center justify-center">
      <p class="px-5 is-clickable" v-for="item in subCategories" @click="setSubCategoryAndScroll(item.id)"><span :class="[(selectedId ===  item.id ? 'text-decoration-underline' : '')]" v-if="item?.sub_sub_categories.length > 0">{{ item?.name }}</span></p>
    </div>
  </div>
</template>
<script lang="ts" setup>
  const props = defineProps({
    subCategories: {
      required: true
    },
  })

  const selectedId = ref(null)

const setSubCategoryAndScroll = (id) => {
  useNuxtApp().$bus.$emit('setSubCategory', id);
  selectedId.value = id
}

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


</style>