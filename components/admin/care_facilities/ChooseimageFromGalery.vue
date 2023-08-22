<template>
  <div>
    <v-row>
      <v-col class="d-flex child-flex" cols="4"  v-for="(image, index) in images" :key="index">
        <v-img
          :src="image"
          aspect-ratio="1"
          cover
          max-height="200px"
          max-width="400px"
          class="bg-grey-lighten-2 is-clickable"
          @click="selectImage(image)"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey-lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts" setup>
import image1 from "@/assets/images/logo.png";
import image2 from "@/assets/images/home.png";

const emit = defineEmits(["setImage"]);
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  galeryKind: {
    type: String,
    required: true,
  },
});

const images = ref([image1, image2]);

const fileToBase64 = (filePath: string) => {
  return new Promise<string>((resolve, reject) => {
    fetch(filePath)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64String = reader.result as string;
          resolve(base64String);
        };
        reader.onerror = reject;
      })
      .catch(reject);
  });
};

const selectImage =async (imagePath: string) => {
  const imageBlob = await fileToBase64(imagePath);
  setImage(imageBlob)
}
const setImage = (image:any) => {
  emit("setImage", image);
};

</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
</style>
