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
            <sspan class="text-error">* Erforderlich</sspan>
          </div>
        </v-col>
        <v-col md="9">
          <div class="py-10">
            <div>
              <span class="text-h6"
                >Hier kannst du deine Kurse anlegen. Je spezifischer deine Angaben sind,
                desto besser können dich Besucherinnen und Besuchern auf der Webseite
                finden. Pflichtfelder sind mit einem Sternchen versehen.</span
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
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
                </template>
                <span>{{ steps["leader"].tooltip }}</span>
              </v-tooltip>
            </div>
            <v-text-field
              class="text-field"
              v-model="slotProps.item.name_instructor"
              hide-details="auto"
              label="Name des Veranstalters"
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
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
                </template>
                <span>{{ steps["photo"].tooltip }}</span>
              </v-tooltip>
            </div>
            <ChooseAndCropSingleImage
              kind="cover"
              :item="slotProps.item"
              :pre-set-image-url="slotProps.item.image_url"
              :temp-image="slotProps.item.file"
              label="Cover Bild"
              @setImage="setCoverBild"
              @delete-image="handleDeleteCover"
              :min-size="true"
            />
          </div>
          <v-divider class="my-10"></v-divider>
          <div class="field" id="gallery">
            <div class="my-2">
              <span class="text-h5 font-weight-bold">{{ steps["gallery"].label }}</span>
            </div>
            <AdminCareFacilitiesAddImages
              :item-id="slotProps.item.id"
              :offline-images="slotProps.item.offlineImageFiles"
              @offline="(file) => setOfflineImage(file)"
              @update-images="setGalleryImage"
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
            <AdminCareFacilitiesTagSelect
              :kind="slotProps.item.kind"
              :pre-set-tags="slotProps.item.tags || []"
              :expand="expandTagSelect"
              @toggle-expand="handleTagSelectToggle"
              @set-tags="setTagIds"
            />
          </div>

          <v-divider class="my-10"></v-divider>
          <v-checkbox
            v-show="false"
            v-bind:model-value="!!slotProps.item?.event_dates?.length"
            :rules="[!!slotProps.item?.event_dates?.length || 'Erforderlich']"
          ></v-checkbox>
          <div class="field" id="date">
            <div class="my-2">
              <span class="text-h5 mr-2 font-weight-bold">{{ steps["date"].label }}</span>
            </div>
            <div class="mb-15">
              <v-row>
                <v-col md="4" class="d-flex flex-column">
                  <Datepicker
                    inline
                    multi-dates
                    preview-format="dd.MM.yyyy HH:mm"
                    format="dd.MM.yyyy HH:mm"
                    model-type="dd.MM.yyyy HH:mm"
                    :format-locale="de"
                    timezone="Europe/Brussels"
                    locale="de-DE"
                    v-model="slotProps.item.event_dates"
                    label="Start"
                    :highlight-week-days="[0, 6]"
                    :min-date="new Date()"
                    prevent-min-max-navigation
                    cancelText="Abbrechen"
                    selectText="Hinzufügen"
                    input-class-name="dp-custom-input"
                    :clearable="false"
                  />
                  <span v-if="!slotProps.item.event_dates?.length" class="required">
                    * Erforderlich
                  </span>
                </v-col>
                <v-col md="7" v-if="slotProps.item.event_dates?.length">
                  <v-table density="compact" fixed-header height="400px">
                    <thead>
                      <tr>
                        <th></th>
                        <th class="text-left">Datum</th>
                        <th class="text-left">Löschen</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(date, index) in slotProps.item.event_dates"
                        :key="index"
                      >
                        <td>
                          <v-btn
                            disabled
                            class="mx-3"
                            size="large"
                            color="primary"
                            target="_blank"
                            density="compact"
                            icon="mdi-calendar-outline"
                          >
                          </v-btn>
                        </td>
                        <td>{{ date }}</td>
                        <td>
                          <v-btn
                            icon="mdi-delete"
                            variant="text"
                            @click="deleteDate(index, slotProps.item.event_dates)"
                          ></v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                  <div class="d-flex justify-center mt-2">
                    <v-btn
                      color="error"
                      size="large"
                      class="px-5"
                      :deleteAll="true"
                      @click="deleteAllDates(slotProps.item)"
                      >Alle termine löschen
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </div>
          </div>
          <v-divider class="my-10"></v-divider>

          <div class="field" id="website">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3">{{
                steps["website"].label
              }}</span>
            </div>
            <v-text-field
              class="text-field"
              type="url"
              v-model="slotProps.item.website"
              hide-details="auto"
              label="Link eintragen (z.B. www.meine-webseite.de)"
              :error-messages="useErrors().checkAndMapErrors('link', slotProps.errors)"
              :rules="[rules.isUrl]"
            />
          </div>

          <v-divider class="my-10"></v-divider>

          <div class="field" id="documents">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3">{{
                steps["documents"].label
              }}</span>
            </div>
            <AdminCareFacilitiesAddFiles
              :item-id="slotProps.item.id"
              tag-name="documents"
              :offline-documents="slotProps.item.offlineDocuments"
              @offline="handleDocumentsOffline"
              @updated-files="updatedFiles"
              @document-deleted="updatedFiles(null)"
            />
          </div>
          <v-divider class="my-10"></v-divider>
          <div id="address">
            <div class="my-2">
              <span class="text-h5 font-weight-bold">{{ steps["address"].label }}</span>
              <v-checkbox
                hide-details
                density="compact"
                :disabled="slotProps.item.course_outside_facility"
                :model-value="slotProps.item.course_outside_facility"
                @click="setCourseOutsideFacility(slotProps.item)"
                label="Ja, die Veranstaltung findet außerhalb meiner Einrichtung statt."
              />
            </div>
            <div v-if="slotProps.item.course_outside_facility">
              <div class="field">
                <v-text-field
                  class="text-field"
                  v-model="slotProps.item.street"
                  hide-details="auto"
                  label="Straße und Nummer"
                  :rules="[rules.counterStreet]"
                  :error-messages="
                    useErrors().checkAndMapErrors('street', slotProps.errors)
                  "
                />
              </div>
              <div class="field">
                <v-text-field
                  class="text-field"
                  v-model="slotProps.item.additional_address_info"
                  hide-details="auto"
                  label="Adresszusatz"
                />
              </div>
              <div class="field">
                <v-select
                  hide-details="auto"
                  class="text-field"
                  v-model="slotProps.item.community_id"
                  :items="communities"
                  item-title="name"
                  item-value="id"
                  label="Gemeinde"
                />
              </div>
              <div class="field split">
                <v-text-field
                  class="text-field"
                  v-model="slotProps.item.zip"
                  hide-details="auto"
                  label="PLZ"
                  :type="'number'"
                  disabled
                  :rules="[rules.required, rules.zip]"
                  :error-messages="useErrors().checkAndMapErrors('zip', slotProps.errors)"
                />
                <v-select
                  :disabled="!slotProps.item.zip"
                  hide-details="auto"
                  class="text-field"
                  v-model="slotProps.item.town"
                  :items="getTownsByCommunityId(slotProps.item.community_id)"
                  item-title="name"
                  item-value="name"
                  label="Ort"
                />
              </div>
            </div>
            <div v-else>
              <div class="field">
                <v-text-field
                  disabled
                  class="text-field"
                  v-model="slotProps.item.street"
                  hide-details="auto"
                  label="Straße und Nummer"
                  :rules="[rules.counterStreet]"
                  :error-messages="
                    useErrors().checkAndMapErrors('street', slotProps.errors)
                  "
                />
              </div>
              <div class="field">
                <v-text-field
                  disabled
                  class="text-field"
                  v-model="slotProps.item.additional_address_info"
                  hide-details="auto"
                  label="Adresszusatz"
                />
              </div>
              <div class="field">
                <v-select
                  disabled
                  hide-details="auto"
                  class="text-field"
                  v-model="slotProps.item.community_id"
                  :items="communities"
                  item-title="name"
                  item-value="id"
                  label="Gemeinde"
                />
              </div>
              <div class="field split">
                <v-text-field
                  class="text-field"
                  disabled
                  v-model="slotProps.item.zip"
                  hide-details="auto"
                  label="PLZ"
                  :type="'number'"
                  :rules="[rules.required, rules.zip]"
                  :error-messages="useErrors().checkAndMapErrors('zip', slotProps.errors)"
                />
                <v-select
                  disabled
                  hide-details="auto"
                  class="text-field"
                  v-model="slotProps.item.town"
                  :items="getTownsByCommunityId(slotProps.item.community_id)"
                  item-title="name"
                  item-value="name"
                  label="Ort"
                />
              </div>
            </div>
          </div>
          <v-divider class="my-10"></v-divider>
          <div class="field" id="responsible">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3">{{
                steps["responsible"].label
              }}</span>
            </div>
            <v-text-field
              class="text-field"
              v-model="slotProps.item.name_responsible_person"
              hide-details="auto"
              label="Vor- und Nachname"
              :rules="[rules.required]"
              :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
            />
          </div>
          <v-divider class="my-10"></v-divider>
        </v-col>
      </v-row>
    </v-card-text>
  </CreateEdit>
