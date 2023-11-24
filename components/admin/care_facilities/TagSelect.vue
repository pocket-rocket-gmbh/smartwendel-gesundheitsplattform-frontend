<template>
  <v-checkbox
    v-if="kind !== 'facility' && kind !== 'course'"
    v-show="false"
    v-bind:model-value="!!preSetTags.length"
    :rules="[!!preSetTags.length || 'Pflichtangabe']"
  ></v-checkbox>
  <CollapsibleItem
    class="tag-select mt-10"
    id="tag-select"
    :expand="expand"
    @expand-toggled="handleExpandToggled"
  >
    <template #title>
      <div
        class="d-flex align-center"
        :class="[handleExpandToggled ? 'text-h5' : 'text-h6']"
      >
        <div v-if="kind === 'facility'">Branchenspezifisches Leistungsangebot</div>
        <div v-if="kind === 'news'">Stich- und Schlagwörter zum Newsbeitrag</div>
        <div v-if="kind === 'event'">Veranstaltungsangebot</div>
        <div v-if="kind === 'course'">Kursspezifische Leistungsangebote</div>
        <div class="has-font-size-small-medium ml-3">
          <v-tooltip location="top" width="300px">
            <template v-slot:activator="{ props }">
              <v-icon class="help-tooltip" v-bind="props">mdi-information-outline</v-icon>
            </template>
            <span v-if="kind === 'facility'">
              Trage Begriffe ein, die dein individuelles Angebot möglichst präzise
              beschreiben (z. B. „Kurzzeitpflege“, „Betreutes Wohnen“ und „Demenz“, wenn
              es sich um eine Pflegeinrichtung oder „Yoga“, „Les Mills“ und
              „Krafttraining“, wenn es sich um ein Fitnessstudio handelt). Auf diese Weise
              gelangen Besucherinnen und Besucher zu deinem Profil, sobald sie nach den
              entsprechenden Schlagwörtern suchen.
            </span>
            <span v-if="kind === 'course'"
              >Trage Begriffe ein, die den Inhalt des Kurses möglichst präzise beschreiben
              (z. B. „Yoga“, „Rückenbeschwerden“, „Beweglichkeit“). Auf diese Weise
              gelangen Besucherinnen und Besucher zu deinem Kursprofil, sobald sie nach
              den entsprechenden Schlagwörtern suchen.
            </span>
            <span v-if="kind === 'event'"
              >„Überlege dir, welche Begriffe den Inhalt deiner Veranstaltung am
              treffendsten wiedergeben. Trage bspw. den Titel „Fit in der Region“, die
              Ziele („Gesundheit fördern“) und die Angebote („Gesundheits-Checks“) deiner
              Veranstaltung ein.
            </span>
            <span v-if="kind === 'news'">
              Besucherinnen und Besucher gelangen zu deinem Newsartikel/Beitrag, wenn sie
              die entsprechenden Schlagwörter suchen.
            </span>
          </v-tooltip>
        </div>
      </div>
      <div v-if="!expand" class="mt-3">
        <span v-if="preSetTags.length">Bereits ausgewählt:</span>
        <v-chip v-for="tag in preSetTags" :key="tag.id" class="mx-2">
          {{ tag.name }}
        </v-chip>
      </div>
    </template>
    <template #content>
      <div class="content text-h6">
        <div v-if="kind === 'facility'">
          Bitte beschreibe ganz konkret mit Schlagwörtern dein spezifisches Angebot.
        </div>
        <div v-if="kind === 'course'">
          Hier hast du die Möglichkeit, deinen Kursinhalt mit Hilfe von Schlagwörtern
          individuell zu beschreiben.
        </div>
        <div v-if="kind === 'event'">
          Hier hast du die Möglichkeit, deine Veranstaltung mit Hilfe von Schlagwörtern
          individuell zu beschreiben.
        </div>
        <div v-if="preSetTags?.length" class="tags my-6">
          <span class="font-weight-bold">Bereits ausgewählt:</span>
          <v-chip
            v-for="tag in preSetTags"
            closable
            @click:close="handleRemoveTag(tag)"
            :key="tag.id"
          >
            {{ tag.name }}
          </v-chip>
        </div>
        <div class="inputs my-5">
          <v-combobox
            v-model="currentTag"
            v-model:search="currentTagSearch"
            :hide-no-data="false"
            :items="allTagsWithoutSelected"
            hide-selected
            :label="placeHolder"
            persistent-hint
            small-chips
            :return-object="true"
            :item-title="'name'"
            :item-value="'id'"
            hide-details="auto"
            v-on:keyup.enter="handleAddTag"
            menu-icon=""
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-title v-if="currentTagSearch.length <= 2">
                  Bitte mindestens 3 Zeichen eingeben um Schlagwörter zu finden
                </v-list-item-title>
                <v-list-item-title v-else>
                  Kein Schlagwort mit dem Namen "<strong>{{ currentTagSearch }}</strong
                  >" gefunden. Drücke auf <kbd>Hinzufügen</kbd> um das neue Schlagwort zu
                  erstellen
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-combobox>
          <v-btn class="add-button" color="grey" variant="flat" @click="handleAddTag">
            Hinzufügen
          </v-btn>
        </div>
      </div>
    </template>
  </CollapsibleItem>
