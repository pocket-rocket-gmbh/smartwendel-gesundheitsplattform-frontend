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
      <TextEditor
        :item-id="slotProps.item.id"
        :value="slotProps.item.description" 
        :description="slotProps.item.description"
        :endpoint="`categories`"
      />
      <div class="field">
        <v-combobox
          v-model="slotProps.item.tags"
          chips
          multiple
          label="Tags"
        />
      </div>
      <ChooseAndCropSingleImage
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
<script lang="ts">
export default defineComponent({
  setup() {
    const setLogo = (image:any) => {
      useNuxtApp().$bus.$emit('setPayloadFromSlotChild', { name: 'logo', value: image })
    }

    return {
      setLogo
    }
  }
})
</script>
