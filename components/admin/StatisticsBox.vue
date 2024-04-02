<template>
  <div class="d-flex flex-column is-dark-grey card">
    <div class="d-flex align-center">
      <div>
        <div class="general-font-size">
          {{ item.title }}
        </div>
        <v-progress-circular
          :size="70"
          :width="7"
          color="primary"
          indeterminate
          v-if="loading"
          class="mt-2"
        ></v-progress-circular>
        <div class="text-h2 font-weight-bold stats-item" v-else>
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  loading: boolean;
  item: {
    title: string;
    content: string;
  };
}>();
</script>
<style lang="scss">
.card {
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 10px 20px;
  margin: 30px 0;
  border: 2px solid #58595e;
  min-height: 147px;
}

.stats-item {
  display: flex;
  flex-direction: column;
  min-width: 100%;
  padding: 20px 0 10px 0;
}

@import "@/assets/sass/main.sass";
</style>
