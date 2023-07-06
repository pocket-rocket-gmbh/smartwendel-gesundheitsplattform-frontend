<template>
  <CreateEdit v-slot="slotProps" @hasChanged="changed = true" size="100wh">
    <!--     <div class="mt-10 mx-5 menu-boxes">
      <v-row>
        <v-col class="d-flex align-center justify-center select-box mx-1" v-for="(item, index) in fields[slotProps.item.kind]" :key="index">
          <div class="is-clickable" @click="goToField(item.index)">{{ item.description }}</div>
        </v-col>
      </v-row>
    </div> -->
    <v-card-text v-if="slotProps.item && Object.entries(slotProps.item).length">
      <v-row>
        <v-col cols="12" md="10" offset="1">
          <!-- facility / news / event -->
          <div class="py-10">
            <div v-if="slotProps.item.kind === 'facility'">
              <span class="text-h6"
                >Hier kannst du eine eigene Detailseite für Deine Einrichtung
                anlegen. Bitte füllen dazu wenn möglich alle Felder sorgfältig
                aus. Pflichtfelder sind mit einem Sternchen versehen.</span
              >
            </div>
            <div v-if="slotProps.item.kind === 'news'">
              <span class="text-h6"
                >Hier können Sie News oder Beiträge anlegen. Bitte füllen Sie
                alle Felder sorgfältig aus. Pflichtfelder sind mit einem
                Sternchen versehen.</span
              >
            </div>
            <div v-if="slotProps.item.kind === 'course'">
              <span class="text-h6"
                >Hier kannst Du eigene Kurse anlegen. Bitte fülle dazu wenn
                möglich alle Felder sorgfältig aus. Pflichtfelder sind mit einem
                Sternchen versehen.</span
              >
            </div>
            <div v-if="slotProps.item.kind === 'event'">
              <span class="text-h6"
                >Hier kannst Du eigene Veranstaltungen anlegen. Bitte fülle dazu
                wenn möglich alle Felder sorgfältig aus. Pflichtfelder sind mit
                einem Sternchen versehen.</span
              >
            </div>
          </div>
          <div class="field" v-if="!user.isAdmin()">
            <div class="mt-1 mb-15">
              <b>Status</b>
              <v-select
                hide-details="auto"
                v-model="slotProps.item.status"
                :items="status"
                item-title="name"
                item-value="id"
                label="Status"
                single-line
              />
            </div>
          </div>
          <div class="field" id="1">
            <div class="my-2">
              <span
                class="text-h5 font-weight-bold"
                v-if="fields[slotProps.item.kind]"
                >{{ fields[slotProps.item.kind]["1"].label }}</span
              >
            </div>
            <v-text-field
              v-if="slotProps.item.kind === 'news'"
              v-model="slotProps.item.name"
              hide-details="auto"
              label="Überschrift"
              :error-messages="
                useErrors().checkAndMapErrors('name', slotProps.errors)
              "
            />
            <v-text-field
              v-if="slotProps.item.kind !== 'news'"
              v-model="slotProps.item.name"
              hide-details="auto"
              label="Name"
              :rules="[rules.required]"
              :error-messages="
                useErrors().checkAndMapErrors('name', slotProps.errors)
              "
            />
          </div>
          <v-divider class="my-10"></v-divider>
          <div class="field" id="2" v-if="slotProps.item.kind === 'facility'">
            <div class="my-2">
              <span
                class="text-h5 font-weight-bold"
                v-if="fields[slotProps.item.kind]"
                >{{ fields[slotProps.item.kind]["2"].label }}</span
              >
            </div>
            <ChooseAndCropSingleImage
              height="20"
              :pre-set-image-url="slotProps.item.logo_url"
              label="Logo wählen"
              @setImage="setLogo"
            />
          </div>
          <v-divider
            class="my-10"
            v-if="slotProps.item.kind === 'facility'"
          ></v-divider>

          <div class="field" id="3">
            <div class="my-2 d-flex align-center">
              <span
                class="text-h5 font-weight-bold mr-3"
                v-if="fields[slotProps.item.kind]"
                >{{ fields[slotProps.item.kind]["3"].label }}</span
              >
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
                </template>
                <span v-if="fields[slotProps.item.kind]">{{
                  fields[slotProps.item.kind]["3"].tooltip
                }}</span>
              </v-tooltip>
            </div>
            <ChooseAndCropSingleImage
              :pre-set-image-url="slotProps.item.image_url"
              label="Cover Bild wählen"
              @setImage="setCoverBild"
            />
          </div>
          <v-divider class="my-10"></v-divider>
          <div class="field" id="4" v-if="slotProps.item.kind !== 'news'">
            <div class="my-2">
              <span
                class="text-h5 font-weight-bold"
                v-if="fields[slotProps.item.kind]"
                >{{ fields[slotProps.item.kind]["4"].label }}</span
              >
            </div>
            <AdminCareFacilitiesAddImages :item-id="slotProps.item.id" @offline="file => setOfflineImage(file)" />
          </div>
          <v-divider
            class="my-10"
            v-if="slotProps.item.kind !== 'news'"
          ></v-divider>

          <div class="field" id="5">
            <div class="my-2">
              <span
                class="text-h5 font-weight-bold"
                v-if="fields[slotProps.item.kind]"
                >{{ fields[slotProps.item.kind]["5"].label }}</span
              >
            </div>
            <ClientOnly>
              <QuillEditor
                class="ql-blank"
                :placeholder="fields[slotProps.item.kind]['5'].placeholder"
                :options="textOptions"
                v-model:content="slotProps.item.description"
                contentType="html"
                toolbar="minimal"
              />
            </ClientOnly>
          </div>

          <v-divider class="my-10"></v-divider>

          <div class="field" id="6">
            <div class="my-3">
              <span
                class="text-h5 font-weight-bold"
                v-if="fields[slotProps.item.kind]"
                >{{ fields[slotProps.item.kind]["6"].label }}</span
              >
            </div>
            <AdminCareFacilitiesChooseFilter
              :pre-set-tags="slotProps.item.tag_category_ids"
              filter-type="facility"
              @setTags="setTagCategoryIds"
            />
          </div>

          <v-divider class="my-10"></v-divider>

          <div class="field" id="7">
            <div class="my-2 d-flex align-center">
              <span
                class="text-h5 font-weight-bold mr-3"
                v-if="fields[slotProps.item.kind]"
                >{{ fields[slotProps.item.kind]["7"].label }}</span
              >
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
                </template>
                <span v-if="fields[slotProps.item.kind]">{{
                  fields[slotProps.item.kind]["7"].tooltip
                }}</span>
              </v-tooltip>
            </div>
            <AdminCareFacilitiesChooseFilter
              :pre-set-tags="slotProps.item.tag_category_ids"
              filter-type="service"
              :enable-multi-select="true"
              @setTags="setTagCategoryIds"
            />
          </div>
          <v-divider class="my-10"></v-divider>
          <div class="field" id="date" v-if="slotProps.item.kind === 'course' || slotProps.item.kind === 'event'">
            <div class="my-2">
              <span
                class="text-h5 mr-2 font-weight-bold"
                v-if="fields[slotProps.item.kind]"
                >{{ fields[slotProps.item.kind]["date"].label }}</span
              >
            </div>
            <div class="mb-15 justify-center">
              <v-row>
                <v-col cols="12" md="6">
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
                <v-list class="mt-5">
                  <v-list-item
                    v-for="(date, index) in slotProps.item.event_dates"
                    :key="index"
                  >
                    <template v-slot:prepend>
                      <v-btn
                        class="mx-3"
                        size="large"
                        color="primary"
                        target="_blank"
                        density="compact"
                        icon="mdi-calendar-outline"
                      >
                      </v-btn>
                    </template>
                    <p>{{  date }}</p>
                    <v-divider></v-divider>
                    <template v-slot:append>
                      <v-btn icon="mdi-delete" variant="text" @click="deleteDate(index, slotProps.item.event_dates)"></v-btn>
                    </template>
                  </v-list-item>
                </v-list>
              </v-row>
            </div>
          </div>
          <v-divider
            class="my-10"
            v-if="
              slotProps.item.kind === 'course' &&
              slotProps.item.kind === 'event'
            "
          ></v-divider>

          <div class="field" id="7" v-if="slotProps.item.kind === 'course'">
            <div class="my-2 d-flex align-center">
              <span
                class="text-h5 font-weight-bold mr-3"
                v-if="fields[slotProps.item.kind]"
                >{{ fields[slotProps.item.kind]["insurance"].label }}</span
              >
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
                </template>
                <span v-if="fields[slotProps.item.kind]">{{
                  fields[slotProps.item.kind]["insurance"].tooltip
                }}</span>
              </v-tooltip>
            </div>
            <div>
              <v-checkbox
                :model-value="slotProps.item.billable_through_health_insurance"
                hide-details
                density="compact"
                label="Ja"
                @click="slotProps.item.billable_through_health_insurance = !slotProps.item.billable_through_health_insurance"
              />
            </div>
            <div class="field my-5" v-if="slotProps.item.billable_through_health_insurance">
              <AdminCareFacilitiesAddFiles :item-id="slotProps.item.id" tag-name="insurance" :offline-documents="slotProps.item.offlineDocuments" @offline="handleDocumentsOffline"/>
            </div>
          </div>
          <v-divider
            class="my-10"
            v-if="slotProps.item.kind === 'course'"
          ></v-divider>
    
          <div class="field" id="8" v-if="slotProps.item.kind === 'facility'" :class="[changed || editInformations? 'has-bg-light-red pa-5' : '']">
            <span v-if="changed">
                <v-alert type="warning" density="compact" class="mt-2">Änderungen vorgenommen! Aufgrund dieser Änderungen muss diese Einrichtung vom Landkreis neu freigegeben werden</v-alert>
              </span>
            <div class="my-2 d-flex align-center">
              <span
                class="text-h5 mr-2 font-weight-bold"
                v-if="fields[slotProps.item.kind]"
                >{{ fields[slotProps.item.kind]["8"].label }}</span
              >
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
                </template>
                <span v-if="fields[slotProps.item.kind]">{{
                  fields[slotProps.item.kind]["8"].tooltip
                }}</span>
              </v-tooltip>
              <span v-if="editInformations">
                <v-btn size="small" @click="editInformations = false"> fertig </v-btn>
              </span>
              <span v-else>
                <v-btn size="small" @click="confirmEditDialogOpen = true"> Kontaktdaten ändern </v-btn>
              </span>
            </div>

              <EditItem
                :open="confirmEditDialogOpen"
                @accepted="editInformations = true; confirmEditDialogOpen = false"
                @close="confirmEditDialogOpen = false; editInformations = false"
              />

            <div class="field">
              <v-text-field
                v-model="slotProps.item.phone"
                :disabled="!useUser().isAdmin() && !editInformations"
                hide-details="auto"
                label="Telefonnummer"
                :rules="[rules.required]"
                :type="'number'"
                :error-messages="
                  useErrors().checkAndMapErrors('phone', slotProps.errors)
                "
              />
            </div>
            <div class="field">
              <v-text-field
                v-model="slotProps.item.email"
                :disabled="!useUser().isAdmin() && !editInformations"
                hide-details="auto"
                label="E-Mail"
                :rules="[rules.required, rules.email]"
                :error-messages="
                  useErrors().checkAndMapErrors('email', slotProps.errors)
                "
              />
            </div>
            <div class="field">
              <v-text-field
                v-model="slotProps.item.street"
                :disabled="!useUser().isAdmin() && !editInformations"
                hide-details="auto"
                label="Straße und Nummer"
                :rules="[rules.required, rules.counterStreet]"
                :error-messages="
                  useErrors().checkAndMapErrors('street', slotProps.errors)
                "
              />
            </div>
            <div class="field">
              <v-text-field
                v-model="slotProps.item.additional_address_info"
                :disabled="!useUser().isAdmin() && !editInformations"
                hide-details="auto"
                label="Adresszusatz"
              />
            </div>
            <div class="field">
              <v-select
                hide-details="auto"
                v-model="slotProps.item.community_id"
                :disabled="!useUser().isAdmin() && !editInformations"
                :items="communities"
                item-title="name"
                item-value="id"
                label="Gemeinde"
                :rules="[rules.required]"
              />
            </div>
            <div class="field split">
              <v-text-field
                v-model="slotProps.item.zip"
                :disabled="!useUser().isAdmin() && !editInformations"
                hide-details="auto"
                label="PLZ"
                :type="'number'"
                :rules="[rules.required, rules.zip]"
                :error-messages="
                  useErrors().checkAndMapErrors('zip', slotProps.errors)
                "
              />
              <v-select
                hide-details="auto"
                v-model="slotProps.item.town"
                :disabled="!useUser().isAdmin() && !editInformations"
                :items="getTownsByCommunityId(slotProps.item.community_id)"
                item-title="name"
                item-value="name"
                label="Ort"
                :rules="[rules.required]"
              />
            </div>
          </div>

          <v-divider
            class="my-10"
            v-if="slotProps.item.kind === 'facility'"
          ></v-divider>

          <div class="field" id="9" v-if="slotProps.item.kind === 'facility'">
            <div class="my-2">
              <div class="text-h5 font-weight-bold">
                <span
                  class="text-h5 mr-2 font-weight-bold"
                  v-if="fields[slotProps.item.kind]"
                  >{{ fields[slotProps.item.kind]["9"].label }}</span
                >
              </div>
            </div>
            <AdminCareFacilitiesAddLocations
              :item-id="slotProps.item.id"
              :offline-name="slotProps.item.name"
              :offline-locations="slotProps.item.offlineLocations"
              @offline="handleLocationsAddOffline"
            />
          </div>

          <v-divider
            class="my-10"
            v-if="slotProps.item.kind === 'facility'"
          ></v-divider>

          <div class="field" id="10" v-if="slotProps.item.kind === 'facility'">
            <div class="my-2">
              <span
                class="text-h5 font-weight-bold"
                v-if="fields[slotProps.item.kind]"
                >{{ fields[slotProps.item.kind]["10"].label }}</span
              >
              <v-textarea
                rows="4"
                hide-details="auto"
                v-model="slotProps.item.opening_hours"
                label="Wochentag/e - Uhrzeit"
                :error-messages="
                  useErrors().checkAndMapErrors(
                    'opening_hours',
                    slotProps.errors
                  )
                "
              />
            </div>
          </div>

          <v-divider
            class="my-10"
            v-if="slotProps.item.kind === 'facility'"
          ></v-divider>

          <div class="field" id="11" v-if="slotProps.item.kind === 'facility'">
            <div class="my-2 d-flex align-center">
              <span
                class="text-h5 font-weight-bold mr-3"
                v-if="fields[slotProps.item.kind]"
                >{{ fields[slotProps.item.kind]["11"].label }}</span
              >
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
                </template>
                <span v-if="fields[slotProps.item.kind]">{{
                  fields[slotProps.item.kind]["11"].tooltip
                }}</span>
              </v-tooltip>
            </div>
            <v-text-field
              type="url"
              v-model="slotProps.item.website"
              hide-details="auto"
              label="Link eintragen"
              :error-messages="
                useErrors().checkAndMapErrors('link', slotProps.errors)
              "
            />
          </div>

          <v-divider
            class="my-10"
            v-if="slotProps.item.kind === 'facility'"
          ></v-divider>

          <div class="field" id="12" v-if="slotProps.item.kind !== 'news'">
            <div class="my-2 d-flex align-center">
              <span
                class="text-h5 font-weight-bold mr-3"
                v-if="fields[slotProps.item.kind]"
                >{{ fields[slotProps.item.kind]["12"].label }}</span
              >
              <v-tooltip location="top" width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props"
                    >mdi-information-outline</v-icon
                  >
                </template>
                <span v-if="fields[slotProps.item.kind]">{{
                  fields[slotProps.item.kind]["12"].tooltip
                }}</span>
              </v-tooltip>
            </div>
            <AdminCareFacilitiesAddFiles :item-id="slotProps.item.id" tag-name="documents" :offline-documents="slotProps.item.offlineDocuments" @offline="handleDocumentsOffline"/>
          </div>

          <v-divider
            class="my-10 mb-15"
           
          ></v-divider>
        </v-col>
      </v-row>
    </v-card-text>
  </CreateEdit>
