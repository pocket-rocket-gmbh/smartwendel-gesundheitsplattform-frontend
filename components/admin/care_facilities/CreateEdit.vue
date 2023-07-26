<template>
  <CreateEdit v-slot="slotProps" size="100wh">
    <v-card-text v-if="slotProps.item && Object.entries(slotProps.item).length" class="mb-15">
      <v-row>
        <v-col md="2">
          <div class="mt-10 mx-5 menu-boxes">
            <div
              class="d-flex align-center my-3 justify-center align-center select-box mx-1 pa-1 is-clickable"
              v-for="(item, index) in fields[slotProps.item.kind]"
              :key="index"
              @click="goToField(item.index)"
            >
              <div class="is-clickable d-flex" @click="goToField(item.index)">
                <span>{{ item.description }}</span>
                <!--  <div class="">
                  <div v-if="isFilled(slotProps, item)">
                    <v-icon color="success">mdi-check-circle-outline</v-icon>
                  </div>
                  <div v-else>
                    <v-icon color="error">mdi-close-circle-outline</v-icon>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </v-col>
        <v-col md="10">
          <!-- facility / news / event -->
          <div class="py-10">
            <div v-if="slotProps.item.kind === 'facility'">
              <span class="text-h6"
                >Hier kannst du eine eigene Detailseite für deine Einrichtung anlegen. Bitte fülle dazu, wenn möglich,
                alle Felder sorgfältig aus. Pflichtfelder sind mit einem Sternchen versehen.</span
              >
            </div>
            <div v-if="slotProps.item.kind === 'news'">
              <span class="text-h6"
                >Hier kannst du News oder Beiträge anlegen. Bitte fülle alle Felder sorgfältig aus. Pflichtfelder sind
                mit einem Sternchen versehen.</span
              >
            </div>
            <div v-if="slotProps.item.kind === 'course'">
              <span class="text-h6"
                >Hier kannst du eigene Kurse anlegen. Bitte fülle dazu wenn möglich alle Felder sorgfältig aus.
                Pflichtfelder sind mit einem Sternchen versehen.</span
              >
            </div>
            <div v-if="slotProps.item.kind === 'event'">
              <span class="text-h6"
                >Hier kannst Du eigene Veranstaltungen anlegen. Bitte fülle dazu wenn möglich alle Felder sorgfältig
                aus. Pflichtfelder sind mit einem Sternchen versehen.</span
              >
            </div>
          </div>
          <div class="field" id="1">
            <div class="my-2">
              <span class="text-h5 font-weight-bold" v-if="fields[slotProps.item.kind]">{{
                fields[slotProps.item.kind]["1"].label
              }}</span>
            </div>
            <v-text-field
              v-if="slotProps.item.kind === 'news'"
              v-model="slotProps.item.name"
              hide-details="auto"
              label="Überschrift"
              :rules="[rules.required]"
              :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
            />
            <v-text-field
              v-if="slotProps.item.kind !== 'news'"
              v-model="slotProps.item.name"
              hide-details="auto"
              label="Name"
              :rules="[rules.required]"
              :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
            />
          </div>
          <v-divider class="my-10"></v-divider>
          <div class="field" id="2" v-if="slotProps.item.kind === 'facility'">
            <div class="my-2">
              <span class="text-h5 font-weight-bold" v-if="fields[slotProps.item.kind]">{{
                fields[slotProps.item.kind]["2"].label
              }}</span>
            </div>
            <ChooseAndCropSingleImage
              height="20"
              :pre-set-image-url="slotProps.item.logo_url"
              label="Logo"
              @setImage="setLogo"
            />
          </div>
          <v-divider class="my-10" v-if="slotProps.item.kind === 'facility'"></v-divider>

          <div class="field" id="3">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3" v-if="fields[slotProps.item.kind]">{{
                fields[slotProps.item.kind]["3"].label
              }}</span>
            </div>
            <ChooseAndCropSingleImage
              :pre-set-image-url="slotProps.item.image_url"
              label="Cover Bild"
              @setImage="setCoverBild"
            />
          </div>
          <v-divider class="my-10"></v-divider>
          <div class="field" id="4" v-if="slotProps.item.kind !== 'news'">
            <div class="my-2">
              <span class="text-h5 font-weight-bold" v-if="fields[slotProps.item.kind]">{{
                fields[slotProps.item.kind]["4"].label
              }}</span>
            </div>
            <AdminCareFacilitiesAddImages :item-id="slotProps.item.id" @offline="(file) => setOfflineImage(file)" />
          </div>
          <v-divider class="my-10" v-if="slotProps.item.kind !== 'news'"></v-divider>

          <div class="field" id="5">
            <div class="my-2">
              <span class="text-h5 font-weight-bold" v-if="fields[slotProps.item.kind]">{{
                fields[slotProps.item.kind]["5"].label
              }}</span>
            </div>
            <div class="editor">
              <ClientOnly>
                <QuillEditor
                  ref="ql-editor"
                  class="ql-blank"
                  :placeholder="fields[slotProps.item.kind]['5'].placeholder"
                  :options="textOptions"
                  v-model:content="slotProps.item.description"
                  contentType="html"
                  :toolbar="textToolbar"
                />
              </ClientOnly>
            </div>
          </div>
          <v-divider class="my-10"></v-divider>

          <div class="field" id="6">
            <div class="my-3">
              <span class="text-h5 font-weight-bold" v-if="fields[slotProps.item.kind]">{{
                fields[slotProps.item.kind]["6"].label
              }}</span>
            </div>
            <AdminCareFacilitiesChooseFilter
              :pre-set-tags="slotProps.item.tag_category_ids"
              filter-type="filter_facility"
              :filter-kind="slotProps.item.kind"
              @setTags="setTagCategoryIds"
            />
          </div>

          <v-divider class="my-10"></v-divider>

          <div class="field" id="7">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3" v-if="fields[slotProps.item.kind]">{{
                fields[slotProps.item.kind]["7"].label
              }}</span>
              <v-tooltip location="top" width="300px" v-if="slotProps.item.kind === 'facility'">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props">mdi-information-outline</v-icon>
                </template>
                <span v-if="fields[slotProps.item.kind]">{{ fields[slotProps.item.kind]["7"].tooltip }}</span>
              </v-tooltip>
            </div>
            <AdminCareFacilitiesChooseFilter
              :pre-set-tags="slotProps.item.tag_category_ids"
              filter-type="filter_service"
              :filter-kind="slotProps.item.kind"
              :enable-multi-select="true"
              @setTags="setTagCategoryIds"
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
          <div class="field" id="8" v-if="slotProps.item.kind === 'course' || slotProps.item.kind === 'event'">
            <div class="my-2">
              <span class="text-h5 mr-2 font-weight-bold" v-if="fields[slotProps.item.kind]">{{
                fields[slotProps.item.kind]["date"].label
              }}</span>
            </div>
            <div class="mb-15">
              <v-row>
                <v-col md="4" class="d-flex align-center justify-center">
                  <Datepicker
                    v-if="slotProps.item.kind === 'course'"
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
                  <Datepicker
                    v-if="slotProps.item.kind === 'event'"
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
                  <v-table density="compact" fixed-header height="400px" v-if="slotProps.item.kind === 'course'">
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
                  <v-table density="compact" fixed-header height="400px" v-if="slotProps.item.kind === 'event'">
                    <thead>
                      <tr>
                        <th class="text-left">Datum</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(date, index) in slotProps.item.event_dates" :key="index">
                        <td>{{ date }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
            </div>
          </div>
          <v-divider
            class="my-10"
            v-if="slotProps.item.kind === 'course' && slotProps.item.kind === 'event'"
          ></v-divider>

          <div class="field" id="9" v-if="slotProps.item.kind === 'course'">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3" v-if="fields[slotProps.item.kind]">{{
                fields[slotProps.item.kind]["insurance"].label
              }}</span>
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props">mdi-information-outline</v-icon>
                </template>
                <span v-if="fields[slotProps.item.kind]">{{ fields[slotProps.item.kind]["insurance"].tooltip }}</span>
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
          <v-divider class="my-10" v-if="slotProps.item.kind === 'course'"></v-divider>
          <div
            class="field"
            id="8"
            v-if="slotProps.item.kind === 'facility'"
            :class="[(changed && setupFinished) || editInformations ? 'has-bg-light-red pa-5' : '']"
          >
            <span v-if="changed && setupFinished">
              <v-alert type="warning" density="compact" class="mt-2"
                >Änderungen vorgenommen! Aufgrund dieser Änderungen muss diese Einrichtung vom Landkreis neu freigegeben
                werden</v-alert
              >
            </span>
            <div class="my-2 d-flex align-center">
              <span class="text-h5 mr-2 font-weight-bold" v-if="fields[slotProps.item.kind]">{{
                fields[slotProps.item.kind]["8"].label
              }}</span>
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
                v-model="slotProps.item.additional_address_info"
                :disabled="!useUser().isAdmin() && !editInformations && setupFinished"
                hide-details="auto"
                label="Adresszusatz"
              />
            </div>
            <div class="field">
              <v-select
                hide-details="auto"
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
                v-model="slotProps.item.zip"
                :disabled="!useUser().isAdmin() && !editInformations && setupFinished"
                hide-details="auto"
                label="PLZ"
                :type="'number'"
                :rules="[rules.required, rules.zip]"
                :error-messages="useErrors().checkAndMapErrors('zip', slotProps.errors)"
              />
              <v-select
                hide-details="auto"
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
                v-model="slotProps.item.phone"
                :disabled="!useUser().isAdmin() && !editInformations && setupFinished"
                hide-details="auto"
                label="Telefonnummer"
                :rules="[rules.required]"
                :type="'number'"
                :error-messages="useErrors().checkAndMapErrors('phone', slotProps.errors)"
              />
            </div>
            <div class="field">
              <v-text-field
                v-model="slotProps.item.email"
                :disabled="!useUser().isAdmin() && !editInformations && setupFinished"
                hide-details="auto"
                label="E-Mail"
                :rules="[rules.required, rules.email]"
                :error-messages="useErrors().checkAndMapErrors('email', slotProps.errors)"
              />
            </div>
          </div>

          <v-divider class="my-10" v-if="slotProps.item.kind === 'facility'"></v-divider>

          <div class="field" id="9" v-if="slotProps.item.kind === 'facility'">
            <div class="my-2">
              <div class="text-h5 font-weight-bold">
                <span class="text-h5 mr-2 font-weight-bold" v-if="fields[slotProps.item.kind]">{{
                  fields[slotProps.item.kind]["9"].label
                }}</span>
              </div>
            </div>
            <AdminCareFacilitiesAddLocations
              :item-id="slotProps.item.id"
              :offline-name="slotProps.item.name"
              :offline-locations="slotProps.item.offlineLocations"
              @offline="handleLocationsAddOffline"
            />
          </div>

          <v-divider class="my-10" v-if="slotProps.item.kind === 'facility'"></v-divider>

          <div class="field" id="10" v-if="slotProps.item.kind === 'facility'">
            <div class="my-2">
              <span class="text-h5 font-weight-bold" v-if="fields[slotProps.item.kind]">{{
                fields[slotProps.item.kind]["10"].label
              }}</span>
              <!-- <div v-for="day in daysOfWeek" class="d-flex align-center">
                <v-row>
                  <v-col class="d-flex align-center" md="2">
                    <span class="pr-3">{{ day }}</span>
                  </v-col>
                  <v-col>   
                    <div class="field">
                      <v-text-field
                        v-model="slotProps.item.opening_hours"
                        :disabled="!useUser().isAdmin() && !editInformations && setupFinished"
                        hide-details="auto"
                        type="time"
                        label="uhu"
                      />
                    </div>
                  </v-col>
                </v-row>
              </div> -->
              <v-textarea
                rows="4"
                hide-details="auto"
                v-model="slotProps.item.opening_hours"
                label="Wochentag/e - Uhrzeit"
                :error-messages="useErrors().checkAndMapErrors('opening_hours', slotProps.errors)"
              />
            </div>
          </div>

          <v-divider class="my-10" v-if="slotProps.item.kind === 'facility'"></v-divider>

          <div class="field" id="11" v-if="slotProps.item.kind === 'facility'">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3" v-if="fields[slotProps.item.kind]">{{
                fields[slotProps.item.kind]["11"].label
              }}</span>
            </div>
            <v-text-field
              type="url"
              v-model="slotProps.item.website"
              hide-details="auto"
              label="Link eintragen"
              :error-messages="useErrors().checkAndMapErrors('link', slotProps.errors)"
            />
          </div>

          <v-divider class="my-10" v-if="slotProps.item.kind === 'facility'"></v-divider>

          <div class="field" id="12" v-if="slotProps.item.kind !== 'news'">
            <div class="my-2 d-flex align-center">
              <span class="text-h5 font-weight-bold mr-3" v-if="fields[slotProps.item.kind]">{{
                fields[slotProps.item.kind]["12"].label
              }}</span>
              <v-tooltip location="top" width="300px" v-if="slotProps.item.kind !== 'event'">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable mr-10" v-bind="props">mdi-information-outline</v-icon>
                </template>
                <span v-if="fields[slotProps.item.kind] && slotProps.item.kind !== 'event'">{{
                  fields[slotProps.item.kind]["12"].tooltip
                }}</span>
              </v-tooltip>
            </div>
            <AdminCareFacilitiesAddFiles
              :item-id="slotProps.item.id"
              tag-name="documents"
              :offline-documents="slotProps.item.offlineDocuments"
              @offline="handleDocumentsOffline"
            />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </CreateEdit>
