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
        cols="2"
        v-for="(image, index) in images"
        :key="index"
      >
        <v-img
          v-if="image"
          :src="image"
          :key="index"
          cover
          aspect-ratio="1"
          max-height="150px"
          max-width="200px"
          :class="[{ 'is-selected' : index === selectedimage }]"
          class="is-clickable gallery-image"
          @click="selectImage(index, image)"
        >
        <div class="selected" v-if="index === selectedimage"><v-icon color="red" size="60px">mdi-checkbox-marked-circle-outline</v-icon></div>
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey-lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        <span v-else>Keine Bilder gefunden</span>
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts" setup>
import logo1 from "@/assets/images/logo-gallery/logo_doctor.png";
import logo2 from "@/assets/images/logo-gallery/logo_association.png";
import logo3 from "@/assets/images/logo-gallery/logo_authority.png";
import logo4 from "@/assets/images/logo-gallery/logo_care.png";
import logo5 from "@/assets/images/logo-gallery/logo_clinic.png";
import logo6 from "@/assets/images/logo-gallery/logo_massage.png";
import logo7 from "@/assets/images/logo-gallery/logo_midwife.png";
import logo8 from "@/assets/images/logo-gallery/logo_optician.png";
import logo9 from "@/assets/images/logo-gallery/logo_pharmacy.png";
import logo10 from "@/assets/images/logo-gallery/logo_sport_1.png";
import logo11 from "@/assets/images/logo-gallery/logo_sport_2.png";
import logo12 from "@/assets/images/logo-gallery/logo_store.png";
import logo13 from "@/assets/images/logo-gallery/logo_therapy_1.png";
import logo14 from "@/assets/images/logo-gallery/logo_therapy_2.png";
import logo15 from "@/assets/images/logo-gallery/logo_consulting.png";

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
      const imagesBasePath = `/images/cover-images-gallery/${props.facilityKind}/`;
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

const logoimages = ref([logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8, logo9, logo10, logo11, logo12, logo13, logo14, logo15]);
const coverImages = ref<string[]>([]);

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

const selectedimage = ref(null);
const selectImage = async (index: number, imagePath: string) => {
  selectedimage.value = index;
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
  opacity: 0.4

.selected
  position: absolute
  left: 35%
  top: 30%

.is-selected
  opacity: 0.5
  border: 5px solid green

.gallery-icon
  position: absolute
  left: 50%
  top: 50%
</style>
