<template>
  <div>
    <v-app-bar v-model="appStore.showTopbar" :elevation="0" density="compact" class="title-bar pt-10 pa-3">
      <v-spacer></v-spacer>
      <div class="mt-15">
        <div class="menu-bar d-flex has-bg-mid-grey is-uppercase align-center justify-center">
          <div v-for="item in subCategories" @click="setSubCategoryAndScroll(item?.id)" class="is-clickable">
            <span
              class="px-5 is-dark-grey"
              :class="[selectedId === item?.id ? 'text-decoration-underline' : '']"
              v-show="item.sub_sub_categories.length > 0"
              >{{ item?.name }}
            </span>
          </div>
        </div>
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>
  </div>
</template>
<script lang="ts" setup>
import { VAppBar } from "vuetify/components";
import { useAppStore } from "~/store/app";

const props = defineProps<{
  subCategories: any[];
}>();

const appStore = useAppStore();
const selectedId = ref(null);

const setSubCategoryAndScroll = (id: any) => {
  useNuxtApp().$bus.$emit("setSubCategory", id);
  selectedId.value = id;
};
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

.btn
  position: fixed
  top: 20rem
  z-index: 100
  background: orange
  padding: 2rem
</style>
