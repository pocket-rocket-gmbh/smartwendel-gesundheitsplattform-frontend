<template>
  <CreateEdit v-slot="slotProps" size="100wh" ref="createEditRef">
    <v-card-text
      v-if="slotProps.item && Object.entries(slotProps.item).length"
      class="mb-15"
    >
      <v-row>
        <v-col md="3">
          <div class="mt-10 mx-5 menu-boxes">
            <div
              v-for="[key, step] in Object.entries(steps)"
              class="d-flex align-center my-3 justify-center align-center select-box mx-1 pa-1 is-clickable text-h5"
              :class="[isFilled(slotProps, step) ? 'is-filled' : '']"
              :key="key"
              @click="goToField(key)"
              v-fit-text="{ min: 16, max: 45 }"
            >
              <span>{{ step.description }}</span>
            </div>
          </div>
        </v-col>
        <v-col md="9">
          <div class="py-10">
            <div>
              <span class="text-h6"
                >Hier kannst du deine News und Beiträge zu verschiedenen Themen anlegen.
                Je mehr Angaben du machst, umso leichter können Besucherinnen und Besucher
                deine Beiträge finden. Pflichtfelder sind mit einem Sternchen
                versehen.</span
              >
            </div>
          </div>
          <div class="field" id="name">
            <div class="my-2">
              <span class="text-h5 font-weight-bold">{{ steps["name"].label }}</span>
            </div>
            <v-text-field
              class="text-field"
              v-model="slotProps.item.name"
              hide-details="auto"
              label="Überschrift"
              :rules="[rules.required]"
              :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
            />
            <v-text-field
              class="text-field"
              v-if="slotProps.item.kind !== 'news'"
              v-model="slotProps.item.name"
              hide-details="auto"
              label="Name"
              :rules="[rules.required]"
              :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
            />
          </div>
          <v-divider class="my-10"></v-divider>
          <div class="field" id="leader">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3">{{
                steps["leader"].label
              }}</span>
            </div>
            <v-text-field
              class="text-field"
              v-model="slotProps.item.name_instructor"
              hide-details="auto"
              label="Vor und Nachname des Autors"
              :rules="[rules.required]"
              :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
            />
          </div>
          <v-divider class="my-10"></v-divider>
          <div class="field" id="photo">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3">{{
                steps["photo"].label
              }}</span>
            </div>
            <ChooseAndCropSingleImage
              kind="cover"
              :item="slotProps.item"
              :pre-set-image-url="slotProps.item.image_url"
              :temp-image="slotProps.item.file"
              label="Titelbild"
              @setImage="setCoverBild"
              @delete-image="handleDeleteCover"
              :min-size="true"
            />
          </div>
          <v-divider class="my-10"></v-divider>

          <div class="field" id="description">
            <div class="my-2">
              <span class="text-h5 font-weight-bold">{{
                steps["description"].label
              }}</span>
            </div>
            <div class="editor">
              <ClientOnly>
                <div
                  class="text-editor"
                  :class="{
                    'empty-editor': isDescriptionEmpty(slotProps.item.description),
                  }"
                >
                  <QuillEditor
                    ref="ql-editor"
                    class="ql-blank"
                    :placeholder="steps['description'].placeholder"
                    :options="textOptions"
                    v-model:content="slotProps.item.description"
                    contentType="html"
                    @ready="onQuillReady"
                  />
                  <div
                    v-if="isDescriptionEmpty(slotProps.item.description)"
                    class="required"
                  >
                    Erforderlich
                  </div>
                  <v-text-field
                    v-show="false"
                    class="hidden-text-field"
                    :model-value="
                      isDescriptionEmpty(slotProps.item.description) ? '' : 'filled'
                    "
                    :rules="[rules.required]"
                  />
                </div>
              </ClientOnly>
            </div>
          </div>
          <v-divider class="my-10"></v-divider>
          <!--           <v-divider class="my-10"></v-divider>
          <div class="field" id="category">
            <div class="my-3">
              <span class="text-h5 font-weight-bold">{{ steps["category"].label }}</span>
            </div>
            <AdminCareFacilitiesChooseFilter
              :pre-set-tags="slotProps.item.tag_category_ids"
              filter-type="filter_facility"
              :filter-kind="slotProps.item.kind"
              :enable-multi-select="true"
              @setTags="setTagCategoryIds"
              @are-filters-set="setFiltersSet"
            />
          </div> -->
          <v-divider class="my-10"></v-divider>
          <div class="field" id="services">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3">{{
                steps["services"].label
              }}</span>
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
                </template>
                <span>{{ steps["services"].tooltip }}</span>
              </v-tooltip>
            </div>
            <!--             <AdminCareFacilitiesChooseFilter
              :pre-set-tags="slotProps.item.tag_category_ids"
              filter-type="filter_service"
              :filter-kind="slotProps.item.kind"
              :enable-multi-select="true"
              @setTags="setTagCategoryIds"
              @are-filters-set="setFiltersSet"
            /> -->
            <!--             <v-alert type="info" color="grey" class="mt-2">
              <div class="d-flex align-center filter-request">
                <div class="py-1">
                  <span
                    >Falls der passende Dienstleistungsbereich für deine Einrichtung/dein Unternehmen nicht zu finden ist, kontaktiere uns bitte
                  </span>
                  <span>
                    <a
                      class="is-white text-decoration-underline"
                      :href="`mailto:smartcity@lkwnd.de?subject=Anfrage Leistungsfilter`"
                      >HIER</a
                    >
                  </span>
                </div>
              </div>
            </v-alert> -->
            <AdminCareFacilitiesTagSelect
              :kind="slotProps.item.kind"
              :pre-set-tags="slotProps.item.tags || []"
              :expand="expandTagSelect"
              @toggle-expand="handleTagSelectToggle"
              @set-tags="setTagIds"
            />
          </div>

          <v-divider class="my-10"></v-divider>
        </v-col>
      </v-row>
    </v-card-text>
  </CreateEdit>