</template>

<script setup lang="ts">
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { rules } from "../../../data/validationRules";
import { de } from "date-fns/locale";
import { CreateEditFacility } from "types/facilities";
import { RefSymbol } from "@vue/reactivity";

const user = useUser();
const infosChanged = ref(false);

const serviceFilterRef = ref(null);
const expandTagSelect = ref(false);

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
const confirmEditDialogOpen = ref(false);
/* 
const daysOfWeek = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];
 */
const fields = {
  facility: {
    "1": {
      label: "1. Hinterlege den Namen deiner Einrichtung *",
      tooltip: "",
      description: "Name",
      index: 1,
      changed: false,
      prop: "name",
    },
    "2": {
      label: "2. Lade dein Logo hoch *",
      tooltip: "",
      description: "Logo",
      index: 2,
      prop: "logo",
    },
    "3": {
      label: "3. Lade ein Coverbild hoch *",
      tooltip:
        "Das Coverbild ziert den Header-Bereich Ihrer Detail-Seite und gibt dem Besucher einen ersten Einblick auf deine Einrichtung. Mit den weiteren Einrichtungsbildern, die man im nächsten Schritt hochladen kann, erstellst du eine Galerie, die dem Besucher weitere Einblicke in Ihre Einrichtung geben. ",
      description: "Foto",
      index: 3,
      prop: "image_url",
    },
    "4": {
      label: "4. Lade Bilder für eine Galerie hoch",
      tooltip: "",
      description: "Galerie Fotos",
      index: 4,
    },
    "5": {
      label: "5. Beschreibe deine Einrichtung ausführlich *",
      tooltip: "",
      description: "Beschreibung",
      index: 5,
      placeholder:
        "Nutze dieses Feld, um deine Einrichtung detailliert zu beschreiben. Interessant sind Infos zum Standort, Deine Leistungen, Ansprechpartner, etc.",
      prop: "description",
    },
    "6": {
      label: "6. Weise deine Einrichtung gezielt einem Berufszweig / einer Sparte zu *",
      tooltip: "",
      description: "Berufszweig",
      index: 6,
      prop: "tag_category_ids",
    },
    "7": {
      label: "7. Ordne deiner Einrichtung passende Filter zu *",
      tooltip:
        "Anhand der ausgewählten Filter beschreibst du deine Einrichtung genauer. Deine Leistungen und dein Alleinstellungsmerkmal hilft den Benutzern, dich und deine Einrichtung in der Anbietersuche schneller zu finden. Sollte deine Leistung nicht aufgeführt sein, darfst du Liste gerne erweitern.",
      description: "Leistung",
      index: 7,
      prop: "tag_category_ids",
    },
    "8": {
      label: "8. Deine Adresse *",
      tooltip: "Ihr Adresse wir auf der Karte in der Anbietersuche angezeigt",
      description: "Kontaktdaten",
      index: 8,
    },

    "9": {
      label: "9. Falls deine Einrichtung mehrere Standorte hat, füge diese hier hinzu",
      tooltip: "",
      description: "Standorte",
      index: 9,
    },
    "10": {
      label: "10. Trage deine Öffnungszeiten ein",
      tooltip: "",
      description: "Öffnungszeiten",
      index: 10,
    },
    "11": {
      label: "11. Hinterlege den Link zu deiner Webseite oder einer Social-Media Plattform",
      tooltip: "Falls du keine eigene Webseite besitzen, überspringst du diesen Schritt.",
      description: "Webseite",
      index: 11,
    },
    "12": {
      label: "12. Lade Dokumente hoch",
      tooltip:
        "Die gesammelten Dokumente (Berichte, Ratgeber, etc.) werden den Benutzern auf deiner Einrichtungs-Seite zum Download angeboten. Es können lediglich PDF-Dokumente zur Verfügung gestellt werden.",
      description: "Dokumente",
      index: 12,
    },
  },
  news: {
    "1": {
      label: "1. Beitrags-Titel *",
      tooltip: "",
      description: "Name",
      index: 1,
    },
    "3": {
      label: "2. Lade Bilder für eine Galerie hoch *",
      tooltip: "",
      description: "Foto",
      index: 3,
    },
    "5": {
      label: "3. Gib hier den Inhalt deines Beitrags an *",
      tooltip: "",
      description: "Beschreibung",
      index: 5,
      placeholder: "Inhalt des Beitrags",
    },
    "6": {
      label: "4. Weise deinen Beitrag gezielt einem Berufszweig / einer Sparte zu *",
      tooltip: "",
      description: "Berufszweig",
      index: 6,
    },
    "7": {
      label: "5. Ordne deinem Beitrag passende Filter zu, um ihn besser auffindbar zu machen *",
      tooltip: "",
      description: "Leistung",
      index: 7,
    },
  },
  course: {
    "1": {
      label: "1. Gib deinem Kurs einen Namen *",
      tooltip: "",
      description: "Name",
      index: 1,
    },
    "3": {
      label: "2. Lade ein Coverbild hoch *",
      tooltip: "",
      description: "Foto",
      index: 3,
    },
    "4": {
      label: "3. Lade weitere Bilder für eine Galerie hoch",
      tooltip: "",
      description: "Galerie Fotos",
      index: 4,
    },
    "5": {
      label: "4. Gib hier eine Kursbeschreibung an *",
      tooltip: "",
      description: "Beschreibung",
      index: 5,
      placeholder: "Beschreibung des Kurses",
    },
    "6": {
      label: "5. Weise deinen Kurs / Veranstaltung gezielt einem Berufszweig / einer Sparte zu ",
      tooltip: "",
      description: "Berufszweig",
      index: 6,
    },
    "7": {
      label: "6. Ordne deinem Kurs / Veranstaltung passende Filter zu, um die Leistungen gezielter zu beschreiben *",
      tooltip: "",
      description: "Leistung",
      index: 7,
    },
    date: {
      label:
        "7. Gib das Kursdatum, sowie die Uhrzeit an. Findet dein Kurs öfter statt, kannst du mehrere Termine auswählen und diese auch wieder löschen *",
      tooltip: "",
      description: "Kursdatum",
      index: 8,
    },
    insurance: {
      label:
        "8. Handelt es sich um einen von GKV geförderten Präventionskurs? Falls ja, lade bitte das Zertifikat der ZPP (Zentrale Prüfstelle Prävention) hoch",
      tooltip: "",
      description: "Zertifikat",
      index: 9,
    },
    "12": {
      label:
        "9. Hier hast du die Möglichkeit, weitere Dokumente (z.B. Kursplan) zu deinem Kurs/Veranstaltung hochzuladen",
      tooltip: "",
      description: "Dokumente",
      index: 12,
    },
  },
  event: {
    "1": {
      label: "1. Gib deiner Veranstaltungen einen Namen *",
      tooltip: "",
      description: "Name",
      index: 1,
    },
    "3": {
      label: "2.  Lade ein Titelbild hoch *",
      tooltip: "",
      description: "Foto",
      index: 3,
    },
    "4": {
      label: "3. Lade weitere Bilder für eine Galerie hoch",
      tooltip: "",
      description: "Galerie Fotos",
      index: 4,
    },
    "5": {
      label: "4. Gib hier eine Veranstaltungsbeschreibung an *",
      tooltip: "",
      description: "Beschreibung",
      index: 5,
      placeholder: "Beschreibung der Veranstaltung",
    },
    "6": {
      label: "5. Weise deine Einrichtung gezielt einem Berufszweig / einer Sparte themenspezifisch zu *",
      tooltip: "",
      description: "Berufszweig",
      index: 6,
    },
    "7": {
      label: "6. Ordne deiner Einrichtung passende Filter zu *",
      tooltip: "",
      description: "Leistung",
      index: 7,
    },
    date: {
      label: "7. Gib das Veranstaltungsdatum, sowie die Uhrzeit an *",
      tooltip: "",
      description: "Kursdatum",
      index: 8,
    },
    "12": {
      label:
        "8. Wurden zur Veranstaltung Dokumente (z.B. Flyer) erstellt, kannst du diese hier gerne hochladen und den Benutzern zur Verfügung stellen",
      tooltip: "",
      description: "Dokumente",
      index: 12,
    },
  },
};

const isFilled = (slotProps: any, item: any) => {
  const prop = item.prop;
  if (prop && slotProps.item[prop] && slotProps.item[prop].length > 0) {
    return true;
  } else {
    return false;
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

.select-box
  border: black solid 1px
  border-radius: 10px
  background: $light-grey
  width: 100%

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
  height: 30px;
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
</style>
