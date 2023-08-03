<template>
  <CreateEdit v-slot="slotProps" :size="800" :height="600">
    <v-card-text>
      <div class="field">
        <v-text-field
          v-model="slotProps.item.name"
          hide-details="auto"
          label="Bereichsbezeichnung"
          :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
        />
      </div>
    </v-card-text>

    <div class="pa-4 pt-0">
      <TextEditor v-model="slotProps.item.description" height="325px" />
    </div>
  </CreateEdit>
</template>
<script lang="ts" setup></script>
<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
</style>
