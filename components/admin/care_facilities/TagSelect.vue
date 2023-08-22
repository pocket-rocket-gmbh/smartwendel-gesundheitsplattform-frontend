<template>
  <CollapsibleItem class="tag-select" id="tag-select" :expand="expand" @expand-toggled="handleExpandToggled">
    <template #title>
      <div class="title">
        <div v-if="kind === 'facility'">Branchenspezifisches Leistungsangebot</div>
        <div v-if="kind === 'news'">Branchenspezifisches Leistungsangebot</div>
        <div v-if="kind === 'course'">Kursspezifische Leistungsangebote</div>
        <div v-if="!expand" class="selected">
          <v-chip v-for="tag in preSetTags" :key="tag.id">
            {{ tag.name }}
          </v-chip>
        </div>
      </div>
    </template>
    <template #content>
      <div class="content">
        <div v-if="kind === 'facility'">
          Hier hast du die Möglichkeit, dein individuelles Leistungsangebot mit Hilfe von Schlagwörtern zu beschreiben.
        </div>
        <div v-if="kind === 'course'">
          Hier hast du die Möglichkeit, deinen Kursinhalt mit Hilfe von Schlagwörtern individuell zu beschreiben.
        </div>
        <div v-if="kind === 'event'">
          Hier hast du die Möglichkeit, deinen Kursinhalt mit Hilfe von Schlagwörtern individuell zu beschreiben.
        </div>
        <div v-if="kind === 'news'">
          Bitte hinterlege hier alle relevanten Schlagwörter, die den Inhalt deines Newsartikels/Beitrages
          widerspiegeln.
        </div>
        <div class="content-title mt-5 d-flex align-center">
          <v-icon>mdi-tag-outline</v-icon>
          <div>
            <div>
              <b>Schlagwort eingeben</b>
            </div>
          </div>
          <v-tooltip location="top" width="300px">
            <template v-slot:activator="{ props }">
              <v-icon class="help-tooltip" v-bind="props">mdi-information-outline</v-icon>
            </template>
            <span v-if="kind === 'facility'">
              Trage Begriffe ein, die dein individuelles Angebot möglichst präzise beschreiben (z. B. „Kurzzeitpflege“,
              „Betreutes Wohnen“ und „Demenz“, wenn es sich um eine Pflegeinrichtung oder „Yoga“, „Les Mills“ und
              „Krafttraining“, wenn es sich um ein Fitnessstudio handelt). Auf diese Weise gelangen Besucherinnen und
              Besucher zu deinem Profil, sobald sie nach den entsprechenden Schlagwörtern suchen.
            </span>
            <span v-if="kind === 'course'"
              >Trage Begriffe ein, die den Inhalt des Kurses möglichst präzise beschreiben (z. B. „Yoga“,
              „Rückenbeschwerden“, „Beweglichkeit“). Auf diese Weise gelangen Besucherinnen und Besucher zu deinem
              Kursprofil, sobald sie nach den entsprechenden Schlagwörtern suchen.
            </span>
            <span v-if="kind === 'event'"
              >Trage Begriffe ein, die den Inhalt des Kurses möglichst präzise beschreiben (z. B. „Yoga“,
              „Rückenbeschwerden“, „Beweglichkeit“). Auf diese Weise gelangen Besucherinnen und Besucher zu deinem
              Kursprofil, sobald sie nach den entsprechenden Schlagwörtern suchen.
            </span>
            <span v-if="kind === 'news'">
              Besucherinnen und Besucher gelangen zu deinem Newsartikel/Beitrag, wenn sie die entsprechenden
              Schlagwörter suchen.
            </span>
          </v-tooltip>
        </div>
        <div class="inputs">
          <!-- <v-combobox
            @click.stop
            hide-details="auto"
            label="Bsp: Kurzzeitpflege, Wurzelbehandlung, Faszientherapie"
            :items="allTags"
            v-model="currentTag"
          ></v-combobox> -->
          <v-combobox
            v-model="currentTag"
            v-model:search="currentTagSearch"
            :hide-no-data="false"
            :items="allTagsWithoutSelected"
            hide-selected
            label="Bsp: Kurzzeitpflege, Wurzelbehandlung, Faszientherapie"
            persistent-hint
            small-chips
            :return-object="true"
            :item-title="'name'"
            :item-value="'id'"
            hide-details="auto"
            v-on:keyup.enter="handleAddTag"
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-title>
                  Kein Schlagwort mit dem Namen "<strong>{{ currentTagSearch }}</strong
                  >" gefunden. Drücke auf <kbd>Hinzufügen</kbd> um das neue Schlagwort zu erstellen
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-combobox>
          <v-btn class="add-button" color="grey" variant="flat" @click="handleAddTag"> Hinzufügen </v-btn>
        </div>
        <div class="tags">
          <v-chip v-for="tag in preSetTags" closable @click:close="handleRemoveTag(tag)" :key="tag.id">
            {{ tag.name }}
          </v-chip>
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

const allTagsWithoutSelected = computed(() => {
  return allTags.value.filter((tag) => !props.preSetTags.find((preSetTag) => preSetTag.id === tag.id));
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
    const newTag = await createTag(currentTag.value);
    if (!newTag) return;
    emit("setTags", [...props.preSetTags, newTag]);
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
  const tags: FilterTag[] = res.data.resources?.filter((item: FilterTag) => scope === item.scope);

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
