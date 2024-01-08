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
        <v-text-field v-model="slotProps.item.filter_type" hide-details="auto" label="Art" />
      </div>
    </v-card-text>
    {{ setKind(slotProps) }}
  </CreateEdit>
</template>

<script setup lang="ts">
import { type Facility, type FilterKind } from "~/store/searchFilter";
const setKind = (slotProps: any) => {
  slotProps.item.filter_type = "filter_service";
};

const props = defineProps<{
  itemId: string;
  itemPlaceholder: Partial<Facility>;
  endpoint: string;
  conceptName: string;
}>();
</script>
