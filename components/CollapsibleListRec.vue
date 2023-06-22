<template>
  <div class="collapsible-list">
    <div
      class="list-item"
      v-for="item in items"
      v-auto-animate
      :key="item.id"
      :class="[item.next ? 'clickable' : 'not-clickable']"
      @click.stop="setExpandCategory(item.id)"
    >
      <div class="title-bar">
        <div class="title" v-auto-animate>
          <template v-if="openEdit !== item.id">
            {{ item.title }}
          </template>
          <template v-else>
            <v-text-field @click.stop v-model="tempTitle" hide-details="auto" label="Titel" />
          </template>
        </div>
        <div class="additional" v-if="item.additionalData">
          <CollapsibleListAdditionalData
            :data="item.additionalData"
            :edit="openEdit === item.id"
            v-model="tempAdditionalData"
          />
        </div>
        <div class="actions" v-auto-animate>
          <v-tooltip top v-if="openEdit !== item.id">
            <template v-slot:activator="{ props }">
              <v-icon class="clickable" v-bind="props" @click.stop="editClick(item)">mdi-pencil</v-icon>
            </template>
            <span>Bearbeiten</span>
          </v-tooltip>
          <v-tooltip top v-else>
            <template v-slot:activator="{ props }">
              <v-icon class="clickable" v-bind="props" @click.stop="editSaveClick(item)"
                >mdi-content-save-outline</v-icon
              >
            </template>
            <span>Speichern</span>
          </v-tooltip>
          <v-tooltip top v-if="openEdit !== item.id">
            <template v-slot:activator="{ props }">
              <v-icon class="clickable" v-bind="props" @click.stop="deleteClick(item)">mdi-delete</v-icon>
            </template>
            <span>Löschen</span>
          </v-tooltip>
          <v-tooltip top v-else>
            <template v-slot:activator="{ props }">
              <v-icon class="clickable" v-bind="props" @click.stop="discard">mdi-file-undo</v-icon>
            </template>
            <span>Verwerfen</span>
          </v-tooltip>
        </div>
      </div>
      <div class="content" v-if="item.id === expandCategory && item.next" v-auto-animate>
        <CollapsibleListRec
          :items="item.next"
          :layer="layer + 1"
          @entry-click="
            (action, prevItems, originalStep, title, additional) =>
              handleEmit(action, [...prevItems, item.id], originalStep, title, additional)
          "
        />
        <div v-if="!openAddNew" @click.stop="handleClick(item.id)">
          <button>{{ item.addEntryButtonText || "Neuer Eintrag hinzufügen" }}</button>
        </div>
        <div v-if="openAddNew === item.id" class="tmp-item" @click.stop>
          <div class="title-bar">
            <div class="title">
              <v-text-field v-model="tempTitle" hide-details="auto" label="Neuer Eintragstitel" />
            </div>
            <div v-if="!item.canAddAdditionalData" class="additional">
              <v-textarea
                v-model="tempAdditionalData"
                hide-details="auto"
                label="Beschreibung"
                :rules="[(v) => (v || '').length <= 160 || 'Die Beschreibung darf höchstens 160 Zeichen lang sein.']"
              />
            </div>

            <div class="actions">
              <v-tooltip top>
                <template v-slot:activator="{ props }">
                  <v-icon class="clickable" v-bind="props" @click.stop="save(item.id)">mdi-content-save-outline</v-icon>
                </template>
                <span>Speichern</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ props }">
                  <v-icon class="clickable" v-bind="props" @click.stop="discard">mdi-file-undo</v-icon>
                </template>
                <span>Verwerfen</span>
              </v-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CollapsibleListItem, EmitAction } from "~/types/collapsibleList";

const props = defineProps<{
  items: CollapsibleListItem[];
  layer: number;
}>();

const emit = defineEmits<{
  (
    event: "entryClick",
    action: EmitAction,
    itemIds: string[],
    layer: number,
    title?: string,
    additionalData?: string
  ): void;
}>();

const expandCategory = ref(null);

const openEdit = ref<string>(null);
const openAddNew = ref<string>(null);
const tempTitle = ref("");
const tempAdditionalData = ref("");

const setExpandCategory = (categoryId: string) => {
  openEdit.value = null;
  openAddNew.value = null;
  tempTitle.value = "";
  tempAdditionalData.value = "";

  if (categoryId === expandCategory.value) {
    expandCategory.value = null;
    return;
  }

  expandCategory.value = categoryId;
};

const handleClick = (itemId: string) => {
  openAddNew.value = itemId;
};

const handleEmit = (action: EmitAction, itemIds: string[], layer: number, title?: string, additionalData?: string) => {
  emit("entryClick", action, itemIds, layer, title, additionalData);
};

const editClick = (item: CollapsibleListItem) => {
  openEdit.value = item.id;
  tempTitle.value = item.title;
};

const deleteClick = (item: CollapsibleListItem) => {
  discard();

  handleEmit("DELETE", [item.id], props.layer);
};

const editSaveClick = (item: CollapsibleListItem) => {
  handleEmit("EDIT", [item.id], props.layer, tempTitle.value, tempAdditionalData.value);

  openEdit.value = null;
  tempTitle.value = "";
  tempAdditionalData.value = "";
};

const save = (itemId: string) => {
  handleEmit("CREATE", [itemId], props.layer, tempTitle.value, tempAdditionalData.value);

  openAddNew.value = null;
  tempTitle.value = "";
  tempAdditionalData.value = "";
};

const discard = () => {
  openAddNew.value = null;
  openEdit.value = null;
  tempTitle.value = "";
  tempAdditionalData.value = "";
};
</script>

<style lang="scss" scoped>
.collapsible-list {
  margin-top: 2rem;

  .clickable {
    cursor: pointer;
  }

  .not-clickable {
    cursor: default;
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

    .title-bar {
      display: flex;
      gap: 2rem;

      .actions {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      .title {
        flex: 1;
      }

      .additional {
        flex: 2;
      }
    }

    .content {
      margin-left: 2rem;
    }
  }
}
</style>
