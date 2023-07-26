<template>
  <div>
    <Loading v-if="loadingItem" />
    <div class="field mt-3">
      <v-file-input
        :disabled="item?.sanitized_images.length >= 6"
        hide-details="auto"
        v-model="image"
        label="Neues Bild wählen"
        filled
        prepend-icon="mdi-camera"
        @change="handleFile()"
        accept="image/*"
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
      v-if="imgUrl"
      :imgUrl="imgUrl"
      cta="Bild speichern"
      @close="
        imgUrl = null;
        image = {};
      "
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
const emit = defineEmits(["offline"]);
const props = defineProps({
  itemId: {
    type: String,
    required: true,
  },
});
const loadingItem = ref(false);
const imgUrl = ref(null);
const errors = ref([]);
const image = ref({});
const errorFileSizeTooLarge = ref(false);
const item = ref({
  sanitized_images: [],
  offline_images: [],
  file: "",
});

const setImage = (image: any) => {
  imgUrl.value = null;
  item.value.file = image;
  save();
};

const toBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const handleFile = async () => {
  if (image && image.value[0] && image.value[0].size / 1000000 > 5) {
    errorFileSizeTooLarge.value = true;
    image.value = {};
    return;
  } else if (image && image.value[0]) {
    errorFileSizeTooLarge.value = false;
    imgUrl.value = await toBase64(image.value[0]);
  }
};

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());

const getCareFacility = async () => {
  api.setEndpoint(`care_facilities/${props.itemId}`);
  loadingItem.value = true;
  await api.getItem();
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
    imgUrl.value = null;

    if (result.status === ResultStatus.SUCCESSFUL) {
      loadingItem.value = true;
      item.value.file = "";
      image.value = {};
      getCareFacility();
      loadingItem.value = false;
    } else {
      errors.value = result.data;
      loadingItem.value = false;
      item.value.file = "";
    }
  } else {
    item.value.offline_images.push(item.value.file);
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
.close
  position: absolute
  top: -10px
  right: -10px
  cursor: pointer
</style>
