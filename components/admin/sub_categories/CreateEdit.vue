<template>
  <CreateEdit v-slot="slotProps" :size="800" :height="600">
    <v-card-text>
      <div class="field">
        <v-text-field
          v-model="slotProps.item.name"
          hide-details="auto"
          label="Name"
          :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
        />
      </div>
      <div class="field">
        <v-textarea
          v-model="slotProps.item.description"
          hide-details="auto"
          label="Beschreibung"
          :rules="rules.length"
          :error-messages="useErrors().checkAndMapErrors('Beschreibung', slotProps.errors)"
          />
      </div>
    </v-card-text>
  </CreateEdit>
</template>
<script lang="ts" setup>
  import { rules } from '../../../data/validationRules'

</script>
<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

</style>