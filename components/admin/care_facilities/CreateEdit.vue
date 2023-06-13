<template>
  <CreateEdit v-slot="slotProps" size="100wh">
    <v-card-text>
      <v-row>
        <v-col cols="12" md="8" offset="2">
          <!-- facility / news / event -->
          <div class="py-10">
            <div v-if="slotProps.item.kind === 'facility'">
              Hier können Sie eine eigene Detailseite für Ihre Einrichtung anlegen. Bitte füllen Sie alle Felder sorgfältig aus. Pflichtfelder sind mit einem Sternchen versehen. Klicken Sie hier, für eine beispielhafte Vorschau einer ausgebauten Einrichtungsseite.
            </div>
            <div v-else-if="slotProps.item.kind === 'news'">
              Hier können Sie News oder Beiträge anlegen. Bitte füllen Sie alle Felder sorgfältig aus. Pflichtfelder sind mit einem Sternchen versehen.
            </div>
            <div v-else-if="slotProps.item.kind === 'event'">
              Hier können Sie eigene Veranstaltungen anlegen. Bitte füllen Sie alle Felder sorgfältig aus. Pflichtfelder sind mit einem Sternchen versehen.
            </div>
            <div v-else-if="slotProps.item.kind === 'course'">
              Hier können Sie eigene Kurse anlegen. Bitte füllen Sie alle Felder sorgfältig aus. Pflichtfelder sind mit einem Sternchen versehen.
            </div>
          </div>
          <div class="field" v-if="slotProps.item.kind === 'facility'">
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
              <b>Name der Einrichting*</b> (Hinterlegen Sie den Namen Ihrer Einrichtung)
            </div>
            <div v-if="slotProps.item.kind === 'news'">
              <b>Titel*</b> (Hinterlegen Sie den Namen des Beitrags)
            </div>
            <div v-if="slotProps.item.kind === 'event'">
              <b>Kurs-/ Veranstaltungsname*</b> (Hinterlegen Sie den Namen des Kurses oder der Veranstaltung)
            </div>
              <v-text-field
                v-model="slotProps.item.name"
                hide-details="auto"
                label="Name"
                :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
              />
          </div>
          <div class="field" v-if="slotProps.item.kind === 'facility'">
            <div class="mt-15 mb-5">
              <b>Logo</b>(Laden Sie das Logo Ihrer Einrichtung hoch)
            </div>
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
                <b>Coverbild*</b> (Laden Sie im Besten Fall ein Bild hoch, worauf Ihre Einrichtung abgebildet ist. Falls Sie kein passendes Bild zur Verfügung haben, wird an dieser Stelle ein passendes Standardbild hinterlegt)
              </div>
              <div v-if="slotProps.item.kind === 'news'">
                <b>Coverbild*</b> (Laden Sie im Besten Fall ein Bild hoch, worauf Ihre Einrichtung abgebildet ist. Falls Sie kein passendes Bild zur Verfügung haben, wird an dieser Stelle ein passendes Standardbild hinterlegt)
              </div>
              <div v-if="slotProps.item.kind === 'event'">
                <b>Coverbild*</b> (Laden Sie im Besten Fall ein Bild hoch, worauf Ihre Einrichtung abgebildet ist. Falls Sie kein passendes Bild zur Verfügung haben, wird an dieser Stelle ein passendes Standardbild hinterlegt)
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
              <b>Beschreibung*</b> (Beschreiben Sie Ihre Einrichtung ausführlich. Sie können auch Bilder und Videos einbinden)
            </div>
            <div class="mt-15 mb-5" v-if="slotProps.item.kind === 'news'">
              <b>Beschreibung*</b> (Bearbeiten Sie den Inhalt Ihres Beitrages. Sie können auch Bilder und Videos einbinden)
            </div>
            <div class="mt-15 mb-5" v-if="slotProps.item.kind === 'event'">
              <b>Beschreibung*</b> (Beschreiben Sie den Kurs oder die Veranstaltung ausführlich. Sie können auch Bilder und Videos einbinden)
            </div>
            <ClientOnly>
              <QuillEditor
                class="ql-blank"
                :options="textOptions"
                v-model:content="slotProps.item.description"
                contentType="html"
                toolbar="full"
              />
            </ClientOnly>
          </div>
          <div class="field">
            <div class="mt-15 mb-5" v-if="slotProps.item.kind === 'facility'">
              <b>Tags zuordnen*</b> (Ordnen Sie Ihrer Einrichtung zielgruppengerechte Tags zu)
            </div>
            <div class="mt-15 mb-5" v-if="slotProps.item.kind === 'news'">
              <b>Tags zuordnen*</b> (Ordnen Sie dem Beitrag zielgruppengerechte Filter zu)
            </div>
            <div class="mt-15 mb-5" v-if="slotProps.item.kind === 'event'">
              <b>Tags zuordnen*</b> (Ordnen Sie dem Kurs oder der Veranstaltung zielgruppengerechte Filter zu)
            </div>
            <AdminCareFacilitiesChooseTags
              :pre-set-tag-ids="slotProps.item.tag_ids"
              @setCareFacilityTags="setCareFacilityTags"
            />
          </div>
          <div class="field" v-if="slotProps.item.kind === 'facility'">
            <div class="mt-15 mb-5">
              <b>Filter zuordnen*</b> (Ordnen Sie Ihrer Einrichtung zielgruppengerechte Filter zu)
            </div>
            <AdminCareFacilitiesChooseCategories
              :pre-set-category-ids="slotProps.item.category_ids"
              :pre-set-sub-category-ids="slotProps.item.sub_category_ids"
              :pre-set-sub-sub-category-ids="slotProps.item.sub_sub_category_ids"
              :pre-set-tags="slotProps.item.tags"
              @setCategoryIds="setCategoryIds"
              @setSubCategoryIds="setSubCategoryIds"
              @setSubSubCategoryIds="setSubSubCategoryIds"
              @setTags="setTags"
            />
          </div>
          <div class="field" v-if="slotProps.item.kind !== 'facility'">
            <div class="mt-15 mb-5">
              <b>Veröffentlichkeitsdatum</b> (Hinterlegen Sie ein Veröffentlichkeitsdatum)
              </div>
              <div class="mb-15 justify-center">
                <v-row>
                  <v-col cols="12" md="6">
                    <Datepicker
                      inline
                      autoApply
                      :enableTimePicker="false"
                      locale="de"
                      v-model="slotProps.item.start_time"
                      label="Start"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <Datepicker
                      inline
                      autoApply
                      :enableTimePicker="false"
                      locale="de"
                      v-model="slotProps.item.end_time"
                      label="End"
                    />
                  </v-col>
                </v-row>
              </div>
            </div>
            <div v-if="slotProps.item.kind === 'news'" class="mb-15">
              <b>Autor*</b> (Geben Sie Details als Verfasser an)
              <div class="field">
                <v-text-field
                 
                  hide-details="auto"
                  label="Name*"
                  :error-messages="useErrors().checkAndMapErrors('street', slotProps.errors)"
                />
              </div>
              <div class="field split">
                <v-text-field
                 
                  hide-details="auto"
                  label="Telefonnummer"
                  :error-messages="useErrors().checkAndMapErrors('zip', slotProps.errors)"
                />
                <v-text-field
                 
                  hide-details="auto"
                  label="E-Mail"
                  :error-messages="useErrors().checkAndMapErrors('town', slotProps.errors)"
                />
              </div>
            </div>
          <div class="mb-15" v-if="slotProps.item.kind !== 'news'">
            <div class="mt-15 mb-5">
              <div v-if="slotProps.item.kind === 'facility'">
                <b>Kontakt & Infos* </b>(Geben Sie weitere Details zu Ihrer Einrichtung an. Geben Sie bei der Adresse bitte den Hauptsitz Ihrer Einrichtung an)
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
                :error-messages="useErrors().checkAndMapErrors('phone', slotProps.errors)"
              />
            </div>
            <div class="field">
              <v-text-field
                v-model="slotProps.item.email"
                hide-details="auto"
                label="E-Mail"
                :error-messages="useErrors().checkAndMapErrors('email', slotProps.errors)"
              />
            </div>
            <div class="field">
              <v-text-field
                v-model="slotProps.item.street"
                hide-details="auto"
                label="Straße & Nummer"
                :error-messages="useErrors().checkAndMapErrors('street', slotProps.errors)"
              />
            </div>
            <div class="field split">
              <v-text-field
                v-model="slotProps.item.zip"
                hide-details="auto"
                label="PLZ"
                :error-messages="useErrors().checkAndMapErrors('zip', slotProps.errors)"
              />
              <v-text-field
                v-model="slotProps.item.town"
                hide-details="auto"
                label="Stadt"
                :error-messages="useErrors().checkAndMapErrors('town', slotProps.errors)"
              />
            </div>
            <div class="field">
              <v-select
                hide-details="auto"
                v-model="slotProps.item.community"
                :items="communities"
                item-title="name"
                item-value="name"
                label="Gemeinde"
              />
              </div>
          </div>
          <div class="field" v-if="slotProps.item.kind === 'facility'">
            <div class="mt-15 mb-5">
              <b>Standorte </b> (Falls Ihre Einrichtung mehr als einen Standort besitzt, tragen Sie hier alle weiteren Standorte ein)
            </div>
            <AdminCareFacilitiesAddLocations
              v-if="slotProps.item.id"
              :item-id="slotProps.item.id"
              />
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
              <b>Infobutton </b> (Tragen Sie den Link zu Ihrer eigenen Webseite ein. Falls Sie keine Webseite besitzen, lassen Sie dieses Feld einfach frei)
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
<script lang="ts">
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
export default defineComponent({
  components: { Datepicker },
  setup() {
    const textOptions = ref({
      debug: false,
      placeholder: 'Einrichtung Beschreibung',
      theme: 'snow',
      contentType: "html",
      toolbar: "essential"
    })

    const setCategoryIds = (categoryIds:any) => {
      useNuxtApp().$bus.$emit('setPayloadFromSlotChild', { name: 'category_ids', value: categoryIds })
    }

    const setSubCategoryIds = (subCategoryIds:any) => {
      useNuxtApp().$bus.$emit('setPayloadFromSlotChild', { name: 'sub_category_ids', value: subCategoryIds })
    }

    const setSubSubCategoryIds = (subSubCategoryIds:any) => {
      useNuxtApp().$bus.$emit('setPayloadFromSlotChild', { name: 'sub_sub_category_ids', value: subSubCategoryIds })
    }

    const setTags = (tags:any) => {
      useNuxtApp().$bus.$emit('setPayloadFromSlotChild', { name: 'tags', value: tags })
    }

    const setCareFacilityTags = (tagIds:any) => {
      useNuxtApp().$bus.$emit('setPayloadFromSlotChild', { name: 'tag_ids', value: tagIds })
    }

    const setLogo = (image:any) => {
      useNuxtApp().$bus.$emit('setPayloadFromSlotChild', { name: 'logo', value: image })
    }

    const setCoverBild = (image:any) => {
      useNuxtApp().$bus.$emit('setPayloadFromSlotChild', { name: 'file', value: image })
    }

    const status = ref([
      { name: 'In Prüfung', id: 'is_checked'},
      { name: 'Freigegeben', id: 'confirmed'},
      { name: 'Abgelehnt', id: 'rejected'}
    ])

    const eventTyp = ref([
      { name: 'Kurs', id: ''},
      { name: 'Veranstaltung', id: ''}
    ])

    const communitiesApi = useCollectionApi()
    communitiesApi.setBaseApi(usePrivateApi())
    communitiesApi.setEndpoint(`communities`)
    const communities = communitiesApi.items

    const getCommunities = async () => {
      await communitiesApi.retrieveCollection()
    }

    onMounted(() => {
      getCommunities()
    })

    return {
      textOptions,
      setCategoryIds,
      setSubCategoryIds,
      setSubSubCategoryIds,
      setTags,
      setLogo,
      setCoverBild,
      setCareFacilityTags,
      communities,
      status,
      eventTyp
    }
  }
})
</script>
<style lang="sass" scoped>
.cropper-wrap
  max-width: 450px

.fields
  max-width: 70vw

</style>