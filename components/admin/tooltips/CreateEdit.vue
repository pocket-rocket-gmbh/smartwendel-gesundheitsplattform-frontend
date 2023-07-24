<template>
  <CreateEdit v-slot="slotProps" :height="400">
    <v-card-text class="mt-5">
        <div class="field">
          <v-text-field
            v-model="slotProps.item.name"
            hide-details="auto"
            label="Name"
            :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
          />
        </div>
        <div class="field">
          <v-text-field
            v-model="slotProps.item.content"
            hide-details="auto"
            label="Inhalt"
          />
        </div>
        <div class="field">
          <v-text-field
            v-model="slotProps.item.url"
            hide-details="auto"
            label="Link"
          />
        </div>
      </v-card-text>
  </CreateEdit>
</template>
<script lang="ts" setup>
  import { rules } from '../../../data/validationRules'

  const tooltipHasLink =  ref(false)

</script>
<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

</style>