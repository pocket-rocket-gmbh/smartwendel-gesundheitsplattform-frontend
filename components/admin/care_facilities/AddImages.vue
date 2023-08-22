<template>
  <div>
    <Loading v-if="loadingItem" />
    <div class="field mt-3">
      <v-file-input
        class="text-field"
        :disabled="item?.sanitized_images.length >= 6"
        hide-details="auto"
        v-model="images"
        label="Neues Bild wählen"
        filled
        prepend-icon="mdi-camera"
        @change="handleFiles()"
        accept="image/*"
        multiple
        show-size
      />
      <div class="text-caption">* Maximal 5 MB, PNG/JPG/JPEG erlaubt</div>
      <div class="text-error" v-if="item?.sanitized_images.length >= 6">
        Es können maximal 6 Bilder hinzugefügt werden
      </div>
      <div v-if="errorFileSizeTooLarge" class="text-error mt-3">
        Das gewählte Bild ist zu groß. Es darf eine Größe von 5MB nicht überschreiten.
      </div>
    </div>
    <ImageCropper
      class="mb-5"
      v-if="currentCroppingImageUrl"
      :imgUrl="currentCroppingImageUrl"
      cta="Bild speichern"
      @close="handleRemoveImage"
      @crop="setImage"
    />
    <v-row v-if="itemId">
      <v-col v-for="(image, index) in item?.sanitized_images" :key="index" md="2">
        <v-card>
          <v-img :lazy-src="image.url" :src="image.url" max-width="200" />
          <div @click="deleteImage(image.signed_id)" class="text-error ml-1 mt-1 is-clickable">Bild löschen</div>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-for="(image, index) in item?.offline_images" :key="index" md="2">
        <v-card>
          <v-img :lazy-src="image" :src="image" max-width="200" />
          <div @click="deleteImageOffline(index)" class="text-error ml-1 mt-1 is-clickable">Bild löschen</div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { ResultStatus } from "@/types/serverCallResult";
const emit = defineEmits(["offline", "updateImages"]);
const props = defineProps({
  itemId: {
    type: String,
    required: true,
  },
});
const loadingItem = ref(false);
const errors = ref([]);
const images = ref<File[]>([]);
const imageUrls = ref<string[]>([]);
const currentCroppingImageUrl = ref("");
const errorFileSizeTooLarge = ref(false);
const item = ref({
  sanitized_images: [],
  offline_images: [],
  file: "",
});

const setImage = (image: any) => {
  item.value.file = image;
  save();
};

const handleRemoveImage = () => {
  const indexOfItemToRemove = imageUrls.value.findIndex((item) => item === currentCroppingImageUrl.value);

  if (indexOfItemToRemove === -1) {
    images.value = [];
    imageUrls.value = [];
    currentCroppingImageUrl.value = "";
    return;
  }

  images.value.splice(indexOfItemToRemove, 1);
  imageUrls.value.splice(indexOfItemToRemove, 1);
  setNextImageForCrop();
};

const toBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // @ts-expect-error typing
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const handleFiles = async () => {
  if (!images.value?.length) return;

  const validImages = images.value.filter((image) => image.size / 1000000 < 5);
  console.log(validImages, images.value);

  if (validImages.length !== images.value.length) {
    errorFileSizeTooLarge.value = true;
  }

  const imageUrlPromises = validImages.map((image) => toBase64(image));
  const imgUrlResults = await Promise.allSettled(imageUrlPromises);
  imageUrls.value = imgUrlResults.map((item) => (item.status === "fulfilled" ? item.value : "")).filter(Boolean);

  setNextImageForCrop();
};

const setNextImageForCrop = () => {
  if (!imageUrls.value.length) {
    currentCroppingImageUrl.value = "";
    return;
  }

  currentCroppingImageUrl.value = imageUrls.value.at(0);
};

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());

const getCareFacility = async () => {
  api.setEndpoint(`care_facilities/${props.itemId}`);
  loadingItem.value = true;
  await api.getItem();
  emit("updateImages");
  loadingItem.value = false;
  item.value = api.item.value;
};

const save = async () => {
  if (props.itemId) {
    api.setEndpoint(`care_facilities/${props.itemId}/images`);
    loadingItem.value = true;
    const data = {
      file: item.value.file,
    };
    const result = await api.createItem(data, "Bild erfolgreich hinzugefügt");

    handleRemoveImage();

    if (result.status === ResultStatus.SUCCESSFUL) {
      loadingItem.value = true;
      item.value.file = "";
      getCareFacility();
      loadingItem.value = false;
    } else {
      errors.value = result.data;
      loadingItem.value = false;
      item.value.file = "";
    }
  } else {
    item.value.offline_images.push(item.value.file);
    handleRemoveImage();
    emit("offline", item.value.offline_images);
  }
};

const deleteImage = async (signedId: string) => {
  api.setEndpoint(`care_facilities/${props.itemId}/images/${signedId}`);
  loadingItem.value = true;
  const result = await api.deleteItem("Bild erfolgreich gelöscht");
  if (result.status === ResultStatus.SUCCESSFUL) {
    loadingItem.value = false;
    getCareFacility();
  } else {
    errors.value = result.data;
    loadingItem.value = false;
  }
};

const deleteImageOffline = async (index: number) => {
  item.value.offline_images.splice(index, 1);
  emit("offline", item.value.offline_images);
};

watch(
  () => props.itemId,
  () => {
    if (!props.itemId) return;
    getCareFacility();
  }
);

onMounted(() => {
  if (!props.itemId) return;
  getCareFacility();
});
</script>
<style lang="sass">

.text-field .v-label
  font-size: 20px!important

.text-field input,
.text-field input
  padding-top: 10px!important

.close
  position: absolute
  top: -10px
  right: -10px
  cursor: pointer
</style>
