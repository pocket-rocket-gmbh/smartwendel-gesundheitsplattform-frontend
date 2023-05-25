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
      <TextEditor v-model="slotProps.item.description" />
    </v-card-text>
  </CreateEdit>
</template>