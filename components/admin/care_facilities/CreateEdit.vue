<template>
  <CreateEdit v-slot="slotProps" :size="700">
    <v-card-text>
      <v-row>
        <v-col md="4">
          <v-tabs
            v-model="tab"
            direction="vertical"
            color="primary"
          >
            <v-tab value="option-1">
              <v-icon start>
                mdi-account
              </v-icon>
              Name, Art, Logo
            </v-tab>
            <v-tab value="option-2">
              <v-icon start>
                mdi-pencil
              </v-icon>
              Beschreibung
            </v-tab>
            <v-tab value="option-3">
              <v-icon start>
                mdi-shape
              </v-icon>
              Leistungen
            </v-tab>
            <v-tab value="option-4">
              <v-icon start>
                mdi-application-edit-outline
              </v-icon>
              Weitere Details
            </v-tab>
          </v-tabs>
        </v-col>
        <v-col>
          <v-window v-model="tab">
            <v-window-item value="option-1">
              <div class="field">
                <v-text-field
                  v-model="slotProps.item.name"
                  hide-details="auto"
                  label="Name"
                  :error-messages="useErrors().checkAndMapErrors('name', slotProps.errors)"
                />
              </div>
              <div class="field">
                <v-select
                  hide-details="auto"
                  v-model="slotProps.item.kind"
                  :items="kindsCareFacilities"
                  item-title="name"
                  item-value="id"
                  label="Art der Einrichtung"
                />
              </div>
              <div class="cropper-wrap">
                <ChooseAndCropSingleImage
                  :pre-set-image-url="slotProps.item.logo_url"
                  @setImage="setLogo"
                />
              </div>
            </v-window-item>
            <v-window-item value="option-2">
              <ClientOnly>
                <QuillEditor
                  class="ql-blank"
                  :options="textOptions"
                  v-model:content="slotProps.item.description"
                  contentType="html"
                  toolbar="full"
                />
              </ClientOnly>
            </v-window-item>
            <v-window-item value="option-3">
              <AdminCareFacilitiesChooseCategories
                :pre-set-category-ids="slotProps.item.category_ids"
                :pre-set-sub-category-ids="slotProps.item.sub_category_ids"
                :pre-set-tags="slotProps.item.tags"
                @setCategoryIds="setCategoryIds"
                @setSubCategoryIds="setSubCategoryIds"
                @setTags="setTags"
              />
            </v-window-item>
            <v-window-item value="option-4">
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
                  v-model="slotProps.item.website"
                  hide-details="auto"
                  label="Webseite"
                  :error-messages="useErrors().checkAndMapErrors('website', slotProps.errors)"
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
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
    </v-card-text>
  </CreateEdit>
</template>
<script lang="ts">
import kindsCareFacilities from '@/data/kindsCareFacilities'
export default defineComponent({
  setup() {
    const tab = ref('option-1')
    
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

    const setTags = (tags:any) => {
      useNuxtApp().$bus.$emit('setPayloadFromSlotChild', { name: 'tags', value: tags })
    }

    const setLogo = (image:any) => {
      useNuxtApp().$bus.$emit('setPayloadFromSlotChild', { name: 'logo', value: image })
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
      tab,
      textOptions,
      setCategoryIds,
      setSubCategoryIds,
      setTags,
      setLogo,
      kindsCareFacilities,
      communities
    }
  }
})
</script>
<style lang="sass" scoped>
.cropper-wrap
  max-width: 450px
</style>