<template>
  <v-app-bar v-model="appStore.showTopbar" :elevation="0" density="compact" class="title-bar">
    <div class="shifted">
      <div class="menu-bar d-flex has-bg-mid-grey is-uppercase align-center justify-center font-weight-medium">
        <div v-for="item in subCategories" @click="setSubCategoryAndScroll(item?.id)" class="is-clickable">
          <span
            class="px-5 is-dark-grey "
            :class="[selectedId === item?.id ? 'text-decoration-underline' : '']"
            v-show="item.sub_sub_categories.length > 0"
            >{{ item?.name }}
          </span>
        </div>
      </div>
    </div>
    
  </v-app-bar>
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

useNuxtApp().$bus.$on("updateSubCategoriesFromUrl", (id) => {
  selectedId.value = id;
});
</script>
<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

.title-bar {
  // top: 164px !important;
  height: 150px;

  padding: 1rem;
  padding-top: 3rem;

  @include md {
    padding: 0.5rem;
    padding-top: 2rem;
  }

  .shifted {
    margin-top: 2rem;

    @include md {
      width: 100%;
      margin-top: 5rem;
    }
  }
}

.menu-bar {
  border-radius: 20px;
  min-height: 60px;
  width: 100%;
  //color: $dark-green;

  @include md {
    padding: 0.5rem;
    flex-wrap: wrap;
    gap: 0.5rem;
    height: fit-content;
  }
}
.btn {
  position: fixed;
  top: 20rem;
  z-index: 100;
  background: orange;
  padding: 2rem;
}
</style>
