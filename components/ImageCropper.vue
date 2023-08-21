<template>
  <v-card>
    <v-alert
      v-if="selectedImageTooSmall"
      type="warning"
      :text="`Die Auflösung des ausgewählten Bildes ist zu gering (Mindestens ${minWidth}x${minHeight}px - Hier: ${originalSize.width}x${originalSize.height})`"
    ></v-alert>
    <v-alert
      v-if="!selectedImageTooSmall && croppedImageTooSmall"
      type="warning"
      :text="`Die Auflösung des zugeschnittenen Bildes ist zu gering (Mindestens ${minWidth}x${minHeight}px - Hier: ${croppedSize.width}x${croppedSize.height})`"
    ></v-alert>
    <Cropper
      class="cropper"
      :src="imgUrl"
      :stencil-props="{
        aspectRatio: aspectRatio,
      }"
      @change="onChange"
      :auto-zoom="true"
      :imageRestriction="'none'"
    />
    <v-card-actions>
      <v-btn @click="emitClose()"> Bild verwerfen </v-btn>
      <v-btn color="blue darken-1" dark :disabled="selectedImageTooSmall || croppedImageTooSmall" @click="crop()">
        {{ cta }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

type ImageSize = {
  width: number;
  height: number;
};

type CropperUpdate = {
  canvas: HTMLCanvasElement;
  image: ImageSize;
};

const props = defineProps({
  imgUrl: { type: String },
  cta: { type: String, default: "Ausschneiden" },
  aspectRatio: { type: Number, default: 16 / 9 },
  minSize: { type: Boolean, default: false },
  minWidth: { type: Number, default: 800 },
  minHeight: { type: Number, default: 450 },
});

const emit = defineEmits(["close", "crop"]);

const image = ref("");
const originalSize = ref<ImageSize>({ width: -1, height: -1 });
const croppedSize = ref<ImageSize>({ width: -1, height: -1 });

const selectedImageTooSmall = computed(() => {
  if (originalSize.value.width === -1 || originalSize.value.height === -1) return false;

  if (!props.minSize) return false;

  return originalSize.value.width < props.minWidth || originalSize.value.height < props.minHeight;
});

const croppedImageTooSmall = computed(() => {
  if (croppedSize.value.width === -1 || croppedSize.value.height === -1) return false;

  if (!props.minSize) return false;

  return croppedSize.value.width < props.minWidth || croppedSize.value.height < props.minHeight;
});

const onChange = ({ canvas, image: originalImage }: CropperUpdate) => {
  croppedSize.value = {
    width: canvas.width,
    height: canvas.height,
  };
  originalSize.value = {
    width: originalImage.width,
    height: originalImage.height,
  };
  image.value = canvas.toDataURL();
};

const crop = () => {
  emit("crop", image.value);
};

const emitClose = () => {
  emit("close");
};
</script>

<style lang="sass">
.cropper
  width: 100%
  max-height: 500px

.vue-advanced-cropper__background
  background-color: #eee
  background-image: linear-gradient(45deg, black 25%, transparent 25%, transparent 75%, black 75%, black), linear-gradient(45deg, black 25%, transparent 25%, transparent 75%, black 75%, black)
  background-size: 60px 60px
  background-position: 0 0, 30px 30px
  opacity: .1
</style>
