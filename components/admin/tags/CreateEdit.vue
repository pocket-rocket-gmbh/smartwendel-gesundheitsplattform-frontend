<template>
  <CreateEdit v-slot="slotProps" v-bind="{ ...$props }">
    <v-card-text>
      <div class="field">
        <v-text-field
          v-model="slotProps.item.name"
          hide-details="auto"
          label="Bezeichnung"
          :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
        />
        <!-- <v-text-field
          v-model="slotProps.item.kind"
          hide-details="auto"
          label="Art"
        /> -->
      </div>
    </v-card-text>
  </CreateEdit>
</template>

<script setup lang="ts">
import { Facility, FilterKind } from "~/store/searchFilter";

const props = defineProps<{
  itemId: string;
  itemPlaceholder: Partial<Facility>;
  endpoint: string;
  conceptName: string;
}>();
</script>