</template>

<script setup lang="ts">
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { rules } from "../../../data/validationRules";
import { de } from 'date-fns/locale';
import { CreateEditFacility } from "types/facilities";

const user = useUser();

const log = console.log

const textOptions = ref({
  debug: false,
  theme: "snow",
  contentType: "html",
  toolbar: "essential",
});

const changed = ref(false)


const deleteDate = (index:number, dates:string []) => {
  const confirmed = confirm(
    "Sicher dass du diesen Termin löschen möchtest?"
  );
  if (confirmed) {
    dates.splice(index, 1);
  }
};

const editInformations = ref(false);
const confirmEditDialogOpen = ref(false);
 


const fields = {
  facility: {
    "1": {
      label: "1. Hinterlege den Namen Deiner Einrichtung *",
      tooltip: "uhu",
      description: "Name",
      index: 1,
    },
    "2": {
      label: "2. Lade Dein Logo hoch *",
      tooltip: "uhu",
      description: "Logo",
      index: 2,
    },
    "3": {
      label: "3. Lade ein Coverbild hoch *",
      tooltip:
        "Das Coverbild ziert den Header-Bereich Ihrer Detail-Seite und gibt dem Besucher einen ersten Einblick auf Ihre Einrichtung. Mit den weiteren Einrichtungsbildern, die man im nächsten Schritt hochladen kann, erstellen Sie eine Galerie, die dem Besucher weitere Einblicke in Ihre Einrichtung geben. ",
      description: "Foto",
      index: 3,
    },
    "4": {
      label: "4. Lade Bilder für eine Galerie hoch",
      tooltip: "uhu",
      description: "Galerie Fotos",
      index: 4,
    },
    "5": {
      label: "5. Beschreiben ausführlich Deine Einrichtung *",
      tooltip: "uhu",
      description: "Beschreibung",
      index: 5,
      placeholder: "Nutze dieses Feld, um Deine Einrichtung detailliert zu beschreiben. Interessant sind Infos zum Standort, Deine Leistungen, Ansprechpartner, etc."
    },
    "6": {
      label:
        "6. Weise Deine Einrichtung gezielt einem Berufszweig / einer Sparte themenspezifisch zu *",
      tooltip: "uhu",
      description: "Berufszweig",
      index: 6,
    },
    "7": {
      label: "7. Ordne Deiner Einrichtung passende Filter zu *",
      tooltip:
        "Anhand der ausgewählten Punkte beschreiben Sie Ihre Einrichtung genauer. Ihre Leistungen und Ihr Alleinstellungsmerkmal hilft den Besuchern, Sie in den Suchen besser aufzufinden.",
      description: "Leistung",
      index: 7,
    },
    "8": {
      label: "8. Deine Kontaktdaten*",
      tooltip: "Ihr Adresse wir auf der Karte in der Anbietersuche angezeigt",
      description: "Kontaktdaten",
      index: 8,
    },
    "9": {
      label:
        "9. Falls Deine Einrichtung mehrere Standorte hat, füge diese hier hinzu",
      tooltip: "uhu",
      description: "Standorte",
      index: 9,
    },
    "10": {
      label: "10. Trage Deine Öffnungszeiten ein",
      tooltip: "uhu",
      description: "Öffnungszeiten",
      index: 10,
    },
    "11": {
      label:
        "11. Hinterlege den Link zu Deiner Webseite oder einer Social-Media Plattform",
      tooltip:
        "Falls Sie keine eigene Webseite besitzen, überspringen Sie diesen Schritt.",
      description: "Webseite",
      index: 11,
    },
    "12": {
      label: "12. Lade Dokumente hoch",
      tooltip:
        "Die gesammelten Dokumente (Berichte, Ratgeber, etc.) werden den Benutzern auf Ihrer Einrichtungs-Seite zum Download angeboten. Sie können lediglich PDF-Dokumente zur Verfügung stellen.",
      description: "Dokumente",
      index: 12,
    },
  },
  news: {
    "1": {
      label: "1. Geben Sie Ihrem Beitrag einen Titel *",
      tooltip: "uhu",
      description: "Name",
      index: 1,
    },
    "3": {
      label: "2.  Laden Sie ein Beitragsbild hoch *",
      tooltip: "uhujhjhhjhuhuhuhuh",
      description: "Foto",
      index: 3,
    },
    "5": {
      label: "3. Geben Sie hier den Inhalt Ihres Beitrages ein *",
      tooltip: "uhu",
      description: "Beschreibung",
      index: 5,
      placeholder: "Inhalt des Beitrages"
    },
    "6": {
      label:
        "6. Weise Deine Einrichtung gezielt einem Berufszweig / einer Sparte themenspezifisch zu *",
      tooltip: "uhu",
      description: "Berufszweig",
      index: 6,
    },
    "7": {
      label: "7. Ordne Deiner Einrichtung passende Filter zu *",
      tooltip:
        "Anhand der ausgewählten Punkte beschreiben Sie Ihre Einrichtung genauer. Ihre Leistungen und Ihr Alleinstellungsmerkmal hilft den Besuchern, Sie in den Suchen besser aufzufinden.",
      description: "Leistung",
      index: 7,
    },
  },
  course: {
    "1": {
      label: "1. Gib Deinem Kurs einen Namen *",
      tooltip: "uhu",
      description: "Name",
      index: 1,
    },
    "3": {
      label: "2.  Lade ein Titelbild hoch *",
      tooltip: "uhujhjhhjhuhuhuhuh",
      description: "Foto",
      index: 3,
    },
    "4": {
      label: "3. Lade weitere Bilder für eine Galerie hoch",
      tooltip: "uhu",
      description: "Galerie Fotos",
      index: 4,
    },
    "5": {
      label: "4. Gib hier eine Kursbeschreibung an *",
      tooltip: "uhu",
      description: "Beschreibung",
      index: 5,
      placeholder: "Beschreibung des Kurses"
    },
    "6": {
      label:
        "5. Weise Deine Einrichtung gezielt einem Berufszweig / einer Sparte themenspezifisch zu *",
      tooltip: "uhu",
      description: "Berufszweig",
      index: 6,
    },
    "7": {
      label: "6. Ordne Deiner Einrichtung passende Filter zu *",
      tooltip:
        "Anhand der ausgewählten Punkte beschreiben Sie Ihre Einrichtung genauer. Ihre Leistungen und Ihr Alleinstellungsmerkmal hilft den Besuchern, Sie in den Suchen besser aufzufinden.",
      description: "Leistung",
      index: 7,
    },
    date: {
      label: "7. Gib das Kursdatum, sowie die Uhrzeit an *",
      tooltip: "uhu",
      description: "Kontaktdaten",
      index: 8,
    },
    insurance: {
      label:
        "8. Handelt es sich um einen von GKV geförderten Präventionskurs? Falls ja, lade bitte das Zertifikat der ZPP (Zentrale Prüfstelle Prävention) hoch",
      tooltip: "uhu",
      description: "Kontaktdaten",
      index: 8,
    },
    "12": {
      label: "9. Lade Dokumente hoch",
      tooltip: "uhu",
      description: "Öffnungszeiten",
      index: 10,
    },
  },
  event: {
    "1": {
      label: "1. Gib Deiner Veranstaltungen einen Namen *",
      tooltip: "uhu",
      description: "Name",
      index: 1,
    },
    "3": {
      label: "2.  Lade ein Titelbild hoch *",
      tooltip: "uhujhjhhjhuhuhuhuh",
      description: "Foto",
      index: 3,
    },
    "4": {
      label: "3. Lade weitere Bilder für eine Galerie hoch",
      tooltip: "uhu",
      description: "Galerie Fotos",
      index: 4,
    },
    "5": {
      label: "4. Gib hier eine Veranstaltungsbeschreibung an *",
      tooltip: "uhu",
      description: "Beschreibung",
      index: 5,
      placeholder: "Beschreibung der Veranstaltung"
    },
    "6": {
      label:
        "5. Weise Deine Einrichtung gezielt einem Berufszweig / einer Sparte themenspezifisch zu *",
      tooltip: "uhu",
      description: "Berufszweig",
      index: 6,
    },
    "7": {
      label: "6. Ordne Deiner Einrichtung passende Filter zu *",
      tooltip:
        "Anhand der ausgewählten Punkte beschreiben Sie Ihre Einrichtung genauer. Ihre Leistungen und Ihr Alleinstellungsmerkmal hilft den Besuchern, Sie in den Suchen besser aufzufinden.",
      description: "Leistung",
      index: 7,
    },
    date: {
      label: "7. Gib das Veranstaltungsdatum, sowie die Uhrzeit an *",
      tooltip: "uhu",
      description: "Kontaktdaten",
      index: 8,
    },
    "12": {
      label: "8. Lade Dokumente hoch",
      tooltip: "uhu",
      description: "Öffnungszeiten",
      index: 10,
    },
  },
};

