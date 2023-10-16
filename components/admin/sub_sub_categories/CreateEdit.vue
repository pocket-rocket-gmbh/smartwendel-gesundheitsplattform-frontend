<template>
  <CreateEdit v-slot="slotProps" :size="900" :height="800">
    <v-card-text class="my-3 mt-5">
      <div class="field mb-5">
        <v-text-field
          v-model="slotProps.item.name"
          hide-details="auto"
          label="Bezeichnung"
          :rules="[rules.required]"
          :error-messages="
            useErrors().checkAndMapErrors('name', slotProps.errors)
          "
        />
      </div>
      <div class="field mb-5">
        <v-textarea
          counter
          maxlength="300"
          v-model="slotProps.item.description"
          hide-details="auto"
          label="Beschreibung"
          :rules="[rules.length]"
          :error-messages="
            useErrors().checkAndMapErrors('Beschreibung', slotProps.errors)
          "
        />
      </div>
      <div class="field mb-5">
        <v-combobox v-model="slotProps.item.tags" chips multiple label="Tags" />
      </div>
      <ChooseAndCropSingleImage
        :item="slotProps.item"
        kind="category"
        :aspect-ratio="1 / 1"
        class="field mt-10"
        label="Bild"
        :pre-set-image-url="slotProps.item.image_url || slotProps.item.file"
        @setImage="setLogo"
      />
      <div class="field mb-5" v-if="useUser().isAdmin()">
        <div>
          <v-select
            hide-details="auto"
            v-model="slotProps.item.url_kind"
            :items="status"
            item-title="name"
            item-value="id"
            label="type"
            single-line
          />
        </div>
      </div>

      <v-alert
        v-if="slotProps.item.url_kind === 'internal'"
        type="info"
        density="compact"
        closable
        class="mb-5"
      >
        "bitte z.B.:
        "/public/categories/95bd1f21-800a-47a6-bb0c-afba56f33619?sub_category_id=d41393e1-20f2-4fee-8872-c275201dd26d"
      </v-alert>

      <div class="field mb-5">
        <v-text-field
          v-if="slotProps.item.url_kind === 'external'"
          v-model="slotProps.item.url"
          hide-details="auto"
          label="Url"
          
          :rules="[rules.isUrl]"
          :error-messages="
            useErrors().checkAndMapErrors('name', slotProps.errors)
          "
        /><v-text-field
          v-else
          v-model="slotProps.item.url"
          hide-details="auto"
          label="Url"
          :rules="[rules.required]"
          :error-messages="
            useErrors().checkAndMapErrors('name', slotProps.errors)
          "
        />
      </div>
      <div class="field mb-5">
        <v-text-field
          v-model="slotProps.item.button_text"
          hide-details="auto"
          label="Button Text"
          :rules="[rules.required]"
          :error-messages="
            useErrors().checkAndMapErrors('name', slotProps.errors)
          "
        />
      </div>
    </v-card-text>
  </CreateEdit>
</template>
<script lang="ts" setup>
import { rules } from "../../../data/validationRules";
const status = ref([
  { name: "external", id: "external" },
  { name: "internal", id: "internal" },
]);
const setLogo = (image: any) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "file",
    value: image,
  });
};
</script>
