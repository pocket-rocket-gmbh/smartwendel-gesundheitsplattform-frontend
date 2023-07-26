<template>
  <div class="field">
    <v-file-input
      hide-details="auto"
      v-model="image"
      :label="`${labelText} wählen`"
      filled
      prepend-icon="mdi-camera"
      @change="handleFile()"
      @click:clear="removeFile()"
      :rules="[!!preSetImageUrl || !!tempImage || 'Erforderlich']"
      accept="image/*"
    />
    <div class="text-caption">* Maximal 5 MB, PNG/JPG/JPEG erlaubt</div>
    <div v-if="errorFileSizeTooLarge" class="text-caption text-error mt-3 mb-2">
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

  <div class="img-container" v-else-if="croppedImage">
    <img class="is-fullwidth" :src="croppedImage" />
  </div>
  <div class="img-container" v-else-if="preSetImageUrl">
    <img class="is-fullwidth" :src="preSetImageUrl" />
  </div>
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
  minSize: { type: Boolean, default: false },
  minWidth: { type: Number, default: 800 },
  minHeight: { type: Number, default: 450 },
});

const emit = defineEmits<{
  (event: "setImage", image: any): void;
}>();

const image = ref({}) as any;
const imgUrl = ref(null);
const aspectRatioValue = ref(props.aspectRatio);
const labelText = ref(props.label);
const errorFileSizeTooLarge = ref(false);
const croppedImage = ref(null);

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
</script>

<style lang="sass" scoped>
.img-container
  max-width: 300px
</style>
