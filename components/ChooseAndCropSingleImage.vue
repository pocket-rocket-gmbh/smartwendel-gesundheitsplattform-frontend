<template>
  <div class="field">
    <v-file-input
      hide-details="auto"
      v-model="image"
      :label="`${labelText} wählen`"
      filled
      prepend-icon="mdi-camera"
      @change="handleFile()"
      :rules="[rules.fileRequired]"
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

<script lang="ts">
import { rules } from "~/data/validationRules";

export default defineComponent({
  props: {
    preSetImageUrl: {
      type: String,
    },
    label: {
      type: String,
      default: "Logo",
    },
    aspectRatio: {
      type: Number,
    },
  },
  setup(props, { emit }) {
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

    const setImage = (image: any) => {
      imgUrl.value = null;
      croppedImage.value = image;
      emit("setImage", image);
    };

    return {
      image,
      imgUrl,
      errorFileSizeTooLarge,
      handleFile,
      croppedImage,
      setImage,
      labelText,
      aspectRatioValue,
      rules,
    };
  },
});
</script>

<style lang="sass" scoped>
.img-container
  max-width: 300px
</style>