</template>

<script setup lang="ts">
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { de } from "date-fns/locale";
import { FilterType } from "~/store/searchFilter";
import { CreateEditFacility, CreateEditStep, CreateEditSteps } from "~/types/facilities";
import { rules } from "../../../data/validationRules";

const stepNames = [
  "name",
  "photo",
  "gallery",
  "description",
  "services",
  "website",
  "documents",
  "date",
  "leader",
  "address",
  "responsible",
] as const;
type StepNames = typeof stepNames[number];
const steps: CreateEditSteps<StepNames> = {
  name: {
    label: "1. Bitte trage hier den Namen deiner Veranstaltung ein. *",
    description: "Name *",
    props: ["name"],
  },
  leader: {
    label: "2.	Bitte gib hier den Namen des Veranstalters an. *",
    tooltip:
      "Der Name des Veranstalters wird in deinem Veranstaltungsprofil zu sehen sein.",
    description: "Name des Veranstalters *",
    props: ["name_instructor"],
  },
  photo: {
    label: "3. Bitte lade hier ein Titelbild hoch. *",
    description: "Foto",
    props: ["image_url", "file"],
    tooltip:
      "Das Titelbild wird im Kopfbereich deiner Profilseite die Veranstaltung angezeigt. Wähle hier am besten ein Bild, welches deinen Kurs/die Sportart/die Aktivität gut repräsentiert.",
    justSome: true,
  },
  gallery: {
    label: "4. Hier kannst du weitere Bilder hochladen.",
    description: "Galerie Fotos",
    props: [
      "sanitized_images",
      "images",
      "offline_images",
      "offlineImages",
      "offlineImageFiles",
    ],
    justSome: true,
  },
  description: {
    label:
      "5.	Bitte beschreibe möglichst detailliert, worum es bei dieser Veranstaltung geht und was die Besucher:innen erwarten können. *",
    description: "Beschreibung *",
    placeholder:
      "Nutze dieses Feld, um die Inhalte und Ziele deiner Veranstaltung näher zu beschreiben. Hier kannst du bspw. Angaben zur Zielgruppe (z. B. Anfänger, Fortgeschrittene), den trainierten Körperarealen (z. B. Bauch, Beine, Po), dem Vor- und Nachnamen der/des Kursleiterin/Kursleiters oder den Trainingszielen (z. B. Beweglichkeit, Ausdauer) machen. Je detaillierter die Beschreibung, desto einfacher können Besucherinnen und Besucher deinen Kurs über die Suche finden.",
    props: ["description"],
    checkHandler: isDescriptionEmpty,
  },
  services: {
    label:
      "6. Bitte gib die Veranstaltungsinhalte in Form von prägnanten Schlagwörtern wieder. *",
    description: "Schlagwörter *",
    props: ["tags"],
    tooltip:
      "Auf diese Weise gelangen Besucherinnen und Besucher zu deiner Veranstaltungsseite, sobald sie nach den entsprechenden Schlagwörtern suchen",
  },
  date: {
    label:
      "7. Bitte gib das Datum und die Uhrzeit deiner Veranstaltung an. Findet deine Veranstaltung regelmäßig statt, kannst du auch mehrere Termine auswählen. *",
    description: "Veranstaltungsdatum *",
    props: ["event_dates"],
    tooltip: "Mehrfachauswahl möglich.",
  },
  website: {
    label:
      "8. Hier kannst du einen Link zu deiner Webseite oder einem Social-Media-Kanal hinterlegen, über den sich Interessenten weiter informieren oder anmelden können.",
    tooltip: "Falls du keine eigene Webseite besitzen, überspringst du diesen Schritt.",
    description: "Webseite",
    props: ["website"],
  },
  documents: {
    label:
      "9.	Hier kannst du weitere Dokumente (z. B. Anmeldungsformular, Flyer, Wegbeschreibung) zu deiner Veranstaltung hochladen.",
    description: "Dokumente",
    props: ["sanitized_documents", "offlineDocuments"],
    justSome: true,
  },
  address: {
    label: "10. Findet die Veranstaltung außerhalb deiner Einrichtung statt?",
    tooltip: "",
    description: "Adresse",
    props: ["street", "zip", "community_id", "town"],
  },
  responsible: {
    label:
      "11. Bitte gib hier die/den inhaltlich Verantwortliche/n  für die Veranstaltungsinformationen an. *",
    tooltip: "Der Name wird in deinem Veranstaltungsprofil zu sehen sein.",
    description: "Verantwortliche *",
    props: ["name_responsible_person"],
  },
};

