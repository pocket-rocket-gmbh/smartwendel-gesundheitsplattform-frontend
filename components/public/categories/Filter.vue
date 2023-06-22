<template>
  <v-app-bar scroll-behavior="hide" :elevation="0" density="compact" class="title-bar pt-10 pa-3">
    <v-spacer></v-spacer>  
    <div class="mt-15">
      <div class="menu-bar d-flex has-bg-mid-grey is-uppercase align-center justify-center">
        <div v-for="item in subCategories" @click="setSubCategoryAndScroll(item.id)">
          <div>
            <span class="px-5 is-clickable is-dark-grey" :class="[(selectedId ===  item.id ? 'text-decoration-underline' : '')]" v-show="item.sub_sub_categories.length > 0">{{ item?.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <v-spacer></v-spacer>
  </v-app-bar>
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
.menu-bar
  border-radius: 20px
  height: 60px
  width: 100%
  color: $dark-green

.title-bar
  height: 150px
</style>