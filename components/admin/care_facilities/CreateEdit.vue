<template>
  <CreateEdit v-slot="slotProps" size="100wh">
    <v-card-text>
      <v-row>
        <v-col cols="12" md="8" offset="2">
          <div class="pa-10">
            Hier können Sie eine eigene Detailseite für Ihre Einrichtung anlegen. Bitte füllen Sie alle Felder sorgfältig aus. Pflichtfelder sind mit einem Sternchen versehen. Klicken Sie hier, für eine beispielhafte Vorschau einer ausgebauten Einrichtungsseite.
          </div>
          <div class="field">
            <div>
              <b>Name der Einrichting*</b> (Hinterlegen Sie den Namen Ihrer Einrichtung)
            </div>
              <v-text-field
                v-model="slotProps.item.name"
                hide-details="auto"
                label="Name"
                :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
              />
          </div>
          <div class="field">
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
              <b>Coverbild*</b> (Laden Sie im Besten Fall ein Bild hoch, worauf Ihre Einrichtung abgebildet ist. Falls Sie kein passendes Bild zur Verfügung haben, wird an dieser Stelle ein passendes Standardbild hinterlegt)
            </div>
            <ChooseAndCropSingleImage
              :pre-set-image-url="slotProps.item.image_url"
              label="Cover Bild wählen"
              @setImage="setCoverBild"
            />
          </div>
          <div class="field">
            <div class="mt-15 mb-5">
              <b> Weitere Einrichtungsbilder</b> (Laden Sie weitere Bilder Ihrer Einrichtung hoch)
            </div>
            <ChooseAndCropSingleImage
              :pre-set-image-url="slotProps.item.sanitized_images"
              label="Bilder hinzufügen"
              @setImage="setLogo"
            />
            <div>
              <v-icon>mdi-plus</v-icon>
              <span class="is-clickable">Weitere Bilder</span>
            </div>
          </div>
          <div class="field">
            <div class="mt-15 mb-5">
              <b>Beschreibung*</b> (Beschreiben Sie Ihre Einrichtung ausführlich. Sie können auch Bilder und Videos einbinden)
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
            <div class="mt-15 mb-5">
              <b>Bereich*</b> (Wählen Sie den Bereich, der zu Ihrer Einrichtung passt. Es ist eine Mehrfachauswahl möglich)
            </div>
            <v-select
              hide-details="auto"
              v-model="slotProps.item.kind"
              :items="kindsCareFacilities"
              item-title="name"
              item-value="id"
              label="Art der Einrichtung"
            />
          </div>
          <div class="field">
            <div class="mt-15 mb-5">
              <b>Tags zuordnen*</b> (Ordnen Sie Ihrer Einrichtung zielgruppengerechte Tags zu)
            </div>
            <AdminCareFacilitiesChooseTags
              :pre-set-tag-ids="slotProps.item.tag_ids"
              @setCareFacilityTags="setCareFacilityTags"
            />
          </div>
          <div class="field">
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
          <div>
            <div class="mt-15 mb-5">
              <b>Kontakt & Infos* </b>(Geben Sie weitere Details zu Ihrer Einrichtung an. Geben Sie bei der Adresse bitte den Hauptsitz Ihrer Einrichtung an)
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
          <div class="field">
            <div class="mt-15 mb-5">
              <b>Standorte </b> (Falls Ihre Einrichtung mehr als einen Standort besitzt, tragen Sie hier alle weiteren Standorte ein)
            </div>
            <AdminCareFacilitiesAddLocations
              v-if="slotProps.item.id"
              :item-id="slotProps.item.id"
              />
      
          </div>
          <div class="field">
            <div class="mt-15 mb-5">
              <b>Öffnungszeiten </b> (Geben Sie Ihre Öffnungszeiten an. Tragen Sie hierzu den oder die Wochentag/e in das vordere Feld ein und die genauen Zeiten in das hintere Feld)
              <div class="field">
                <v-text-field
                  v-model="slotProps.item.opening_hours"
                  hide-details="auto"
                  label="Wochentag/en - Uhrzeiten"
                  :error-messages="useErrors().checkAndMapErrors('opening_hours', slotProps.errors)"
                />
                <div>
                  <v-icon>mdi-plus</v-icon>
                  <span class="is-clickable">Weitere Öffnungszeiten</span>
                </div>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="mt-15 mb-5">
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
          <div class="field mt-15 mb-15">
            <div class="mt-15 mb-15">
              <b>Downloads</b> (Laden Sie Dokumente wie bspw. Transparenzberichte, Jobangebote oder Formulare hoch. Bitte hinterlegen Sie zu jedem Dokument einen Titel und eine kurze Beschreibung)
                <div class="field split">
                <v-text-field
                
                  hide-details="auto"
                  label="Titel*"
                  :error-messages="useErrors().checkAndMapErrors('zip', slotProps.errors)"
                />
                <v-text-field
                
                  hide-details="auto"
                  label="Beschreibung (max. 120 Zeichen)"
                  :error-messages="useErrors().checkAndMapErrors('town', slotProps.errors)"
                />
              </div>
              <div class="field">
                <v-file-input clearable label="Datei Hochladen"></v-file-input>
              </div>
              <div>
                <v-icon>mdi-plus</v-icon>
                <span class="is-clickable">Weitere Downloads</span>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </CreateEdit>
</template>
<script lang="ts">
import kindsCareFacilities from '@/data/kindsCareFacilities'
export default defineComponent({
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
      kindsCareFacilities,
      setCareFacilityTags,
      communities
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