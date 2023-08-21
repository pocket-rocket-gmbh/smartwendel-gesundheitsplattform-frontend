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
            <span class="text-h6"
              >Als Gesundheitsakteur im Landkreis St. Wendel kannst du hier dein spezifisches Leistungsangebot in einem
              eigenen Profil darstellen und veröffentlichen. Fülle die Details zu deinem Angebot aus. Je spezifischer
              deine Angaben sind, desto besser können dich Besucherinnen und Besucher der Webseite finden. Pflichtfelder
              sind mit einem Sternchen versehen.</span
            >
          </div>
          <div class="field" id="name">
            <div class="my-2">
              <span class="text-h5 font-weight-bold">{{ steps["name"].label }}</span>
            </div>
            <v-text-field
              class="text-field"
              v-model="slotProps.item.name"
              hide-details="auto"
              label="Einrichtung/Unternehmen/Behörde/Verein/Verband"
              :rules="[rules.required]"
              :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
            />
          </div>
          <v-divider class="my-10"></v-divider>

          <div class="field" id="logo">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3">{{ steps["logo"].label }}</span>
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props">mdi-information-outline</v-icon>
                </template>
                <span>{{ steps["logo"].tooltip }}</span>
              </v-tooltip>
            </div>
            <ChooseAndCropSingleImage
              height="20"
              :pre-set-image-url="slotProps.item.logo_url"
              :temp-image="slotProps.item.logo"
              label="Logo"
              @setImage="setLogo"
              @delete-image="handleDeleteLogo"
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
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props">mdi-information-outline</v-icon>
                </template>
                <span>{{ steps["photo"].tooltip }}</span>
              </v-tooltip>
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
            <div class="my-3 d-flex align-center">
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

          <div class="field" id="contact" :class="[setupFinished || editInformations ? 'has-bg-light-red pa-5' : '']">
            <span v-if="setupFinished">
              <v-alert type="warning" density="compact" class="mt-2"
                >Änderungen vorgenommen! Aufgrund dieser Änderungen muss diese Einrichtung vom Landkreis neu freigegeben
                werden</v-alert
              >
            </span>
            <div class="my-2 d-flex align-center">
              <span class="text-h5 mr-3 font-weight-bold">{{ steps["contact"].label }}</span>
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props">mdi-information-outline</v-icon>
                </template>
                <span>{{ steps["contact"].tooltip }}</span>
              </v-tooltip>
              <div v-if="setupFinished && !useUser().isAdmin()">
                <span v-if="editInformations">
                  <v-btn size="small" @click="editInformations = false"> fertig </v-btn>
                </span>
                <span v-else>
                  <v-btn size="small" @click="confirmEditDialogOpen = true"> Adresse ändern </v-btn>
                </span>
              </div>
            </div>

            <EditItem
              :open="confirmEditDialogOpen"
              @accepted="
                editInformations = true;
                confirmEditDialogOpen = false;
              "
              @close="
                confirmEditDialogOpen = false;
                editInformations = false;
              "
            />
            <div class="field">
              <v-text-field
                class="text-field"
                v-model="slotProps.item.street"
                :disabled="!useUser().isAdmin() && !editInformations && setupFinished"
                hide-details="auto"
                label="Straße und Nummer"
                :rules="[rules.required, rules.counterStreet]"
                :error-messages="useErrors().checkAndMapErrors('street', slotProps.errors)"
              />
            </div>
            <div class="field">
              <v-text-field
                class="text-field"
                v-model="slotProps.item.additional_address_info"
                :disabled="!useUser().isAdmin() && !editInformations && setupFinished"
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
                :rules="[rules.required]"
              />
            </div>
            <div class="field split">
              <v-text-field
                class="text-field"
                v-model="slotProps.item.zip"
                disabled
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
                :disabled="!useUser().isAdmin() && !editInformations && setupFinished"
                :items="getTownsByCommunityId(slotProps.item.community_id)"
                item-title="name"
                item-value="name"
                label="Ort"
                :rules="[rules.required]"
              />
            </div>
            <div class="field">
              <v-text-field
                class="text-field"
                v-model="slotProps.item.phone"
                :disabled="!useUser().isAdmin() && !editInformations && setupFinished"
                hide-details="auto"
                label="Telefonnummer"
                :rules="[rules.required, rules.validateNumber]"
                :type="'tel'"
                :error-messages="useErrors().checkAndMapErrors('phone', slotProps.errors)"
              />
            </div>
            <div class="field">
              <v-text-field
                class="text-field"
                v-model="slotProps.item.email"
                :disabled="!useUser().isAdmin() && !editInformations && setupFinished"
                hide-details="auto"
                label="E-Mail"
                :rules="[rules.required, rules.email]"
                :error-messages="useErrors().checkAndMapErrors('email', slotProps.errors)"
              />
            </div>
          </div>

          <v-divider class="my-10"></v-divider>

          <div class="field" id="locations">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 mr-3 font-weight-bold">{{ steps["locations"].label }}</span>
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props">mdi-information-outline</v-icon>
                </template>
                <span>{{ steps["locations"].tooltip }}</span>
              </v-tooltip>
            </div>
            <AdminCareFacilitiesAddLocations
              :item-id="slotProps.item.id"
              :offline-name="slotProps.item.name"
              :offline-locations="slotProps.item.offlineLocations"
              @offline="handleLocationsAddOffline"
              @update="handleLocationsUpdate"
            />
          </div>

          <v-divider class="my-10"></v-divider>

          <div class="field" id="openingHours">
            <div class="my-2">
              <span class="text-h5 font-weight-bold">{{ steps["openingHours"].label }}</span>
              <v-textarea
                class="text-field"
                rows="4"
                hide-details="auto"
                v-model="slotProps.item.opening_hours"
                label="Wochentag/e - Uhrzeit"
                :error-messages="useErrors().checkAndMapErrors('opening_hours', slotProps.errors)"
              />
            </div>
          </div>

          <v-divider class="my-10"></v-divider>

          <div class="field" id="website">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3">{{ steps["website"].label }}</span>
              <v-tooltip location="top" width="200px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props">mdi-information-outline</v-icon>
                </template>
                <span>{{ steps["website"].tooltip }}</span>
              </v-tooltip>
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
        </v-col>
      </v-row>
    </v-card-text>
  </CreateEdit>
