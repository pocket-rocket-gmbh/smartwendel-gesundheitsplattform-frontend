<template>
  <CreateEdit v-slot="slotProps" size="100wh" ref="createEditRef">
    <v-card-text v-if="slotProps.item && Object.entries(slotProps.item).length" class="mb-15">
      <v-row>
        <v-col md="2">
          <div class="mt-10 mx-5 menu-boxes">
            <div
              v-for="[key, step] in Object.entries(steps)"
              :class="[isFilled(slotProps, step) ? 'is-filled' : '']"
              class="d-flex align-center my-3 justify-center align-center select-box mx-1 pa-1 is-clickable text-h5"
              :key="key"
              @click="goToField(key)"
            >
              <div class="is-clickable d-flex" @click="goToField(key)">
                <span>{{ step.description }}</span>
              </div>
            </div>
          </div>
        </v-col>
        <v-col md="10">
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
            </div>
            <ChooseAndCropSingleImage
              :pre-set-image-url="slotProps.item.image_url"
              :temp-image="slotProps.item.file"
              label="Cover Bild"
              @setImage="setCoverBild"
              :min-size="true"
            />
          </div>
          <v-divider class="my-10"></v-divider>
          <div class="field" id="gallery">
            <div class="my-2">
              <span class="text-h5 font-weight-bold">{{ steps["gallery"].label }}</span>
            </div>
            <AdminCareFacilitiesAddImages :item-id="slotProps.item.id" @offline="(file) => setOfflineImage(file)" />
          </div>
          <v-divider class="my-10"></v-divider>

          <div class="field" id="description">
            <div class="my-2">
              <span class="text-h5 font-weight-bold">{{ steps["description"].label }}</span>
            </div>
            <div class="editor">
              <ClientOnly>
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
              </ClientOnly>
            </div>
          </div>
          <v-divider class="my-10"></v-divider>

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
            />
          </div>

          <v-divider class="my-10"></v-divider>

          <div class="field" id="services">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3">{{ steps["services"].label }}</span>
            </div>
            <AdminCareFacilitiesChooseFilter
              :pre-set-tags="slotProps.item.tag_category_ids"
              filter-type="filter_service"
              :filter-kind="slotProps.item.kind"
              :enable-multi-select="true"
              @setTags="setTagCategoryIds"
            />
            <v-alert type="info" color="grey" class="mt-2">
              <div class="d-flex align-center filter-request">
                <div class="py-1">
                  <span
                    >Falls unter den angegebenen Leistungskatalog nicht die passende Leistung für deine Einrichtung zu
                    finden ist, kontaktiere uns bitte
                  </span>
                  <span>
                    <a
                      class="is-white text-decoration-underline"
                      :href="`mailto:smartcity@lkwnd.de?subject=Anfrage Leistungsfilter`"
                      >Hier</a
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
              <v-tooltip location="top">
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
            <div class="my-2">
              <span class="text-h5 font-weight-bold">{{ steps["leader"].label }}</span>
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
                  :disabled="!useUser().isAdmin() && !editInformations && setupFinished"
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
                  :disabled="!useUser().isAdmin() && !editInformations && setupFinished"
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
import { CreateEditFacility, CreateEditSteps } from "~/types/facilities";
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
    label: "1. Gib deinem Kurs einen Namen *",
    tooltip: "",
    description: "Name",
    props: ["name"],
  },
  photo: {
    label: "2. Lade ein Coverbild hoch *",
    tooltip: "",
    description: "Foto",
    props: ["image_url"],
  },
  gallery: {
    label: "3. Lade weitere Bilder für eine Galerie hoch",
    tooltip: "",
    description: "Galerie Fotos",
    props: ["sanitized_images"],
  },
  description: {
    label: "4. Gib hier eine Kursbeschreibung an *",
    tooltip: "",
    description: "Beschreibung",
    placeholder: "Beschreibung des Kurses. Nützliche Inhalte: Kursdauer, empfohlene Kleidung, etc",
    props: ["description"],
  },
  category: {
    label: "5. Weise deinen Kurs / Veranstaltung gezielt einem Berufszweig / einer Sparte zu ",
    tooltip: "",
    description: "Berufszweig",
    props: ["tag_category_ids"],
  },
  services: {
    label: "6. Ordne deinem Kurs / Veranstaltung passende Filter zu, um die Leistungen gezielter zu beschreiben *",
    tooltip: "",
    description: "Leistung",
    props: ["tag_category_ids"],
  },
  date: {
    label:
      "7. Gib das Kursdatum, sowie die Uhrzeit an. Findet dein Kurs öfter statt, kannst du mehrere Termine auswählen und diese auch wieder löschen *",
    tooltip: "",
    description: "Kursdatum",
    props: ["event_dates"],
  },
  certificates: {
    label:
      "8. Handelt es sich um einen von GKV geförderten Präventionskurs? Falls ja, lade bitte das Zertifikat der ZPP (Zentrale Prüfstelle Prävention) hoch",
    tooltip: "",
    description: "Zertifikat",
    props: ["billable_through_health_insurance"],
  },
  website: {
    label: "9. Hinterlege den Link zu deiner Webseite oder einer Social-Media Plattform",
    tooltip: "Falls du keine eigene Webseite besitzen, überspringst du diesen Schritt.",
    description: "Webseite",
    props: ["website"],
  },
  documents: {
    label:
      "10. Hier hast du die Möglichkeit, weitere Dokumente (z.B. Kursplan) zu deinem Kurs/Veranstaltung hochzuladen",
    tooltip: "",
    description: "Dokumente",
    props: ["sanitized_documents", "offlineDocuments"],
    justSome: true,
  },
  leader: {
    label: "11. Vor- und Nachname der Kursleitung",
    tooltip: "",
    description: "Kursleitung",
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

const handleTagSelectToggle = () => {
  expandTagSelect.value = !expandTagSelect.value;
};

const deleteDate = (index: number, dates: string[]) => {
  const confirmed = confirm("Sicher dass du diesen Termin löschen möchtest?");
  if (confirmed) {
    dates.splice(index, 1);
  }
};

const editInformations = ref(false);
const isFilled = (slotProps: any, item: any) => {
  const props: string[] = item.props;
  if (!props) return;

  const slotPropsItem = slotProps.item;

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
  padding-top: 10px !important;
}

.v-select .v-select__selection-text {
  padding-top: 10px !important;
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

.ql-editor p,
.ql-editor ol,
.ql-editor ul {
  font-size: 22px;
}

.ql-blank::before {
  font-size: 18px;
}
</style>
