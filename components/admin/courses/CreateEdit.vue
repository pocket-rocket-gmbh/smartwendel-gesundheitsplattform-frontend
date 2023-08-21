<template>
  <CreateEdit v-slot="slotProps" size="100wh" ref="createEditRef">
    <v-card-text v-if="slotProps.item && Object.entries(slotProps.item).length" class="mb-15">
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
                >Hier kannst du eigene Kurse anlegen. Bitte fülle dazu wenn möglich alle Felder sorgfältig aus.
                Pflichtfelder sind mit einem Sternchen versehen.</span
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

          <div class="field" id="photo">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3">{{ steps["photo"].label }}</span>
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props">mdi-information-outline</v-icon>
                </template>
                <span>{{ steps["photo"].tooltip }}</span>
              </v-tooltip>
            </div>
            <ChooseAndCropSingleImage
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
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3">{{ steps["gallery"].label }}</span>
            </div>
            <AdminCareFacilitiesAddImages :item-id="slotProps.item.id" @offline="(file) => setOfflineImage(file)" />
          </div>
          <v-divider class="my-10"></v-divider>

          <div class="field" id="description">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3">{{ steps["description"].label }}</span>
            </div>
            <div class="editor">
              <ClientOnly>
                <div class="text-editor" :class="{ 'empty-editor': isDescriptionEmpty(slotProps.item.description) }">
                  <QuillEditor
                    ref="ql-editor"
                    class="ql-blank"
                    :placeholder="steps['description'].placeholder"
                    :options="textOptions"
                    v-model:content="slotProps.item.description"
                    contentType="html"
                    :toolbar="textToolbar"
                    @ready="onQuillReady"
                  />
                  <div v-if="isDescriptionEmpty(slotProps.item.description)" class="required">Erforderlich</div>
                  <v-text-field
                    v-show="false"
                    class="hidden-text-field"
                    :model-value="isDescriptionEmpty(slotProps.item.description) ? '' : 'filled'"
                    :rules="[rules.required]"
                  />
                </div>
              </ClientOnly>
            </div>
          </div>
          <v-divider class="my-10"></v-divider>

          <div class="field" id="category">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3">{{ steps["category"].label }}</span>
              <v-tooltip location="top" width="200px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props">mdi-information-outline</v-icon>
                </template>
                <span>{{ steps["category"].tooltip }}</span>
              </v-tooltip>
            </div>
            <AdminCareFacilitiesChooseFilter
              :pre-set-tags="slotProps.item.tag_category_ids"
              filter-type="filter_facility"
              :filter-kind="slotProps.item.kind"
              :enable-multi-select="true"
              @setTags="setTagCategoryIds"
              @are-filters-set="setFiltersSet"
            />
          </div>

          <v-divider class="my-10"></v-divider>

          <div class="field" id="services">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3">{{ steps["services"].label }}</span>
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props">mdi-information-outline</v-icon>
                </template>
                <span>{{ steps["services"].tooltip }}</span>
              </v-tooltip>
            </div>
            <AdminCareFacilitiesChooseFilter
              :pre-set-tags="slotProps.item.tag_category_ids"
              filter-type="filter_service"
              :filter-kind="slotProps.item.kind"
              :enable-multi-select="true"
              @setTags="setTagCategoryIds"
              @are-filters-set="setFiltersSet"
            />
            <v-alert type="info" color="grey" class="mt-2">
              <div class="d-flex align-center filter-request">
                <div class="py-1">
                  <span
                    >Falls der passende Dienstleistungsbereich für deine Einrichtung/dein Unternehmen nicht zu finden
                    ist, kontaktiere uns bitte
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
            </v-alert>
            <AdminCareFacilitiesTagSelect
              :kind="slotProps.item.kind"
              :pre-set-tags="slotProps.item.tags || []"
              :expand="expandTagSelect"
              @toggle-expand="handleTagSelectToggle"
              @set-tags="setTagIds"
            />
          </div>

          <v-divider class="my-10"></v-divider>
          <div class="field" id="date">
            <div class="my-2">
              <span class="text-h5 mr-2 font-weight-bold">{{ steps["date"].label }}</span>
            </div>
            <div class="mb-15">
              <v-row>
                <v-col md="4" class="d-flex align-center justify-center">
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
                </v-col>
                <v-col md="7">
                  <v-table density="compact" fixed-header height="400px">
                    <thead>
                      <tr>
                        <th></th>
                        <th class="text-left">Datum</th>
                        <th class="text-left">Löschen</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(date, index) in slotProps.item.event_dates" :key="index">
                        <td>
                          <v-btn
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
                </v-col>
              </v-row>
            </div>
          </div>
          <v-divider class="my-10"></v-divider>

          <div class="field" id="certificates">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3">{{ steps["certificates"].label }}</span>
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props">mdi-information-outline</v-icon>
                </template>
                <span>{{ steps["certificates"].tooltip }}</span>
              </v-tooltip>
            </div>
            <div>
              <v-checkbox
                :model-value="slotProps.item.billable_through_health_insurance"
                hide-details
                density="compact"
                label="Ja"
                @click="
                  slotProps.item.billable_through_health_insurance = !slotProps.item.billable_through_health_insurance
                "
              />
            </div>
            <div class="field my-5" v-if="slotProps.item.billable_through_health_insurance">
              <AdminCareFacilitiesAddFiles
                :item-id="slotProps.item.id"
                tag-name="insurance"
                :document-acepted="slotProps.item.billable_through_health_insurance_approved"
                :offline-documents="slotProps.item.offlineDocuments"
                @offline="handleDocumentsOffline"
                @document-deleted="handleDocumentDeleted"
              />
              <div class="d-flex align-center">
                <span v-if="useUser().isAdmin()">
                  <v-icon color="primary">mdi-check-decagram-outline</v-icon>
                </span>
                <v-checkbox
                  v-if="slotProps.item.billable_through_health_insurance && useUser().isAdmin()"
                  :model-value="slotProps.item.billable_through_health_insurance_approved"
                  hide-details
                  density="compact"
                  label="Bitte prüfe, ob das Zertifikat gültig ist. Wenn ja, bestätige es hier."
                  @click="
                    slotProps.item.billable_through_health_insurance_approved =
                      !slotProps.item.billable_through_health_insurance_approved
                  "
                />
              </div>
            </div>
          </div>
          <v-divider class="my-10"></v-divider>

          <div class="field" id="website">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3">{{ steps["website"].label }}</span>
            </div>
            <v-text-field
              class="text-field"
              type="url"
              v-model="slotProps.item.website"
              hide-details="auto"
              label="Link eintragen"
              :error-messages="useErrors().checkAndMapErrors('link', slotProps.errors)"
            />
          </div>

          <v-divider class="my-10"></v-divider>

          <div class="field" id="documents">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3">{{ steps["documents"].label }}</span>
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props">mdi-information-outline</v-icon>
                </template>
                <span>{{ steps["documents"].tooltip }}</span>
              </v-tooltip>
            </div>
            <AdminCareFacilitiesAddFiles
              :item-id="slotProps.item.id"
              tag-name="documents"
              :offline-documents="slotProps.item.offlineDocuments"
              @offline="handleDocumentsOffline"
              @document-deleted="handleDocumentDeleted"
            />
          </div>
          <div class="field" id="leader">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3">{{ steps["leader"].label }}</span>
                <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props">mdi-information-outline</v-icon>
                </template>
                <span>{{ steps["leader"].tooltip }}</span>
              </v-tooltip>
            </div>
            <v-text-field
              class="text-field"
              v-model="slotProps.item.name_instructor"
              hide-details="auto"
              label="Name / Vorname des Kursleiters"
              :rules="[rules.required]"
              :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
            />
          </div>
          <v-divider class="my-10"></v-divider>

          <div id="address">
            <div class="my-2">
              <span class="text-h5 font-weight-bold">{{ steps["address"].label }}</span>
              <v-checkbox
                hide-details
                density="compact"
                :model-value="courseHasAnotherAdress"
                @click="courseHasAnotherAdress = !courseHasAnotherAdress"
                label="Ja"
              />
            </div>
            <div v-if="courseHasAnotherAdress">
              <div class="field">
                <v-text-field
                  class="text-field"
                  v-model="slotProps.item.street"
                  hide-details="auto"
                  label="Straße und Nummer"
                  :rules="[rules.counterStreet]"
                  :error-messages="useErrors().checkAndMapErrors('street', slotProps.errors)"
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
                  :rules="[rules.required, rules.zip]"
                  :error-messages="useErrors().checkAndMapErrors('zip', slotProps.errors)"
                />
                <v-select
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
  "category",
  "services",
  "website",
  "documents",
  "certificates",
  "date",
  "leader",
  "address",
] as const;
type StepNames = (typeof stepNames)[number];
const steps: CreateEditSteps<StepNames> = {
  name: {
    label: "1. Bitte trage hier den Namen deines Kurses ein. *",
    tooltip: "",
    description: "Name",
    props: ["name"],
  },
  photo: {
    label: "2. Bitte lade hier ein Coverbild hoch. *",
    tooltip: "Das Coverbild wird im Kopfbereich deiner Profilseite für Kurse angezeigt. Wähle hier am besten ein Bild, welches deinen Kurs/die Sportart/die Aktivität gut repräsentiert.",
    description: "Coverbild",
    props: ["image_url"],
  },
  gallery: {
    label: "3. Lade weitere Bilder für eine Galerie hoch",
    tooltip: "",
    description: "Fotogalerie",
    props: ["sanitized_images"],
  },
  description: {
    label: "4. Bitte beschreibe die Inhalte deines Kurses so detailliert wie möglich. *",
    tooltip: "",
    description: "Beschreibungstext",
    placeholder: "Nutze dieses Feld, um die Inhalte und Ziele deines Kurses näher zu beschreiben. Hier kannst du bspw. Angaben zur Zielgruppe (z. B. Anfänger, Fortgeschrittene), den trainierten Körperarealen (z. B. Bauch, Beine, Po), dem Vor- und Nachnamen der/des Kursleiterin/Kursleiters oder den Trainingszielen (z. B. Beweglichkeit, Ausdauer) machen. Je detaillierter die Beschreibung, desto einfacher können Besucherinnen und Besucher deinen Kurs über die Suche finden.",
    props: ["description"],
    checkHandler: isDescriptionEmpty,
  },
  category: {
    label: "5. Bitte ordne deinen Kurs einem der folgenden Themenbereiche zu * ",
    tooltip: "Mehrfachauswahl möglich.",
    description: "Branchenzugehörigkeit",
    props: ["tag_category_ids"],
    specialFilter: "filter_facility",
  },
  services: {
    label: "6. Bitte ordne deinem Kurs passende Ausstattungs- und Leistungsfilter zu. *",
    tooltip: "Wähle alle für das Kursangebot relevanten Filter aus. Je genauer deine Angaben zu den einzelnen Filterbereichen, desto leichter können Besucherinnen und Besucher dein Kursangebot über die Suchfunktion der Webseite finden",
    description: "Leistungen und Schlagwörter",
    props: ["tag_category_ids"],
    specialFilter: "filter_service",
  },
  date: {
    label:
      "7.	Bitte gib die Kurstermine und Uhrzeiten an. Findet dein Kurs regelmäßig statt, kannst du auch mehrere Termine auswählen. *",
    tooltip: "",
    description: "Kursdaten",
    props: ["event_dates"],
  },
  certificates: {
    label:
      "8.	Bitte lade das Zertifikat der Zentralen Prüfungsstelle Prävention (ZPP) hoch, wenn es sich um einen von der gesetzlichen Krankenkasse geförderten Präventionskurs handelt",
    tooltip: "Nachdem wir das Zertifikat geprüft haben, wird als Hinweis für die Förderfähigkeit ein grünes Häkchen neben dem Namen deines Kurses erscheinen.",
    description: "Zertifikate",
    props: ["billable_through_health_insurance"],
  },
  website: {
    label: "9. Hier kannst du einen Link zu deiner Webseite oder einem Social-Media-Kanal hinterlegen, über den sich Interessenten anmelden können",
    tooltip: "Falls du keine eigene Webseite besitzen, überspringst du diesen Schritt.",
    description: "Link zur Webseite",
    props: ["website"],
  },
  documents: {
    label:
      "10. Hier kannst du weitere Dokumente (z. B. Kurspläne) zu deinen Angeboten hochladen.",
    tooltip: "",
    description: "Dokumente",
    props: ["sanitized_documents", "offlineDocuments"],
    justSome: true,
  },
  leader: {
    label: "11.	Bitte gib hier den Namen der Kursleitung an",
    tooltip: "Der Name der Kursleitung wird in deinem Kursprofil zu sehen sein.",
    description: "Name der Kursleitung",
    props: ["name_instructor"],
  },
  address: {
    label: "12. Findet der Kurs außerhalb deiner Einrichtung statt?",
    tooltip: "",
    description: "Adresse",
    props: ["street", "zip", "community_id", "town"],
  },
};

const expandTagSelect = ref(true);
const createEditRef = ref();

const facilitiesFilterSet = ref(false);
const servicesFilterSet = ref(false);

const courseHasAnotherAdress = ref(false);

const textToolbar = ref([
  [{ header: "1" }, { header: "2" }],
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
]);

const textOptions = ref({
  debug: false,
  theme: "snow",
  contentType: "html",
  toolbar: textToolbar.value,
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

const deleteDate = (index: number, dates: string[]) => {
  const confirmed = confirm("Sicher dass du diesen Termin löschen möchtest?");
  if (confirmed) {
    dates.splice(index, 1);
  }
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

const setOfflineImage = (images: any) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "offlineImageFiles",
    value: images,
  });
};

const handleDocumentsOffline = (newOfflineDocuments: CreateEditFacility["offlineDocuments"]) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "offlineDocuments",
    value: newOfflineDocuments,
  });
};

const handleDocumentDeleted = () => {
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
.text-field .v-label {
  font-size: 20px !important;
}

.text-field input,
.text-field input {
  padding-top: 30px !important;
}

.v-select .v-select__selection-text {
  padding-top: 30px !important;
}

.v-textarea .v-field__input {
  margin-top: 20px !important;
  padding-top: 20px !important;
}

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
</style>
