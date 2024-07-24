<template>
  <CreateEdit v-slot="slotProps" :size="800" :height="700" :is-category="true">
    <v-card-text>
      <div class="field mt-5">
        <v-text-field
          v-model="slotProps.item.name"
          hide-details="auto"
          label="Bereichsbezeichnung"
          :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
        />
      </div>
    </v-card-text>
    <div class="pa-4 pt-0 mb-4">
      <TextEditor v-model="slotProps.item.description" height="380px" />
    </div>
  </CreateEdit>
</template>
<script lang="ts" setup></script>
<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
</style>
