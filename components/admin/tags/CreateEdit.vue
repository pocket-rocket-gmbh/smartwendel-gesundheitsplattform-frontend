<template>
  <CreateEdit v-slot="slotProps">
    <v-card-text>
      <div class="field">
        <v-text-field
          v-model="slotProps.item.name"
          hide-details="auto"
          label="Bezeichnung"
          :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
        />
        <v-text-field
          v-model="slotProps.item.kind"
          hide-details="auto"
          label="Art"
        />
      </div>
    </v-card-text>
    {{ setKind(slotProps) }}
  </CreateEdit>
</template>

<script setup lang="ts">
const setKind = (slotProps: any) => {
  slotProps.item.kind = 'facility'
}
</script>