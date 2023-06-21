<template>
  <div class="collapsible-list">
    <div
      class="list-item clickable"
      v-for="item in items"
      v-auto-animate
      :key="item.id"
      @click.stop="setExpandCategory(item.id)"
    >
      <div class="title">
        <div>{{ item.title }}</div>
        <div class="additional" v-if="item.additionalData">
            <div v-if="item.additionalData.type === 'api'">
                {{ getAdditionalData(item) }}
            </div>
        </div>
      </div>
      <div class="content" v-if="item.id === expandCategory && item.next">
        <CollapsibleListRec
          :items="item.next"
          :layer="layer + 1"
          @add-entry-click="(prevItems, originalStep) => handleEmit([...prevItems, item.id], originalStep)"
        />
        <div class="content" @click.stop="handleClick(item.id)">
          <div class="title">
            <button>Neuer Eintrag hinzufügen</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CollapsibleListItem } from "~/types/collapsibleList";

const props = defineProps<{
  items: CollapsibleListItem[];
  layer: number;
}>();

const emit = defineEmits<{
  (event: "addEntryClick", itemIds: string[], layer: number): void;
}>();

const expandCategory = ref(null);

const setExpandCategory = (categoryId: string) => {
  if (categoryId === expandCategory.value) {
    expandCategory.value = null;
    return;
  }

  expandCategory.value = categoryId;
};

const log = console.log;

const handleClick = (itemId: string) => {
  handleEmit([itemId], props.layer);
};

const handleEmit = (itemIds: string[], layer: number) => {
  emit("addEntryClick", itemIds, layer);
};

const getAdditionalData = (item: CollapsibleListItem) => {
    if (!item.additionalData || item.additionalData.type !== "api") return;

    // item.additionalData.
}
</script>

<style lang="scss" scoped>
.collapsible-list {
  margin-top: 2rem;

  .clickable {
    cursor: pointer;
  }

  button {
    background-color: gray;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 2rem;

    &:hover {
      background-color: rgba(gray, 0.8);
    }
  }

  .list-item {
    border-top: 1px solid lightgray;
    padding: 1rem;

    &:not(:first-child) {
      border-top: 1px solid black;
    }
    padding: 1rem;

    .content {
      margin-left: 2rem;
    }
  }
}
</style>