</template>

<script setup lang="ts">
import "@vuepic/vue-datepicker/dist/main.css";
import { CreateEditStep, CreateEditSteps } from "~/types/facilities";
import { FilterType } from "~/store/searchFilter";
import { rules } from "../../../data/validationRules";

const stepNames = ["name", "photo", "description", "leader", "services"] as const;
type StepNames = typeof stepNames[number];
const steps: CreateEditSteps<StepNames> = {
  name: {
    label: "1. Bitte gib hier den Titel deines Newsartikels/Beitrags an. *",
    tooltip: "",
    description: "Name *",
    props: ["name"],
  },
  leader: {
    label:
      "2.	Bitte gib hier den Vor- und Nachnamen des Autors/Verfassers des Beitrages an. *",
    tooltip: "",
    description: "Name der Autorin/des Autors *",
    props: ["name_instructor"],
  },
  photo: {
    label:
      "3. Falls du kein Titelbild hast, kannst du ein passendes Bild aus unserer Datenbank auswählen. * ",
    tooltip: "",
    description: "Titelbild",
    props: ["image_url", "file"],
    justSome: true,
  },
  description: {
    label: "4. Bitte gib hier den Inhalt deines Newsartikels/Beitrages wieder. *",
    tooltip: "",
    description: "Beschreibungstext *",
    placeholder: "Inhalt des Beitrags",
    props: ["description"],
    checkHandler: isDescriptionEmpty,
  },
  /*   category: {
    label: "5. Weise deinen Beitrag gezielt einem Berufszweig / einer Sparte zu *",
    tooltip: "",
    description: "Schlagwörter",
    props: ["tag_category_ids"],
    specialFilter: "filter_facility",
  }, */
  services: {
    label:
      "5. Bitte gib die Inhalte deines Newsbeitrages in Form von prägnanten Schlagwörtern wieder.",
    tooltip:
      "Auf diese Weise gelangen Besucherinnen und Besucher zu deinem Newsbeitrag sobald sie nach den entsprechenden Schlagwörtern suchen",
    description: "Schlagwörter",
    props: ["tags"],
  },
};

const expandTagSelect = ref(true);
const createEditRef = ref();

const facilitiesFilterSet = ref(false);
const servicesFilterSet = ref(false);

