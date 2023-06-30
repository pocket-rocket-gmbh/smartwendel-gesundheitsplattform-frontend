<template>
  <CreateEdit v-slot="slotProps" size="100wh">
    <v-card-text>
      <v-row>
        <v-col cols="12" md="8" offset="2">
          <!-- facility / news / event -->
          <div class="py-10">
            <div v-if="slotProps.item.kind === 'facility'">
              Hier können Sie eine eigene Detailseite für Ihre Einrichtung anlegen. Bitte füllen Sie alle Felder
              sorgfältig aus. Pflichtfelder sind mit einem Sternchen versehen. Klicken Sie hier, für eine beispielhafte
              Vorschau einer ausgebauten Einrichtungsseite.
            </div>
            <div v-else-if="slotProps.item.kind === 'event'">
              Hier können Sie eigene Veranstaltungen anlegen. Bitte füllen Sie alle Felder sorgfältig aus. Pflichtfelder
              sind mit einem Sternchen versehen.
            </div>
            <div v-else-if="slotProps.item.kind === 'course'">
              Hier können Sie eigene Kurse anlegen. Bitte füllen Sie alle Felder sorgfältig aus. Pflichtfelder sind mit
              einem Sternchen versehen.
            </div>
          </div>
          <div class="field" v-if="user.isAdmin()">
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
          <div class="field">
            <div v-if="slotProps.item.kind === 'facility'">
              <b>Name der Einrichting*</b> (Hinterlegen Sie hier den Namen ihrer Einrichtung)
            </div>
            <div v-if="slotProps.item.kind === 'news'"><b>Titel*</b> (Hinterlegen Sie den Namen des Beitrags)</div>
            <div v-if="slotProps.item.kind === 'event'">
              <b>Kurs-/ Veranstaltungsname*</b> (Hinterlegen Sie den Namen des Kurses oder der Veranstaltung)
            </div>
            <v-text-field
              v-if="slotProps.item.kind === 'news'"
              v-model="slotProps.item.name"
              hide-details="auto"
              label="Überschrift"
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
          <div class="field" v-if="slotProps.item.kind === 'facility'">
            <div class="mt-15 mb-5"><b>Logo</b>(Laden Sie hier Ihr Logo hoch. )</div>
            <ChooseAndCropSingleImage
              height="20"
              :pre-set-image-url="slotProps.item.logo_url"
              label="Logo wählen"
              @setImage="setLogo"
            />
          </div>
          <div class="field">
            <div class="mt-15 mb-5">
              <div v-if="slotProps.item.kind === 'facility'">
                <b>Coverbild*</b> (Laden Sie hier ein Bild hoch, worauf Ihre Einrichtung abgebildet ist. Falls Sie kein
                passendes Bild zur Verfügung haben, wird an dieser Stelle ein passendes Standardbild hinterlegt.)
              </div>
              <div v-if="slotProps.item.kind === 'news'">
                <b>Coverbild*</b> (Laden Sie hier ein für Ihren Beitrag passendes Bild hoch. Falls Sie kein passendes
                Bild zur Verfügung haben, wird an dieser Stelle ein passendes Standardbild hinterlegt.)
              </div>
              <div v-if="slotProps.item.kind === 'event'">
                <b>Coverbild*</b> (Laden Sie hier ein Bild hoch, worauf Ihre Einrichtung abgebildet ist. Falls Sie kein
                passendes Bild zur Verfügung haben, wird an dieser Stelle ein passendes Standardbild hinterlegt.)
              </div>
            </div>
            <ChooseAndCropSingleImage
              :pre-set-image-url="slotProps.item.image_url"
              label="Cover Bild wählen"
              @setImage="setCoverBild"
            />
          </div>
          <div class="field">
            <div class="mt-15 mb-5" v-if="slotProps.item.kind === 'facility'">
              <b>Beschreibung*</b> (Nutzen Sie dieses Feld um Ihre Einrichtung detailliert zu beschreiben. Interessant
              sind Infos zum Standort, Ihre Leistungen, Ansprechpartner etc.)
            </div>
            <div class="mt-15 mb-5" v-if="slotProps.item.kind === 'news'">
              <b>Inhalt*</b>
            </div>
            <div class="mt-15 mb-5" v-if="slotProps.item.kind === 'event'">
              <b>Beschreibung*</b> (Beschreiben Sie den Kurs oder die Veranstaltung ausführlich. Sie können auch Bilder
              und Videos einbinden)
            </div>
            <ClientOnly>
              <QuillEditor
                class="ql-blank"
                :options="textOptions"
                v-model:content="slotProps.item.description"
                contentType="html"
                toolbar="minimal"
              />
            </ClientOnly>
          </div>
          <div class="field" v-if="slotProps.item.kind === 'facility' || user.isAdmin()">
            <div class="mt-15 mb-5">
              <b>Einrichtungsfilter*</b> (Weisen Sie Ihre Einrichtung gezielt einem Berufszweig / einer Sparte
              themenspezifisch zu)
            </div>
            <AdminCareFacilitiesChooseFilter
              :pre-set-tags="slotProps.item.tag_category_ids"
              filter-type="facility"
              @setTags="setTagCategoryIds"
            />
          </div>
          <div class="field" v-if="slotProps.item.kind === 'facility' || user.isAdmin()">
            <div class="mt-15 mb-5">
              <b>Leistungsfilter*</b> (Ordnen Sie Ihrer Einrichtung passende Leistungsfilter zu *)
            </div>
            <AdminCareFacilitiesChooseFilter
              :pre-set-tags="slotProps.item.tag_category_ids"
              filter-type="service"
              :enable-multi-select="true"
              @setTags="setTagCategoryIds"
            />
          </div>
          <div class="field" v-if="slotProps.item.kind !== 'facility'">
            <div class="mt-15 mb-5">
              <b>Veröffentlichkeitsdatum</b> (Wählen Sie einen Zeitraum (Start- und End-Datum), wann ihr Beitrag auf der
              Platform angezeigt werden soll. Wenn der Inhalt dauerhaft angezeigt werden soll, müssen Sie hier keine
              Infos hinterlegen.)
            </div>
            <div class="mb-15 justify-center">
              <v-row>
                <v-col cols="12" md="6">
                  <Datepicker
                    inline
                    autoApply
                    :enableTimePicker="false"
                    locale="de"
                    v-model="slotProps.item.course_start"
                    label="Start"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <Datepicker
                    inline
                    autoApply
                    :enableTimePicker="false"
                    locale="de"
                    v-model="slotProps.item.course_end"
                    label="End"
                  />
                </v-col>
              </v-row>
            </div>
          </div>
          <div class="mb-15" v-if="slotProps.item.kind === 'facility' || user.isAdmin()">
            <div class="mt-15 mb-5">
              <div v-if="slotProps.item.kind === 'facility'">
                <b>Kontakt und Infos* </b>(Hinterlegen Sie hier alle Infos zu ihrem Hauptstandort.)
              </div>
              <div v-if="slotProps.item.kind === 'event'">
                <b>Kursanbieter*</b>(Geben Sie Details zu Ihrer Einrichtung als Kurs- oder Veranstaltungsanbieter an)
              </div>
            </div>
            <div class="field">
              <v-text-field
                v-model="slotProps.item.phone"
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
                hide-details="auto"
                label="E-Mail"
                :rules="[rules.required, rules.email]"
                :error-messages="useErrors().checkAndMapErrors('email', slotProps.errors)"
              />
            </div>
            <div class="field">
              <v-text-field
                v-model="slotProps.item.street"
                hide-details="auto"
                label="Straße und Nummer"
                :rules="[rules.required, rules.counterStreet]"
                :error-messages="useErrors().checkAndMapErrors('street', slotProps.errors)"
              />
            </div>
            <div class="field">
              <v-text-field v-model="slotProps.item.additional_address_info" hide-details="auto" label="Adresszusatz" />
            </div>
            <div class="field">
              <v-select
                hide-details="auto"
                v-model="slotProps.item.community_id"
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
                hide-details="auto"
                label="PLZ"
                :type="'number'"
                :rules="[rules.required, rules.zip]"
                :error-messages="useErrors().checkAndMapErrors('zip', slotProps.errors)"
              />
              <v-select
                hide-details="auto"
                v-model="slotProps.item.town"
                :items="getTownsByCommunityId(slotProps.item.community_id)"
                item-title="name"
                item-value="name"
                label="Ort"
                :rules="[rules.required]"
              />
            </div>
          </div>
          <div class="field" v-if="slotProps.item.kind === 'facility'">
            <div class="mt-15 mb-5">
              <b>Standorte </b> (Falls Ihre Einrichtung mehrere Standorte besitzt, tragen Sie hier alle weiteren
              Standorte ein.)
            </div>
            <AdminCareFacilitiesAddLocations v-if="slotProps.item.id" :item-id="slotProps.item.id" />
          </div>
          <div class="field" v-if="slotProps.item.kind === 'facility'">
            <div class="mt-15 mb-5">
              <b>Öffnungszeiten </b> (Geben Sie Ihre Öffnungszeiten an.)
              <div class="field">
                <v-textarea
                  rows="4"
                  hide-details="auto"
                  v-model="slotProps.item.opening_hours"
                  label="Wochentag/en - Uhrzeiten"
                  :error-messages="useErrors().checkAndMapErrors('opening_hours', slotProps.errors)"
                />
              </div>
            </div>
          </div>
          <div class="field" v-if="slotProps.item.kind === 'facility'">
            <div class="mt-15 mb-15">
              <b>Infobutton </b> (Besitzt Ihre Einrichtung eine eigene Website / Social-Media-Platform, tragen Sie hier
              den entsprechenden Link ein.)
              <div class="field">
                <v-text-field
                  v-model="slotProps.item.website"
                  hide-details="auto"
                  label="Link eintragen"
                  :error-messages="useErrors().checkAndMapErrors('link', slotProps.errors)"
                />
              </div>
            </div>
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

const user = useUser();

const textOptions = ref({
  debug: false,
  placeholder: "Einrichtung Beschreibung",
  theme: "snow",
  contentType: "html",
  toolbar: "essential",
});

const setTagCategoryIds = (tags: any) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", { name: "tag_category_ids", value: tags });
};

const setLogo = (image: any) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", { name: "logo", value: image });
};

const setCoverBild = (image: any) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", { name: "file", value: image });
};

const status = ref([
  { name: "In Prüfung", id: "is_checked" },
  { name: "Freigegeben", id: "confirmed" },
  { name: "Abgelehnt", id: "rejected" },
]);

const eventTyp = ref([
  { name: "Kurs", id: "" },
  { name: "Veranstaltung", id: "" },
]);

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
    useNuxtApp().$bus.$emit("setPayloadFromSlotChild", { name: "zip", value: found.zip });
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
.cropper-wrap
  max-width: 450px

.fields
  max-width: 70vw
</style>