</template>

<script setup lang="ts">
import { filterKindToFilterScope } from "~/utils/filter.utils";
import { FilterKind, FilterTag } from "~/store/searchFilter";
import { ResultStatus } from "~/types/serverCallResult";

const props = defineProps<{
  expand: boolean;
  kind: FilterKind;
  preSetTags: FilterTag[];
}>();

const emit = defineEmits<{
  (event: "toggleExpand"): void;
  (event: "setTags", tags: FilterTag[]): void;
}>();

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());
api.setEndpoint("tags");

const allTags = ref<FilterTag[]>([]);

const currentTag = ref<FilterTag>(null);
const currentTagSearch = ref("");

const handleExpandToggled = () => {
  emit("toggleExpand");
};

const placeHolder = computed(() => {
  if (props.kind === "facility") {
    return "Bsp: Kurzzeitpflege, Wurzelbehandlung, Faszientherapie";
  } else if (props.kind === "course") {
    return "Bsp: Kurzzeitpflege, Wurzelbehandlung, Faszientherapie";
  } else if (props.kind === "event") {
    return "Bsp: Titel, Ziel und Angebote deiner Veranstaltung";
  } else if (props.kind === "news") {
    return "Bsp: Demenz, Mentale Gesundheit, Ernährung im Alter";
  }
});

const allTagsWithoutSelected = computed(() => {
  if (currentTagSearch.value.length > 2) {
    return allTags.value.filter(
      (tag) => !props.preSetTags.find((preSetTag) => preSetTag.id === tag.id)
    );
  }
});

const handleRemoveTag = (tag: FilterTag) => {
  const tagIndex = props.preSetTags.findIndex((preSetTag) => preSetTag.id === tag.id);

  if (tagIndex === -1) return;

  props.preSetTags.splice(tagIndex, 1);

  emit("setTags", [...props.preSetTags]);
};

const createTag = async (name: string) => {
  api.setEndpoint(`tags`);
  const res = await api.createItem({
    name,
    scope: filterKindToFilterScope(props.kind),
  });

  if (res.status !== ResultStatus.SUCCESSFUL) return null;

  return res.data.resource;
};

const handleAddTag = async () => {
  if (!currentTag.value) return;
  if (typeof currentTag.value === "string") {
    if (currentTag.value.includes(',')) {
      const tagsArray = currentTag.value.split(',');
      const filteredTags = tagsArray.filter(tag => tag.trim() !== '');
      for (const tag of filteredTags) {
        const newTag = await createTag(tag.trim());
        if (newTag) {
          emit("setTags", [...props.preSetTags, newTag]);
        }
      }
    } else {
      const newTag = await createTag(currentTag.value);
      if (newTag) {
        emit("setTags", [...props.preSetTags, newTag]);
      }
    }
    currentTag.value = null;
    loadAllTags();
  } else {
    // TODO: "Offline"-add-tag
    emit("setTags", [...props.preSetTags, currentTag.value]);
    currentTag.value = null;
  }
};

const loadAllTags = async () => {
  api.setEndpoint("tags");
  const res = await api.retrieveCollection();
  if (res.status !== ResultStatus.SUCCESSFUL) return;

  // const tags = res.data.resources;
  const scope = filterKindToFilterScope(props.kind);
  const tags: FilterTag[] = res.data.resources?.filter(
    (item: FilterTag) => scope === item.scope
  );

  allTags.value = tags;
};

onMounted(async () => {
  loadAllTags();
});
</script>

<style lang="scss" scoped>
.tag-select {
  margin-top: 0.5rem;

  .title {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: center;

    .selected {
      display: flex;
      gap: 1rem;
    }
  }
}

.content-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .help-tooltip {
    cursor: pointer;
    align-self: flex-start;
    margin-bottom: 5px;
  }
}

.inputs {
  display: flex;
  gap: 0.5rem;

  align-items: stretch;

  .add-button {
    height: unset;
  }
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;

  .tag {
    cursor: pointer;
    padding: 0.5rem 1rem;
    background-color: rgb(171, 171, 171);
    color: white;
    border-radius: 0.25rem;
  }
}
</style>