const setTagCategoryIds = (tags: any) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "tag_category_ids",
    value: tags,
  });
};

const setLogo = (image: any) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "logo",
    value: image,
  });
};

const setCoverBild = (image: any) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "file",
    value: image,
  });
};

const setOfflineImage = (image: any) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "offlineImageFile",
    value: image,
  });
};

const handleLocationsAddOffline = (newOfflineLocations: {latitude: number, longitude:number}[]) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "offlineLocations",
    value: newOfflineLocations,
  });
}

const handleDocumentsOffline = (newOfflineDocuments: CreateEditFacility["offlineDocuments"]) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "offlineDocuments",
    value: newOfflineDocuments,
  });
}

const status = ref([
  { name: "In Prüfung", id: "is_checked" },
  { name: "Freigegeben", id: "confirmed" },
  { name: "Abgelehnt", id: "rejected" },
]);

const eventTyp = ref([
  { name: "Kurs", id: "" },
  { name: "Veranstaltung", id: "" },
]);

const goToField = (n: Number) => {
  const id = n;
  if (id) {
    const el = document.getElementById(n);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
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
  const found = communities.value.find(
    (community: any) => community.id === communityId
  );

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

onMounted(() => {
  getCommunities();
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
.cropper-wrap
  max-width: 450px

.fields
  max-width: 70vw

.select-box
  border: black solid 1px
  border-radius: 10px
  background: $mid-grey

.menu-boxes
  position: sticky
  z-index: 9999
  top: 20px

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
  height: 30px;
  padding-right: 10px;
  background-color: #8ab61d;
}

.dp__action_button:hover {
  background-color: #8ab61d;
}

 .dp__instance_calendar
    .dp__button {
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
</style>
