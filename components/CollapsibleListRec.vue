<template>
  <div class="collapsible-list">
    <draggable
      class="dragArea"
      tag="div"
      :list="items"
      :group="{ name: `layer-${layer}` }"
      item-key="name"
      :animation="150"
      @end="handleMove"
      :disabled="disableDraggable"
    >
      <template #item="{ element }">
        <div class="list-item" :id="element.id" v-auto-animate>
          <div class="title-bar" @click.stop="setExpandCategory(element.id)">
            <div class="title" v-auto-animate>
              <template v-if="openEdit !== element.id">
                <span
                  class="item-title"
                  :class="[
                    element.id === expandCategory && element.next ? 'font-weight-bold text-primary' : '',
                    disableDraggable && 'no-drag',
                  ]"
                  >{{ element.title }}
                  <v-icon v-if="element.next">mdi-arrow-down-right</v-icon></span
                >
              </template>
              <template v-else>
                <v-text-field @click.stop v-model="tempTitle" hide-details="auto" label="Titel" />
              </template>
            </div>
            <div class="additional" v-if="element.additionalData">
              <CollapsibleListAdditionalData
                :data="element.additionalData"
                :edit="openEdit === element.id"
                v-model="tempAdditionalData"
              />
            </div>
            <div v-if="!element.static" class="actions" v-auto-animate>
              <v-tooltip top v-if="openEdit !== element.id">
                <template v-slot:activator="{ props }">
                  <v-icon class="clickable" v-bind="props" @click.stop="editClick(element)">mdi-pencil</v-icon>
                </template>
                <span>Bearbeiten</span>
              </v-tooltip>
              <v-tooltip top v-else>
                <template v-slot:activator="{ props }">
                  <v-icon class="clickable" v-bind="props" @click.stop="editSaveClick(element)"
                    >mdi-content-save-outline</v-icon
                  >
                </template>
                <span>Speichern</span>
              </v-tooltip>
              <v-tooltip top v-if="openEdit !== element.id">
                <template v-slot:activator="{ props }">
                  <v-icon class="clickable" v-bind="props" @click.stop="deleteClick(element)">mdi-delete</v-icon>
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
          <div class="content" v-if="element.id === expandCategory && element.next">
            <CollapsibleListRec
              :items="element.next"
              :layer="layer + 1"
              @entry-click="
                (action, prevItems, originalStep, title, additional, specialType) =>
                  handleEmit(action, [...prevItems, element.id], originalStep, title, additional, specialType)
              "
              @edit-click="
                (action, prevItems, originalStep) => handleEditEmit(action, [...prevItems, element.id], originalStep)
              "
              @entry-moved="
                (relevantItems, originalStep, startIndex, endIndex) =>
                  handleMoveEmit(relevantItems, originalStep, startIndex, endIndex)
              "
              :disable-draggable="disableDraggable"
            />
            <div v-if="!openAddNew" @click.stop="handleClick(element.id)">
              <button>{{ element.addEntryButtonText || "Neuer Eintrag hinzufügen" }}</button>
            </div>
            <div v-if="openAddNew === element.id" class="tmp-item" @click.stop>
              <div class="title-bar">
                <div class="title">
                  <v-text-field v-model="tempTitle" hide-details="auto" label="Neuer Eintragstitel" />
                </div>
                <div v-if="element.canAddAdditionalData" class="additional">
                  <v-textarea
                    v-model="tempAdditionalData"
                    hide-details="auto"
                    label="Beschreibung"
                    :rules="[rules.length]"
                  />
                </div>

                <div class="actions">
                  <v-tooltip top>
                    <template v-slot:activator="{ props }">
                      <v-icon class="clickable" v-bind="props" @click.stop="save(element)"
                        >mdi-content-save-outline</v-icon
                      >
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
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import type { CollapsibleListItem, EmitAction } from "~/types/collapsibleList";
import { rules } from "~/data/validationRules";
import draggable from "vuedraggable";

const props = defineProps<{
  items: CollapsibleListItem[];
  layer: number;
  disableDraggable?: boolean;
}>();

const emit = defineEmits<{
  (
    event: "entryClick",
    action: EmitAction,
    itemIds: string[],
    layer: number,
    title?: string,
    additionalData?: string,
    specialType?: string,
  ): void;
  (event: "editClick", action: string, itemIds: string[], layer: number): void;
  (
    event: "entryMoved",
    itemsInCategory: CollapsibleListItem[],
    layer: number,
    startIndex: number,
    endIndex: number
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

const handleEmit = (action: EmitAction, itemIds: string[], layer: number, title?: string, additionalData?: string, specialType?: string) => {
  emit("entryClick", action, itemIds, layer, title, additionalData, specialType);
};

const handleEditEmit = (action: string, itemIds: string[], layer: number) => {
  emit("editClick", action, itemIds, layer);
};

const editClick = (item: CollapsibleListItem) => {
  if (item.specialActionOnEditClick) {
    handleEditEmit(item.specialActionOnEditClick, [item.id], props.layer);
    return;
  }

  openEdit.value = item.id;
  tempTitle.value = item.title;
};

const deleteClick = (item: CollapsibleListItem) => {
  discard();

  handleEmit("DELETE", [item.id], props.layer, null, null, item.specialType);
};

const editSaveClick = (item: CollapsibleListItem) => {
  handleEmit("EDIT", [item.id], props.layer, tempTitle.value, tempAdditionalData.value, item.specialType);

  openEdit.value = null;
  tempTitle.value = "";
  tempAdditionalData.value = "";
};

const save = (item: CollapsibleListItem) => {
  handleEmit("CREATE", [item.id], props.layer, tempTitle.value, tempAdditionalData.value, item.specialType);

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

const handleMoveEmit = (
  itemsInCategory: CollapsibleListItem[],
  layer: number,
  startIndex: number,
  endIndex: number
) => {
  emit("entryMoved", itemsInCategory, layer, startIndex, endIndex);
};

const handleMove = (e: { newIndex: number; oldIndex: number; item: HTMLDivElement; clone: HTMLDivElement }) => {
  handleMoveEmit(props.items, props.layer, e.oldIndex, e.newIndex);
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

.dragArea {
  cursor: pointer;
}

.item-title {
  user-select: none;
  &:not(.no-drag) {
    cursor: pointer;
  }
}

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
    padding: 1rem 0 1rem 1rem;

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
      margin-left: 5rem;
    }
  }
}
</style>