</template>

<script setup lang="ts">
import "@vuepic/vue-datepicker/dist/main.css";
import { CreateEditFacility, CreateEditStep, CreateEditSteps } from "~/types/facilities";
import { FilterType } from "~/store/searchFilter";
import { rules } from "../../../data/validationRules";

const stepNames = [
  "name",
  "logo",
  "photo",
  "gallery",
  "description",
  "category",
  "services",
  "contact",
  "locations",
  "openingHours",
  "website",
  "documents",
] as const;
type StepNames = (typeof stepNames)[number];
const steps: CreateEditSteps<StepNames> = {
  name: {
    label: "1. Hinterlege den Namen deiner Einrichtung *",
    description: "Name",
    props: ["name"],
  },
  logo: {
    label: "2. Hier kannst du dein Logo hochladen. *",
    description: "Dein Logo",
    props: ["logo_url", "logo"],
    justSome: true,
    tooltip:
      "Dein Logo wird im Kopfbereich deiner Profilseite angezeigt. Falls du kein eigenes Logo hast, kannst du ein passendes Bild aus unserer Datenbank auswählen. ",
  },
  photo: {
    label: "3.	Bitte lade hier dein Coverbild hoch. *",
    tooltip:
      "Das Coverbild wird zusammen mit deinem Logo im Kopfbereich deiner Profilseite angezeigt. Wähle hier am besten ein Bild, welches dein Unternehmen/deine Einrichtung gut repräsentiert. Falls du kein Coverbild hast, kannst du ein passendes Bild aus unserer Datenbank auswählen.",
    description: "Coverbild",
    props: ["image_url", "file"],
    justSome: true,
  },
  gallery: {
    label: "4.	Hier kannst du Bilder für deine Galerie hochladen.",
    description: "Fotogalerie",
    props: ["sanitized_images"],
    tooltip:
      "Mithilfe von Galeriebildern können Besucherinnen und Besucher einen ersten Eindruck deines Unternehmens/deiner Einrichtung erhalten.",
  },
  description: {
    label:
      "5. Bitte beschreibe deine Einrichtung/dein Unternehmen und das damit verbundene Leistungsangebot ausführlich. *",
    description: "Beschreibungstext",
    placeholder:
      "Nutze dieses Feld, um deine Einrichtung/dein Unternehmen ausführlich zu präsentieren. Hier kannst du bspw. Informationen zu deinem individuellen Leistungsangebot, deinem Standort, den wichtigsten Ansprechpartnerinnen und Ansprechpartnern, Links zu deinen Sozialen Medien und weitere Informationen, die du den Nutzerinnen und Nutzern mitgeben möchtest hinterlegen. Je detaillierter die Beschreibung, desto einfacher können dich Besucherinnen und Besucher über das Suchfeld der Startseite finden.",
    props: ["description"],
    checkHandler: isDescriptionEmpty,
  },
  category: {
    label: "6. Bitte wähle deine Branche aus *",
    description: "Branchenzugehörigkeit",
    props: ["tag_category_ids"],
    specialFilter: "filter_facility",
    tooltip: "Mehrfachangaben möglich.",
  },
  services: {
    label: "7. Bitte ordne deiner Einrichtung/deinem Unternehmen passende Ausstattungs- und Leistungsfilter zu. *",
    tooltip:
      "Wähle alle für dich relevanten Filter aus. Je genauer deine Angaben zu den einzelnen Filterbereichen, umso leichter können dich Besucherinnen und Besucher im Rahmen einer benutzerdefinierten Suche finden. ",
    description: "Leistungen und Schlagwörter",
    props: ["tag_category_ids"],
    specialFilter: "filter_service",
  },
  contact: {
    label: "8. Bitte gib hier die Adresse und Kontaktdaten deiner Einrichtung/deines Unternehmens an. *",
    tooltip: "Hauptstandort deines Unternehmens/deiner Einrichtung.",
    description: "Kontaktdaten",
    props: ["street", "zip", "community_id", "town", "email", "phone"],
  },
  locations: {
    label: "9. Falls deine Einrichtung mehrere Standorte hat, kannst du diese hier ergänzen.",
    description: "Weitere -Standorte",
    props: ["locations", "offlineLocations"],
    justSome: true,
    tooltip: " Bitte beachte, dass nur Standorte innerhalb des Landkreises Sankt Wendel angegeben werden können.",
  },
  openingHours: {
    label: "10.	Bitte trage hier deine genauen Öffnungszeiten ein.",
    description: "Öffnungszeiten",
    props: ["opening_hours"],
    tooltip:
      "Falls du mehrere Kanäle in den Sozialen Medien hast, kannst du diese auch im Beschreibungstext (Punkt 5) einfügen.",
  },
  website: {
    label:
      "11.	Hier kannst du einen Link zu deiner Webseite oder einem deiner Kanäle in den Sozialen Medien hinterlegen.",
    tooltip:
      "Falls du mehrere Kanäle in den Sozialen Medien hast, kannst du diese auch im Beschreibungstext (Punkt 5) einfügen.",
    description: "Links",
    props: ["website"],
  },
  documents: {
    label: "12.	Hier kannst du Dokumente zu deiner Einrichtung/deinem Unternehmen hochladen.",
    tooltip: "Dokumente können z. B. dein aktueller Kursplan, eine Unternehmenspräsentation oder Anmeldebögen sein. ",
    description: "Weitere Dokumente",
    props: ["sanitized_documents", "offlineDocuments"],
    justSome: true,
  },
};

const expandTagSelect = ref(true);
const createEditRef = ref();

const facilitiesFilterSet = ref(false);
const servicesFilterSet = ref(false);

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

const editInformations = ref(false);
const confirmEditDialogOpen = ref(false);

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

const setLogo = (image: any) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "logo",
    value: image,
  });
};

const handleDeleteLogo = () => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "logo",
    value: null,
  });
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "logo_url",
    value: null,
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

const handleLocationsAddOffline = (newOfflineLocations: { latitude: number; longitude: number }[]) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "offlineLocations",
    value: newOfflineLocations,
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

const handleLocationsUpdate = (locations: any) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "locations",
    value: locations,
  });
};

const goToField = (stepName: string) => {
  const el = document.getElementById(stepName);
  if (!el) {
    return;
  }
  el.scrollIntoView({ behavior: "smooth", block: "center" });
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
  font-size: 15px !important;
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