const textOptions = ref({
  debug: false,
  theme: "snow",
  contentType: "html",
  required: true,
});

const onQuillReady = (quill: any) => {
  quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node: any, delta: any[]) => {
    delta.forEach((e) => {
      if (e && e.attributes) {
        e.attributes.color = "";
        e.attributes.background = "";
      }
    });
    return delta;
  });
};

function isDescriptionEmpty(description?: string) {
  return !description || description === "<p><br></p>";
}

const handleTagSelectToggle = () => {
  expandTagSelect.value = !expandTagSelect.value;
};

const setFiltersSet = (isSet: boolean, filterType: FilterType) => {
  if (filterType === "filter_facility") {
    facilitiesFilterSet.value = isSet;
  } else if (filterType === "filter_service") {
    servicesFilterSet.value = isSet;
  }
};

const isFilled = (slotProps: any, item: CreateEditStep) => {
  const props: string[] = item.props;
  if (!props) return;

  const slotPropsItem = slotProps.item;

  if (item.specialFilter) {
    if (item.specialFilter === "filter_facility") {
      return facilitiesFilterSet.value;
    } else if (item.specialFilter === "filter_service") {
      return servicesFilterSet.value;
    }
  }

  if (item.checkHandler) {
    const result = props.every((prop) => {
      return !item.checkHandler(slotPropsItem[prop]);
    });
    return result;
  }

  if (item.justSome) {
    const result = props.some((prop) => {
      return slotPropsItem[prop] && slotPropsItem[prop].length;
    });
    return result;
  }

  const result = props.every((prop) => {
    return slotPropsItem[prop] && slotPropsItem[prop].length;
  });
  return result;
};

const setTagCategoryIds = (tags: any) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "tag_category_ids",
    value: tags,
  });
};

const setTagIds = (tags: any) => {
  if (!tags || !Array.isArray(tags)) return;

  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "tag_ids",
    value: tags.map((tag) => tag.id),
  });
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "tags",
    value: tags,
  });
};

const setCoverBild = (image: any) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "file",
    value: image,
  });
};

const handleDeleteCover = () => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "file",
    value: null,
  });
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "image_url",
    value: null,
  });
};

const goToField = (n: string) => {
  const id = n;
  if (id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
};
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.cropper-wrap
  max-width: 450px

.fields
  max-width: 70vw

.filter-request
  font-size: 16px

.select-box
  border: black solid 1px
  border-radius: 10px
  background: $light-grey
  width: 100%

.is-filled
  background-color: $primary-color
  color: white

.menu-boxes
  position: sticky
  z-index: 9999
  top: 30px
</style>

<style lang="css">
.dp__selection_preview {
  display: none;
}

.dp__action_buttons {
  justify-content: center;
  margin-right: auto;
  padding: 10px;
}

.dp__action_button {
  padding-left: 10px;
  height: 50px;
  padding-right: 10px;
  background-color: #8ab61d;
}

.dp__action_button:hover {
  background-color: #8ab61d;
}

.dp__instance_calendar .dp__button {
  background-color: #8ab61d;
  color: white;
  height: 3rem;
  font-weight: bold;
}
.dp__button::after {
  content: "Uhrzeit auswählen";
  margin-left: 0.25rem;
}
.dp__overlay_container .dp__button::after {
  content: "Datum auswählen";
  margin-left: 0.25rem;
}

.ql-editor p,
.ql-editor ol,
.ql-editor ul {
  font-size: 22px;
}

.ql-blank::before {
  font-size: 18px;
}

.text-editor {
  padding-top: calc(0.5rem + 1px);
  padding-bottom: calc(0.5rem + 1px + 12px);
}

.empty-editor {
  border-top: 1px solid rgb(164, 34, 88);
  border-bottom: 1px solid rgb(164, 34, 88);
  padding-top: 0.5rem;
  padding-bottom: 0;
}

.required {
  color: rgb(164, 34, 88);
  font-size: 12px;
  padding-left: 16px;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "Überschrift 1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "Überschrift 2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "Überschrift 3";
}

.v-tooltip > .v-overlay__content {
  font-size: 20px !important;
}

.ql-clean {
  display: none !important;
}
</style>