const expandTagSelect = ref(true);
const createEditRef = ref();

const facilitiesFilterSet = ref(false);
const servicesFilterSet = ref(false);

const courseHasAnotherAdress = ref(false);

const setCourseOutsideFacility = (item: CreateEditFacility) => {
  item.course_outside_facility = !item.course_outside_facility;
  if (item?.course_outside_facility) {
    item.street = "";
    item.zip = "";
    item.community_id = "";
    item.town = "";
    item.additional_address_info = "";
  }
};

const textOptions = ref({
  debug: false,
  theme: "snow",
  contentType: "html",
  required: true,
});

const deleteDate = (index: number, dates: string[]) => {
  const confirmed = confirm("Sicher dass du diesen Termin löschen möchtest?");
  if (confirmed) {
    dates.splice(index, 1);
  }
};

const deleteAllDates = (item: any) => {
  const confirmed = confirm("Sicher dass du Alle Termine löschen möchtest?");
  if (confirmed) {
    item.event_dates = [];
  }
};

const communitiesApi = useCollectionApi();
communitiesApi.setBaseApi(usePrivateApi());
communitiesApi.setEndpoint(`communities`);
const communities = communitiesApi.items;

const getCommunities = async () => {
  await communitiesApi.retrieveCollection();
};

const getTownsByCommunityId = (communityId: string) => {
  const found = communities.value.find((community: any) => community.id === communityId);

  if (found) {
    useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
      name: "zip",
      value: found.zip,
    });
    return found.towns;
  } else {
    [];
  }
};

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

const updatedFiles = (docs: any) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "sanitized_documents",
    value: docs,
  });
};

const setGalleryImage = (image: any) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "sanitized_images",
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

const setOfflineImage = (images: any) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "offlineImageFiles",
    value: images,
  });
};

const handleDocumentsOffline = (
  newOfflineDocuments: CreateEditFacility["offlineDocuments"]
) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "offlineDocuments",
    value: newOfflineDocuments,
  });
};

const reloadItem = () => {
  if (!createEditRef.value) return;

  console.log("Get item");
  createEditRef.value.getItem();
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

const setupFinished = ref(false);

onMounted(async () => {
  setupFinished.value = await useUser().setupFinished();
  getCommunities();
});
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

.ql-editor {
  min-height: 200px;
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

.dp--overlay-absolute {
  z-index: 9999 !important;
}

.ql-snow .ql-tooltip {
  z-index: 9999 !important;
}
.ql-snow .ql-tooltip::before {
  content: "Link hinzufügen"!important;
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  content: "Speichern"!important;
}
</style>
