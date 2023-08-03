<template>
  <v-dialog v-model="dialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
    <template v-slot:activator="{ props }">
      <div v-bind="props">
        <v-icon>mdi-arrow-left</v-icon>
      </div>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Kategorien</v-toolbar-title>
        <v-btn variant="text" @click="dialog = false"> Schließen </v-btn>
      </v-toolbar>

      <div class="menu-items">
        <div v-for="item in visibleSubCategories" @click="setSubCategoryAndScroll(item?.id)" class="menu-item">
          {{ item?.name }}
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  subCategories: any;
  selectedId: string;
}>();

const visibleSubCategories = computed(() => {
  return props.subCategories.filter((category: any) => category?.sub_sub_categories?.length);
});

const emit = defineEmits<{
  (event: "setCategoryAndScroll", id: string): void;
}>();

const dialog = ref(false);

const setSubCategoryAndScroll = (id: string) => {
  dialog.value = false;
  emit("setCategoryAndScroll", id);
};
</script>

<style lang="scss">
@import "@/assets/sass/main.sass";

.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}

.menu-items {
  display: flex;
  flex-direction: column;
  padding: 2rem;

  .menu-item {
    font-size: 22px;
    padding: 2rem 0;

    &:not(:last-child) {
      border-bottom: 1px solid black;
    }
  }
}
</style>
