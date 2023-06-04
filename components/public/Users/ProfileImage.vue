<template>
  <v-row justify="end">
    <v-col
    cols="12"
    sm="12"
    md="12"
    >
    <v-file-input
      v-if="!presetImage"
      label="Bild auswählen"
      v-model="image"
      variant="filled"
      prepend-icon="mdi-camera"
      @change="handleFile()"
      @click:clear="(presetImage = presetImageUrl)"
    />
    <ImageCropper
      v-if="imgUrl"
      :imgUrl="imgUrl"
      cta="Bild benutzen"
      :aspect-ratio="1"
      @close="imgUrl = null; image = {}"
      @crop="setImage"
    />
    <div v-else-if="presetImage" >
      <img
        :src="presetImage"
        class="is-rounded profile-img"
        height="200"
        border
      />
      <div>
        <v-btn 
          class="button is-red is-rounded ma-3"
          @click="purgeImage()"
          >
          Bild löschen
        </v-btn>
      </div>
    </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  emits: ['setImage', 'purgeImage'],
  props: {
    presetImageUrl: String
  },
  setup (props, { emit }) {

    const image = ref({})
    const imgUrl = ref(null)
    const presetImage = ref(null)

    const setImage = (image:any) => {
      imgUrl.value = null
      presetImage.value = image
      emit('setImage', image)
    }

    const purgeImage = () => {
      presetImage.value = null
      emit('purgeImage')
    }

    const toBase64 = (file:any) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

    const handleFile = async () => {
      imgUrl.value = await toBase64(image.value[0])
    }

    // watch(props.presetImageUrl, () => {
    //   if (props.presetImageUrl) {
    //     presetImage.value = props.presetImageUrl
    //   }
    // })

    watch(() => props.presetImageUrl, (first, second) => {
      if (first) {
        presetImage.value = first
      }
    })

    return {
      handleFile,
      image,
      imgUrl,
      setImage,
      presetImage,
      purgeImage,
    }
  }
})
</script>

<style lang="sass" scoped>


</style>