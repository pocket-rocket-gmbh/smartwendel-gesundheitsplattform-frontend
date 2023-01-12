<template>
  <CreateEdit v-slot="slotProps">
    <v-card-text>
      <div class="field">
        <v-text-field
          v-model="slotProps.item.name"
          hide-details="auto"
          label="Name"
          :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
        />
      </div>
    </v-card-text>
  </CreateEdit>
</template>