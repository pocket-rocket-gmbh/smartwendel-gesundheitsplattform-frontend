<template>
  <CreateEdit
    v-slot="slotProps"
    @has-changed="adressChanged = true"
    size="100wh"
    ref="createEditRef"
  >
    <v-card-text
      v-if="slotProps.item && Object.entries(slotProps.item).length"
      class="mb-10"
    >
      <v-row>
        <v-col md="3">
          <div class="mt-10 mx-5 menu-boxes">
            <div
              v-for="[key, step] in Object.entries(steps)"
              class="d-flex align-center my-3 justify-center align-center is-dark-grey select-box mx-1 pa-1 is-clickable text-h5"
              :class="[isFilled(slotProps, step) ? 'is-filled' : '']"
              :key="key"
              @click="goToField(key)"
              v-fit-text="{ min: 16, max: 45 }"
            >
              <span
                class="general-font-size font-weight-medium word-break general-font-size"
                lang="de"
                >{{ step.description }}</span
              >
            </div>
            <span class="general-font-size is-dark-grey d-flex justify-end mb-5"
              >* Pflichtangaben</span
            >
          </div>
        </v-col>
        <v-col md="9">
          <div class="py-10">
            <span class="general-font-size is-dark-grey facility-kind-description"
              >Als Gesundheitsakteur im Landkreis St. Wendel kannst du hier dein
              spezifisches Leistungsangebot in einem eigenen Profil darstellen und
              veröffentlichen. Fülle die Details zu deinem Angebot aus. Je spezifischer
              deine Angaben sind, desto besser können dich Besucher der Webseite finden.
              Pflichtfelder sind mit einem Sternchen versehen.</span
            >
          </div>

          <div class="field" v-if="slotProps.item?.user?.onboarding_token">
            <div class="my-2 d-flex align-center">
              <span class="general-font-size is-dark-grey font-weight-bold mr-3"
                >URL zur Einrichtungsübernahme generieren</span
              >
            </div>

            <div class="d-flex align-center">
              <div class="field split d-flex align-center">
                <v-text-field
                  class="text-field is-dark-grey"
                  :value="slotProps.item?.user?.onboarding_token"
                  disabled
                  hide-details="auto"
                />
                <v-btn
                  variant="flat"
                  color="primary"
                  rounded="pill"
                  @click="copyTokenLink(slotProps.item)"
                >
                  <span> URL kopieren </span>
                </v-btn>
              </div>
            </div>
          </div>
          <v-divider class="my-2"></v-divider>
          <div class="field" id="name">
            <div class="my-2">
              <span class="general-font-size is-dark-grey font-weight-bold">{{
                steps["name"].label
              }}</span>
            </div>
            <v-text-field
              class="text-field is-dark-grey"
              v-model="slotProps.item.name"
              hide-details="auto"
              label="Einrichtung/Unternehmen/Behörde/Verein/Verband"
              :rules="[rules.required]"
              :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
            />
            <div class="d-flex align-center my-4">
              <span class="general-font-size is-dark-grey font-weight-bold mr-3">Link zur Einrichtung: </span>
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
                </template>
                <span>Hier kannst du den letzten Teil deiner URL-Adresse individualisieren.</span>
              </v-tooltip>
              <v-text-field
                disabled
                class="text-field is-dark-grey mb-4"
                label="https://gesundes-wnd.de/public/care_facilities/"
                hide-details="auto"
                variant="plain"
                reverse
              />
              <v-text-field
                :disabled="!slugBeingEdited"
                class="ttext-right"
                v-model="slotProps.item.slug"
                hide-details="auto"
                :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
              />
            </div>
            <div class="d-flex justify-end align-center">
              <v-btn
                color="primary"
                rounded="pill"
                variant="outlined"
                class="mx-5"
                @click="copyLink(slotProps.item.slug)"
              >
                <span> Link kopieren </span>
              </v-btn>
              <span v-if="slugBeingEdited">
                <v-btn
                variant="flat"
                color="primary"
                rounded="pill"
                @click="slugBeingEdited = false"
              >
                <span v-if="slugBeingEdited"> Fertig </span>
              </v-btn>
              </span>
              <span v-else>
                <v-btn
                variant="flat"
                color="primary"
                rounded="pill"
                @click="confirmEditSlugDialogOpen = true"
              >
                <span> Link bearbeiten </span>
              </v-btn>
              </span>
            </div>
          </div>
          <EditItem
            :open="confirmEditSlugDialogOpen"
            @accepted="
              slugBeingEdited = true;
              confirmEditSlugDialogOpen = false;
            "
            @close="
              confirmEditSlugDialogOpen = false;
              slugBeingEdited = false;
            "
            type="slug"
          />
          <v-divider class="my-10"></v-divider>

          <div class="field" id="logo">
            <div class="my-2 d-flex align-center">
              <span class="general-font-size is-dark-grey font-weight-bold mr-3">{{
                steps["logo"].label
              }}</span>
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
                </template>
                <span>{{ steps["logo"].tooltip }}</span>
              </v-tooltip>
            </div>
            <ChooseAndCropSingleImage
              kind="logo"
              :item="slotProps.item"
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
              <span class="general-font-size is-dark-grey font-weight-bold mr-3">{{
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
              label="Titelbild"
              @setImage="setCoverBild"
              @delete-image="handleDeleteCover"
              :min-size="true"
            />
          </div>
          <v-divider class="my-10"></v-divider>
          <div class="field" id="gallery">
            <div class="my-2 d-flex align-center">
              <span class="general-font-size is-dark-grey font-weight-bold mr-3">{{
                steps["gallery"].label
              }}</span>
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
              <span class="general-font-size is-dark-grey font-weight-bold">{{
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
                    class="ql-blank is-dark-grey"
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
                    Pflichtangabe
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
          <div class="field" id="category">
            <div class="my-3 d-flex align-center">
              <span class="general-font-size is-dark-grey font-weight-bold mr-3">{{
                steps["category"].label
              }}</span>
              <v-tooltip location="top" width="200px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
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
              <span class="general-font-size is-dark-grey font-weight-bold mr-3">{{
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

            <AdminCareFacilitiesChooseFilter
              :pre-set-tags="slotProps.item.tag_category_ids"
              filter-type="filter_service"
              :filter-kind="slotProps.item.kind"
              :enable-multi-select="true"
              @setTags="setTagCategoryIds"
              @are-filters-set="setFiltersSet"
            />
            <AdminCareFacilitiesTagSelect
              :kind="slotProps.item.kind"
              :pre-set-tags="slotProps.item.tags || []"
              :expand="expandTagSelect"
              @toggle-expand="handleTagSelectToggle"
              @set-tags="setTagIds"
            />
          </div>

          <v-divider class="my-10"></v-divider>
          <div
            class="field"
            id="contact"
            :class="[
              (adressChanged || editInformations) &&
              user.currentUser.is_active_on_health_scope &&
              slotProps.item.id
                ? 'has-bg-light-red pa-5'
                : '',
            ]"
          >
            <span
              v-if="
                adressChanged &&
                user.currentUser.is_active_on_health_scope &&
                slotProps.item.id
              "
            >
              <v-alert type="warning" density="compact" class="mt-2"
                >Es wurden Änderungen vorgenommen! Aufgrund dessen muss die Einrichtung
                erneut von einem Mitarbeiter verifiziert werden. Vielen Dank für deine
                Geduld!</v-alert
              >
            </span>
            <div class="my-2 d-flex align-center">
              <span class="general-font-size is-dark-grey font-weight-bold">{{
                steps["contact"].label
              }}</span>
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
                </template>
                <span>{{ steps["contact"].tooltip }}</span>
              </v-tooltip>
              <div
                v-if="
                  setupFinished && !useUser().isAdmin() && useUser().statusOnHealthScope()
                "
              >
                <span v-if="editInformations">
                  <v-btn size="small" @click="editInformations = false"> fertig </v-btn>
                </span>
                <span v-else>
                  <v-btn size="small" @click="confirmEditDialogOpen = true">
                    Adresse ändern
                  </v-btn>
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
                class="text-field is-dark-grey"
                v-model="slotProps.item.street"
                :disabled="
                  !useUser().isAdmin() &&
                  !editInformations &&
                  setupFinished &&
                  useUser().statusOnHealthScope()
                "
                hide-details="auto"
                label="Straße und Nummer"
                :rules="[rules.required, rules.counterStreet]"
                :error-messages="
                  useErrors().checkAndMapErrors('street', slotProps.errors)
                "
                @input="checkValidAddress(slotProps.item)"
              />
            </div>
            {{ handleInitialCheckValidAddress(slotProps.item) }}
            <div class="field">
              <v-text-field
                class="text-field is-dark-grey"
                v-model="slotProps.item.additional_address_info"
                :disabled="
                  !useUser().isAdmin() &&
                  !editInformations &&
                  setupFinished &&
                  useUser().statusOnHealthScope()
                "
                hide-details="auto"
                label="Adresszusatz"
              />
            </div>
            <div class="field">
              <v-select
                hide-details="auto"
                class="text-field is-drak-grey"
                v-model="slotProps.item.community_id"
                :disabled="
                  !useUser().isAdmin() &&
                  !editInformations &&
                  setupFinished &&
                  useUser().statusOnHealthScope()
                "
                :items="communities"
                item-title="name"
                item-value="id"
                label="Gemeinde"
                :rules="[rules.required]"
              />
            </div>
            <div class="field split">
              <v-text-field
                class="text-field is-dark-grey"
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
                class="text-field is-dark-grey"
                v-model="slotProps.item.town"
                :disabled="
                  (!useUser().isAdmin() &&
                    !editInformations &&
                    setupFinished &&
                    useUser().statusOnHealthScope()) ||
                  !slotProps.item.zip
                "
                :items="getTownsByCommunityId(slotProps.item.community_id)"
                item-title="name"
                item-value="name"
                label="Ort"
                :rules="[rules.required]"
                @update:model-value="checkValidAddress(slotProps.item)"
              />
            </div>
            <div class="field">
              <v-text-field
                class="text-field is-dark-grey"
                v-model="slotProps.item.phone"
                :disabled="
                  !useUser().isAdmin() &&
                  !editInformations &&
                  setupFinished &&
                  useUser().statusOnHealthScope()
                "
                hide-details="auto"
                label="Telefonnummer (Sichtbar auf der Webseite. Wird zur Kontaktaufnahme verwendet.)"
                :rules="[rules.required, rules.validateNumber]"
                :type="'tel'"
                :error-messages="useErrors().checkAndMapErrors('phone', slotProps.errors)"
              />
            </div>
            <div class="field">
              <v-text-field
                class="text-field is-dark-grey"
                v-model="slotProps.item.email"
                :disabled="
                  !useUser().isAdmin() &&
                  !editInformations &&
                  setupFinished &&
                  useUser().statusOnHealthScope()
                "
                hide-details="auto"
                label="E-Mail (Sichtbar auf der Webseite. Wird zur Kontaktaufnahme verwendet.)"
                :rules="[rules.required, rules.email]"
                :error-messages="useErrors().checkAndMapErrors('email', slotProps.errors)"
              />
            </div>
            <div>
              <div class="d-flex mt-5">
                <span class="general-font-size is-dark-grey font-weight-bold"
                  >Adresse überprüfen</span
                >
                <LoadingSpinner v-if="loadingAdress" />
              </div>
              <div class="mt-3">
                <v-alert color="resecondaryd" v-if="loadingAdress">
                  <v-progress-linear
                    color="primary"
                    rounded
                    indeterminate
                    height="6"
                  ></v-progress-linear>
                </v-alert>
              </div>

              <div v-if="!slotProps.item.street || !slotProps.item.town">
                <div class="mt-3">
                  <v-alert type="info" class="general-font-size"
                    >Adresse bitte vervollständigen.</v-alert
                  >
                </div>
              </div>
              <div
                v-else-if="!isValidAddress && isValidAddress !== null && !loadingAdress"
              >
                <div class="mt-3">
                  <v-alert type="error" class="general-font-size"
                    >Adresse nicht gefunden. überprüfe deine Straße, Hausnr., Gemeinde und
                    Ort</v-alert
                  >
                </div>
              </div>
              <div class="mt-3" v-if="isValidAddress === null && editInformations">
                <v-alert type="info" class="general-font-size">
                  Neue Adresse bitte eingeben.</v-alert
                >
              </div>
              <div
                v-if="
                  isValidAddress &&
                  !loadingAdress &&
                  slotProps.item.street &&
                  slotProps.item.town
                "
              >
                <div class="mt-3">
                  <v-alert type="success" class="general-font-size">
                    Deine Adresse wurde erfolgreich hinterlegt. Bitte beachte, dass diese
                    Adresse auch auf der Webseite angezeigt wird.
                  </v-alert>
                </div>
              </div>
            </div>
          </div>
          <v-divider class="my-10"></v-divider>
          <div class="field" id="locations">
            <div class="my-2 d-flex align-center">
              <span class="general-font-size is-dark-grey font-weight-bold">{{
                steps["locations"].label
              }}</span>
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
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
              <span class="general-font-size is-dark-grey font-weight-bold">{{
                steps["openingHours"].label
              }}</span>
              <v-text-field
                v-for="day in slotProps.item.opening_hours"
                :key="day.day"
                class="mb-2 mt-5 is-dark-grey"
                v-model="day.hours"
                :placeholder="day.placeholder"
                hide-details="auto"
                :label="day.day"
              />
            </div>
          </div>
          <v-divider class="my-10"></v-divider>
          <div class="field" id="website">
            <div class="my-2 d-flex align-center">
              <span class="general-font-size is-dark-grey font-weight-bold mr-3">{{
                steps["website"].label
              }}</span>
              <v-tooltip location="top" width="200px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
                </template>
                <span>{{ steps["website"].tooltip }}</span>
              </v-tooltip>
            </div>
            <v-text-field
              class="text-field is-dark-grey"
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
              <span class="general-font-size is-dark-grey font-weight-bold mr-3">{{
                steps["documents"].label
              }}</span>
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
                </template>
                <span>{{ steps["documents"].tooltip }}</span>
              </v-tooltip>
            </div>
            <v-divider class="my-10"></v-divider>

            <AdminCareFacilitiesAddFiles
              :item-id="slotProps.item.id"
              tag-name="documents"
              :offline-documents="slotProps.item.offlineDocuments"
              @offline="handleDocumentsOffline"
              @updated-files="updatedFiles"
              @document-deleted="updatedFiles(null)"
            />
          </div>
          <div class="field" id="responsible">
            <div class="my-2 d-flex align-center">
              <span class="general-font-size is-dark-grey font-weight-bold mr-3">{{
                steps["responsible"].label
              }}</span>
            </div>
            <v-text-field
              class="text-field is-dark-grey"
              v-model="slotProps.item.name_responsible_person"
              hide-details="auto"
              label="Vor- und Nachname"
              :rules="[rules.required]"
              :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
            />
          </div>
          <v-divider class="my-5"></v-divider>
        </v-col>
      </v-row>
      <!--  <div class="missing" v-for="[key, step] in Object.entries(steps)">
        <span
          v-if="isFilled(slotProps, step) === false && step.description.includes('*')"
        >
          {{ step.description }}
        </span>
      </div> -->
    </v-card-text>
  </CreateEdit>
</template>

<script setup lang="ts">
import "@vuepic/vue-datepicker/dist/main.css";
import type {
  CreateEditFacility,
  CreateEditStep,
  CreateEditSteps,
} from "~/types/facilities";
import type { FilterType, Facility } from "~/store/searchFilter";
import { rules } from "../../../data/validationRules";
import axios from "axios";

const initialLoaded = ref(false);

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
  "responsible",
] as const;
type StepNames = typeof stepNames[number];
const steps: CreateEditSteps<StepNames> = {
  name: {
    label: "1. Hinterlege den Namen deiner Einrichtung. *",
    description: "Name *",
    props: ["name"],
  },
  logo: {
    label: "2. Hier kannst du dein Logo hochladen. *",
    description: "Dein Logo *",
    props: ["logo_url", "logo"],
    justSome: true,
    tooltip:
      "Dein Logo wird im Kopfbereich deiner Profilseite angezeigt. Falls du kein eigenes Logo hast, kannst du ein passendes Bild aus unserer Datenbank auswählen. ",
  },
  photo: {
    label: "3.	Bitte lade hier dein Titelbild hoch. *",
    tooltip:
      "Das Titelbild wird zusammen mit deinem Logo im Kopfbereich deiner Profilseite angezeigt. Wähle hier am besten ein Bild, welches dein Unternehmen/deine Einrichtung gut repräsentiert. Falls du kein Titelbild hast, kannst du ein passendes Bild aus unserer Datenbank auswählen.",
    description: "Titelbild *",
    props: ["image_url", "file"],
    justSome: true,
  },
  gallery: {
    label: "4.	Hier kannst du weitere Bilder hochladen.",
    description: "Fotogalerie",
    tooltip: "",
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
      "5. Bitte beschreibe deine Einrichtung/dein Unternehmen und das damit verbundene Leistungsangebot ausführlich. *",
    description: "Beschreibungstext *",
    placeholder:
      "Nutze dieses Feld, um deine Einrichtung/dein Unternehmen ausführlich zu präsentieren. Hier kannst du bspw. Informationen zu deinem individuellen Leistungsangebot, deinem Standort, den wichtigsten Ansprechpartnern, Links zu deinen Sozialen Medien und weitere Informationen, die du den Nutzern mitgeben möchtest hinterlegen. Je detaillierter die Beschreibung, desto einfacher können dich Besucher über das Suchfeld der Startseite finden.",
    props: ["description"],
    checkHandler: isDescriptionEmpty,
  },
  category: {
    label: "6. Bitte wähle deine Branche aus. *",
    description: "Branchenzugehörigkeit *",
    props: ["tag_category_ids"],
    specialFilter: "filter_facility",
    tooltip: "Mehrfachangaben möglich.",
  },
  services: {
    label:
      "7. Bitte ordne deiner Einrichtung/deinem Unternehmen passende Ausstattungs- und Leistungsfilter zu. *",
    tooltip:
      "Wähle alle für dich relevanten Filter aus. Je genauer deine Angaben zu den einzelnen Filterbereichen, umso leichter können dich Besucher im Rahmen einer benutzerdefinierten Suche finden. ",
    description: "Leistungen und Schlagwörter *",
    props: ["tag_category_ids"],
    specialFilter: "filter_service",
  },
  contact: {
    label:
      "8. Bitte gib hier die Adresse und Kontaktdaten deiner Einrichtung/deines Unternehmens an. *",
    tooltip: "Hauptstandort deines Unternehmens/deiner Einrichtung.",
    description: "Kontaktdaten *",
    props: ["street", "zip", "community_id", "town", "email", "phone"],
    specialFilter: "phone",
  },
  locations: {
    label:
      "9. Falls deine Einrichtung mehrere Standorte hat, kannst du diese hier ergänzen.",
    description: "Weitere Standorte",
    props: ["locations", "offlineLocations"],
    justSome: true,
    tooltip:
      " Bitte beachte, dass nur Standorte innerhalb des Landkreises Sankt Wendel angegeben werden können.",
  },
  openingHours: {
    label: "10.	Bitte trage hier deine genauen Öffnungszeiten ein.",
    description: "Öffnungszeiten",
    props: ["opening_hours"],
    tooltip:
      "Falls du mehrere Kanäle in den Sozialen Medien hast, kannst du diese auch im Beschreibungstext (Punkt 5) einfügen.",
    specialFilter: "opening_hours",
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
    label:
      "12.	Hier kannst du Dokumente zu deiner Einrichtung/deinem Unternehmen hochladen.",
    tooltip:
      "Dokumente können z. B. dein aktueller Kursplan, eine Unternehmenspräsentation oder Anmeldebögen sein.",
    description: "Weitere Dokumente",
    props: ["sanitized_documents", "offlineDocuments"],
    justSome: true,
  },
  responsible: {
    label:
      "13.	Bitte gib hier den inhaltlich Verantwortlichen für die Profilinformationen dieser Einrichtung an. *",
    tooltip: "Der Name wird in deinem Einrichtungsprofil zu sehen sein.",
    description: "Verantwortliche Person *",
    props: ["name_responsible_person"],
  },
};

const user = useUser();
const expandTagSelect = ref(true);
const createEditRef = ref();

const facilitiesFilterSet = ref(false);
const servicesFilterSet = ref(false);

const formats = ref([
  "background",
  "code",
  "italic",
  "size",
  "script",
  "header",
  "indent",
  "list",
  "align",
  "direction",
  //'link',
  //'strike',
  // 'underline',
  // 'blockquote',
  //'bold',
  //'color',
  //'font',
  //'code-block',
  //'formula'
  // 'image'
  // 'video'
]);
const textOptions = ref({
  debug: false,
  theme: "snow",
  contentType: "html",
  required: true,
  formats: formats,
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

const slugBeingEdited = ref(false);
const confirmEditSlugDialogOpen = ref(false);

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
    } else if (item.specialFilter === "opening_hours") {
      return slotPropsItem.opening_hours.some((day: any) => day.hours.length > 0);
    } else if (item.specialFilter === "phone") {
      const pattern = /^[0-9]+$/;
      return pattern.test(slotPropsItem.phone);
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

const copyLink = (item: any) => {
  if (!item) return;
  const link = `https://gesundes-wnd.de/public/care_facilities/${item}`;
  navigator.clipboard.writeText(link);
  snackbar.showSuccess(`Link kopiert`);
};

const loadingAdress = ref(false);

const handleInitialCheckValidAddress = (slotProps: any) => {
  if (initialLoaded.value) return;
  initialLoaded.value = true;
  checkValidAddress(slotProps);
};
const checkValidAddress = debounce(async (slotProps: any) => {
  const zip = slotProps?.zip;
  const street = slotProps?.street;
  const town = slotProps?.town;
  if (!!zip && !!street && !!town) {
    try {
      loadingAdress.value = true;

      await getLatLngFromAddress(zip, street, town);
      loadingAdress.value = false;
    } catch (error) {
      console.error(error);
    }
  }
});

const snackbar = useSnackbar();

const copyTokenLink = (item: any) => {
  const link = `${window.location.origin}/onboarding?token=${item?.user?.onboarding_token}`;
  navigator.clipboard.writeText(link);
  snackbar.showSuccess("Übernahme-Link generiert und kopiert.");
};

const isValidAddress = ref(null);

const getLatLngFromAddress = async (zipCode: string, street: string, town: string) => {
  try {
    const { data } = await axios.get(
      `https://geocode.maps.co/search?postalcode=${zipCode}&street=${street}&country=DE&city=${town}`
    );
    if (!data.length) {
      isValidAddress.value = false;
    } else {
      isValidAddress.value = true;
    }
    const bestResult = data[0];
    return [bestResult?.lat, bestResult?.lon];
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    loadingAdress.value = false;
  }
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

const handleDeleteGalleryImage = () => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "sanitized_images",
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

const handleLocationsAddOffline = (
  newOfflineLocations: { latitude: number; longitude: number }[]
) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "offlineLocations",
    value: newOfflineLocations,
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

const adressChanged = ref(false);
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
  //please add hover effect

.missing
  position: sticky
  z-index: 9999
  top: 30px

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
  line-height: 1.2 !important;
}

.ql-clean {
  display: none !important;
}

.ql-snow .ql-tooltip {
  z-index: 9999 !important;
}
.ql-snow .ql-tooltip::before {
  content: "Link hinzufügen" !important;
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  content: "Speichern" !important;
}
</style>
