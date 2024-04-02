<template>
  <div
    class="d-flex flex-column justify-center align-center text-primary text-h4 font-weight-medium card"
  >
    <div class="d-flex align-center">
      <div v-for="info in item" :key="item.id">
        <div>
          {{ info }}
        </div>
        <div>000</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  item: {
    title: string;
    props: string;
  };
}>();

const listApi = useCollectionApi();
listApi.setBaseApi(usePublicApi());

const facilities = ref(null);

const getCoursesArticles = async () => {
  listApi.setEndpoint(`care_facilities`);
  await listApi.retrieveCollection();
  facilities.value = listApi.items.value as any;
};

onMounted(() => {
  getCoursesArticles();
});
</script>
<style lang="scss">
.card {
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 20px;
  margin: 20px;

  border: 2px solid #58595e;
}

@import "@/assets/sass/main.sass";
</style>
