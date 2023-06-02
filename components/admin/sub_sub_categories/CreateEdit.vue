<template>
  <CreateEdit v-slot="slotProps" :size="900" :height="900">
    <v-card-text>
      <div class="field">
        <v-text-field
          v-model="slotProps.item.name"
          hide-details="auto"
          label="Name"
          :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
        />
      </div>
      <TextEditor v-model="slotProps.item.description" />
      <div class="field">
        <v-combobox
          v-model="slotProps.item.tags"
          chips
          multiple
          label="Tags"
        />
      </div>
      <ChooseAndCropSingleImage
        :aspect-ratio="1/1"
        class="field"
        label="Bild"
        :pre-set-image-url="slotProps.item.image_url"
        @setImage="setLogo"
      />
      <div class="field mb-15">
        <v-text-field
          v-model="slotProps.item.url"
          hide-details="auto"
          label="Url"
          :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
        />
      </div>
    </v-card-text>
    
  </CreateEdit>
</template>
<script lang="ts" setup>
const setLogo = (image:any) => {
  useNuxtApp().$bus.$emit('setPayloadFromSlotChild', { name: 'file', value: image })
}
</script>
