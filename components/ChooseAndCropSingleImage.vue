<template>
  <v-row
    class="mb-10 mt-5"
    v-if="kind !== 'category'"
  >
    <v-col
      md="2"
      class="d-flex align-center justify-start"
    >
      <v-btn
        size="large"
        class="px-5"
        :class="[openImageupload ? 'text-success' : '']"
        @click="
          openImageupload = !openImageupload;
          openPhotoGallery = false;
        "
      >
        <span class="general-font-size is-dark-grey"> Hochladen </span>
      </v-btn>
    </v-col>
    <v-col
      md="2"
      class="d-flex align-center justify-start"
    >
      <v-btn
        size="large"
        class="px-5"
        :class="[openPhotoGallery ? 'text-success' : '']"
        @click="
          openPhotoGallery = !openPhotoGallery;
          openImageupload = false;
        "
      >
        <span class="general-font-size is-dark-grey"> aus der Galerie </span>
      </v-btn>
    </v-col>
  </v-row>
  <AdminCareFacilitiesChooseimageFromGallery
    v-show="openPhotoGallery && kind === 'logo'"
    :item="item"
    gallery-kind="logo"
    @setImage="setLogo"
  />
  <AdminCareFacilitiesChooseimageFromGallery
    v-show="openPhotoGallery && kind === 'cover'"
    :facility-kind="item.kind"
    :item="item"
    gallery-kind="cover"
    @setImage="setCoverBild"
  />

  <div class="field">
    <v-file-input
      v-if="(!openPhotoGallery && openImageupload) || kind === 'category'"
      v-model="image"
      accept="image/*"
      hide-details="auto"
      :label="`${labelText} ${tempImage || preSetImageUrl ? 'aktualisieren' : 'wählen'}`"
      prepend-icon="mdi-camera"
      @change="handleFile()"
      @click:clear="removeFile"
      :rules="[isImageSet()]"
      class="text-field my-3 general-font-size is-dark-grey"
    />
    <div
      class="text-caption is-dark-grey"
      v-if="!openPhotoGallery && openImageupload"
    >
      * Maximal 5 MB, SVG/PNG/JPG/JPEG erlaubt
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
    cta="Bild speichern"
    @close="
      imgUrl = null;
      image = [];
    "
    @crop="setImage"
  />
  <template v-else-if="croppedImage || tempImage || preSetImageUrl">
    <v-row class="my-1">
      <v-col
        md="2"
        class="d-flex align-center justify-center"
      >
        <span class="general-font-size is-dark-grey">Bereits ausgewählt:</span>
      </v-col>
      <v-col>
        <v-card max-width="200">
          <div>
            <v-img
              v-if="tempImage"
              :src="tempImage"
              max-width="200"
            />
            <v-img
              v-else-if="croppedImage"
              :src="croppedImage"
              max-width="200"
            />
            <v-img
              v-else-if="preSetImageUrl"
              :src="preSetImageUrl"
              max-width="200"
            />
          </div>
          <div class="d-flex align-center">
            <v-btn
              size="small"
              width="100%"
              color="red"
              @click="deleteImage"
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

const image = ref<File | null>(null); // Treat image as a single File or null
const imgUrl = ref<string | null>(null);
const aspectRatioValue = ref(props.aspectRatio);
const labelText = ref(props.label);
const errorFileSizeTooLarge = ref(false);
const croppedImage = ref<string | null>(null);

const isImageSet = () => {
  return !!props.preSetImageUrl || !!props.tempImage || "Pflichtangabe";
};

const handleFile = async () => {
  if (image.value) {
    const file = image.value; // Now image.value is directly the file object
    if (file.size / 1000000 > 5) {
      errorFileSizeTooLarge.value = true;
      image.value = null; // Set to null instead of empty array
      console.log("File too large:", file);
    } else {
      errorFileSizeTooLarge.value = false;
      imgUrl.value = await toBase64(file);
    }
  }
};

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });

const removeFile = () => {
  imgUrl.value = null;
  croppedImage.value = null;
  image.value = null; // Set to null instead of []
  emit("setImage", null);
};

const setImage = (croppedImg: string) => {
  imgUrl.value = null;
  croppedImage.value = croppedImg;
  emit("setImage", croppedImg);
};

const deleteImage = () => {
  emit("deleteImage");
  removeFile();
};
</script>

<style lang="sass" scoped>
.img-container
  max-width: 300px
</style>
