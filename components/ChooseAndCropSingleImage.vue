<template>
  <v-row class="mb-10 mt-5">
    <v-col md="2" class="d-flex align-center justify-start">
      <v-btn
        size="large"
        class="px-5"
        :class="[openImageupload ? 'text-success' : '']"
        @click="
          openImageupload = !openImageupload;
          openPhotoGallery = false;
        "
        >Hochladen
      </v-btn>
    </v-col>
    <v-col md="2" class="d-flex align-center justify-start">
      <v-btn
        size="large"
        class="px-5"
        :class="[openPhotoGallery ? 'text-success' : '']"
        @click="
          openPhotoGallery = !openPhotoGallery;
          openImageupload = false;
        "
        >aus der Galerie
      </v-btn>
    </v-col>
  </v-row>
  <AdminCareFacilitiesChooseimageFromGallery
    v-if="openPhotoGallery && kind ==='logo'"
    :item="item"
    gallery-kind="logo"
    @setImage="setLogo"
  />
  <AdminCareFacilitiesChooseimageFromGallery
    v-if="openPhotoGallery && kind ==='cover'"
    :facility-kind="item.kind"
    :item="item"
    gallery-kind="cover"
    @setImage="setCoverBild"
  />
  <div class="field">
    <v-file-input
      v-if="!openPhotoGallery && openImageupload"
      class="text-field"
      hide-details="auto"
      v-model="image"
      :label="`${labelText} ${tempImage || preSetImageUrl ? 'aktualisieren' : 'wählen'}`"
      filled
      prepend-icon="mdi-camera"
      @change="handleFile()"
      @click:clear="removeFile()"
      :rules="[isImageSet()]"
      accept="image/*"
    />
    <div class="text-caption" v-if="!openPhotoGallery && openImageupload">
      * Maximal 5 MB, PNG/JPG/JPEG erlaubt
    </div>
    <div
      v-if="errorFileSizeTooLarge && openPhotoGallery"
      class="text-caption text-error mt-3 mb-2"
    >
      Das gewählte Bild ist zu groß. Es darf eine Größe von 5MB nicht überschreiten.
    </div>
  </div>
  <ImageCropper
    v-if="imgUrl"
    :aspect-ratio="aspectRatioValue"
    :imgUrl="imgUrl"
    :min-size="minSize"
    :min-width="minWidth"
    :min-height="minHeight"
    @close="
      imgUrl = null;
      image = {};
    "
    @crop="setImage"
  />
  <template v-else-if="croppedImage || tempImage || preSetImageUrl">
    <v-row>
      <v-col md="1" class="d-flex align-center justify-center">
        <span>Bereits ausgewählt:</span>
      </v-col>
      <v-col>
        <v-card max-width="200">
          <div>
            <v-img v-if="croppedImage" :src="croppedImage" max-width="200" />
            <v-img v-else-if="tempImage" :src="tempImage" max-width="200" />
            <v-img v-else-if="preSetImageUrl" :src="preSetImageUrl" max-width="200" />
          </div>
          <div class="d-flex align-center">
            <v-btn size="small" width="100%" color="red" @click="deleteImage"
              >Bild entfernen</v-btn
            >
          </div>
        </v-card>
      </v-col>
    </v-row>
  </template>
</template>

<script setup lang="ts">
const props = defineProps({
  preSetImageUrl: {
    type: String,
  },
  tempImage: {
    type: String,
    required: false,
  },
  label: {
    type: String,
    default: "Logo",
  },
  aspectRatio: {
    type: Number,
  },
  item: {
    type: Object,
    required: true,
  },
  kind: {
    type: String,
    required: true,
  },
  minSize: { type: Boolean, default: false },
  minWidth: { type: Number, default: 800 },
  minHeight: { type: Number, default: 450 },
});

const openPhotoGallery = ref(false);
const openImageupload = ref(false);

const emit = defineEmits<{
  (event: "setImage", image: any): void;
  (event: "deleteImage"): void;
}>();

const setCoverBild = (image: any) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "file",
    value: image,
  });
};

const setLogo = (image: any) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "logo",
    value: image,
  });
};

const image = ref({}) as any;
const imgUrl = ref(null);
const aspectRatioValue = ref(props.aspectRatio);
const labelText = ref(props.label);
const errorFileSizeTooLarge = ref(false);
const croppedImage = ref(null);

const isImageSet = () => {
  return !!props.preSetImageUrl || !!props.tempImage || "Erforderlich";
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
    return;
  }
};

const removeFile = () => {
  imgUrl.value = null;
  croppedImage.value = null;
  emit("setImage", null);
};

const setImage = (image: any) => {
  imgUrl.value = null;
  croppedImage.value = image;
  emit("setImage", image);
};

const deleteImage = () => {
  emit("deleteImage");
  removeFile();
};
</script>

<style lang="sass" scoped>
.img-container
  max-width: 300px

.text-field .v-label
  font-size: 20px!important

.text-field input,
.text-field input
  padding-top: 10px!important
</style>
