<template>
  <v-row  v-if="loading && galleryKind !== 'logo'">
    <v-col md="6" offset="3" class="d-flex align-center justify-center">
      <LoadingSpinner><i>Galerie wird geladen ...</i></LoadingSpinner>
    </v-col>
  </v-row>
  
  <div v-else class="my-10">
    <v-row>
      <v-col
        class="d-flex child-flex"
        cols="3"
        v-for="(image, index) in images"
        :key="index"
      >
        <v-img
          :src="image"
          aspect-ratio="1"
          max-height="150px"
          max-width="200px"
          class="bg-grey-lighten-2 is-clickable gallery-image"
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
import logo1 from "@/assets/images/logo-gallery/icon_care.png";
import logo2 from "@/assets/images/logo-gallery/icon_doctor.png";
import logo3 from "@/assets/images/logo-gallery/icon_fitness.png";

const emit = defineEmits(["setImage"]);
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  galleryKind: {
    type: String,
    required: true,
  },
  facilityKind: {
    type: String,
  },
});

const loading = ref(false);

const getImagesFromGallery = () => {
  if (!props.facilityKind) {
    return;
  }
  loading.value = true;
  useFetch("/api/image_gallery", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    query: {
      kind: props.facilityKind,
    },
  })
    .then((response) => {
      const imagesBasePath = `/_nuxt/assets/images/cover-images-gallery/${props.facilityKind}/`;
      const imagePaths = response.data.value.map((image: string) => {
        return `${imagesBasePath}${image}`;
      });
      coverImages.value = imagePaths;
      loading.value = false;
    })
    .catch((error) => {
      console.log(error);
    });
};

const logoimages = ref([logo1, logo2, logo3]);
const coverImages = ref([]);

const images = computed(() => {
  if (props.galleryKind === "logo") {
    return logoimages.value;
  }
  if (props.galleryKind === "cover") {
    return coverImages.value;
  }
  return [];
});

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

const selectImage = async (imagePath: string) => {
  const imageBlob = await fileToBase64(imagePath);
  setImage(imageBlob);
};
const setImage = (image: any) => {
  emit("setImage", image);
};

onMounted(() => {
  getImagesFromGallery();
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.gallery-image:hover
  opacity: 0.5

.gallery-icon
  position: absolute
  left: 50%
  top: 50%
</style>
