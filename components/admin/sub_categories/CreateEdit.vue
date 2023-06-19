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

      <v-textarea
        v-model="slotProps.item.description"
        hide-details="auto"
        label="Beschreibung"
        :rules="[v => (v || '' ).length <= 160 || 'Die Beschreibung darf höchstens 160 Zeichen lang sein.']"
        :error-messages="useErrors().checkAndMapErrors('Beschreibung', slotProps.errors)"
        />

    </v-card-text>
  </CreateEdit>
</template>