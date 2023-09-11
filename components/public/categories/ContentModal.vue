<template>
  <v-dialog
    width="900"
    v-model="opened"
    transition="dialog-bottom-transition"
    class="mt-10"
  >
    <img
      class="close-btn is-clickable"
      src="~/assets/images/icon-times.svg"
      height="20"
      @click="close()"
    />
    <v-card class="dialog">
      <v-card-text>
        <v-row>
          <v-col class="d-flex align-center justify-center">
            <v-img
              v-if="item?.image_url"
              max-height="300px"
              max-width="300px"
              :src="item?.image_url"
              cover
              aspect-ratio="1"
            />
            <v-img
              v-else
              max-height="300px"
              max-width="300px"
              :src="noImage"
              cover
              aspect-ratio="1"
              class="no-image"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex flex-column justify-center aligin-center">
            <h3 class="mb-4">{{ item?.name }}</h3>
            <div class="content break-text" v-html="item?.description"></div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-row no-gutters>
          <v-col class="d-flex justify-center">
            <v-btn elevation="0" variant="outlined" @click="close"> Schließen </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import noImage from "@/assets/images/no-image.svg";
const emit = defineEmits(["close"]);
const props = defineProps({
  open: Boolean,
  item: {
    type: Object,
    required: true,
  },
});

const opened = ref(props.open);
const item = ref(props.item);

const close = () => {
  opened.value = false;
  emit("close");
};

onMounted(() => {});
</script>

<style lang="sass">
.dialog
  overflow: hidden !important

.card-text
  text-align: center

.no-image
  opacity: 0.5

.confetti-effect
  padding-top: 20px
  text-align: center
</style>
