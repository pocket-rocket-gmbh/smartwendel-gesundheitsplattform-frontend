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

      <div class="field">
        <v-combobox
          v-model="slotProps.item.tags"
          chips
          multiple
          label="Tags"
        />
      </div>
    </v-card-text>
  </CreateEdit>
</template>