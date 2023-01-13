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
              Name, Logo
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

              <v-select
                hide-details="auto"
                v-model="slotProps.item.category_ids"
                :items="categories"
                item-title="name"
                item-value="id"
                label="Leistungsbereiche wählen"
                single-line
                :multiple="true"
              />

            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
    </v-card-text>
  </CreateEdit>
</template>
<script lang="ts">
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

    const categoriesApi = useCollectionApi()
    categoriesApi.setBaseApi(usePrivateApi())
    categoriesApi.setEndpoint(`categories`)
    const categories = categoriesApi.items

    const getCategories = async () => {
      await categoriesApi.retrieveCollection()
    }

    onMounted(() => {
      getCategories()
    })

    return {
      tab,
      textOptions,
      categories
    }
  }
})
</script>