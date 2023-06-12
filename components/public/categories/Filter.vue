<template>
  <div class="my-5">
    <div class="menu-bar d-flex has-bg-mid-grey is-uppercase align-center justify-center">
      <div v-for="item in subCategories" @click="setSubCategoryAndScroll(item.id)">
        <div>
          <span class="px-5 is-clickable is-dark-grey" :class="[(selectedId ===  item.id ? 'text-decoration-underline' : '')]" v-show="item.sub_sub_categories.length > 0">{{ item?.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
defineProps({
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
  border-radius: 20px
  margin-top: -50px
  height: 60px
  width: 50%
  color: $dark-green
  left: 50%
  transform: translate(50%)


</style>