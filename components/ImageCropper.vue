<template>
  <v-card>
    <cropper
      class="cropper"
      :src="imgUrl"
      :stencil-props="{
        aspectRatio: aspectRatio
      }"
      @change="onChange"      
    />
    <v-card-actions>
      <v-btn
        text
        @click="emitClose()"
      >
        Bild verwerfen
      </v-btn>
      <v-btn
        color="blue darken-1"
        dark
        text
        @click="crop()"
      >
        {{ cta }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

export default defineComponent({
  components: { Cropper },
  props: {
    imgUrl: { type: String },
    cta: { type: String, default: 'Ausschneiden' },
    aspectRatio: { type: Number, default: 16/9 }
  },

  emits: ['close', 'crop'],
  setup(props, { emit }) {
    const image = ref("")

    const onChange = ({ canvas }) => {
			image.value = canvas.toDataURL()
		}

    const crop = () => {
      emit('crop', image.value)
    }

    const emitClose = () => {
      emit('close')
    }

    return {
      onChange,
      image,
      crop,
      emitClose
    }
  }
})
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