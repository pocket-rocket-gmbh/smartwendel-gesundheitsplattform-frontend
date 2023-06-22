<template>
  <v-col md="6" class="d-flex flex-column">
    <v-card class="rounded-xl mx-auto has-bg-light-grey content elevation-1 fill-height d-flex flex-column" width="100%">
      <v-row>
        <v-col md="5" class="d-flex">
          <v-img
          class="align-center"
          cover
          max-height="300px"
          :src="item.image_url"
        />
        </v-col>
        <v-col class="d-flex mt-1">
          <div class="notes-card">
            <div class="flex-grow-1">
              <v-card-title class="note-title is-primary">
                {{ item.name }}
              </v-card-title>
              <div class="px-5 pb-5">
                <p class="" v-html="item.description"></p>
              </div>
              <v-spacer></v-spacer>
              <v-card-actions>
                <div class="content-footer">
                  <v-btn
                    v-if="itemType === 'events'"
                    color="secondary"
                    class="note-text-link"
                    size="small"
                    :href="`/public/care_facilities/${item?.id}`"
                    >
                    Mehr erfahren >
                  </v-btn>
                  <v-btn
                    v-if="itemType === 'news'"
                    color="secondary"
                    class="note-text-link"
                    size="small"
                    :href="`/public/news/${item?.id}`"
                    >
                    Mehr erfahren >
                  </v-btn>
                  <v-btn
                    v-if="item.url"
                    color="secondary"
                    class="note-text-link"
                    size="small"
                    :href="'https://' + item.url"
                    target="_blank"
                    >
                    Mehr erfahren >
                  </v-btn>
                </div>
              </v-card-actions>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>
<script lang="ts" setup>
defineProps({
  item: {
    type: Object,
    required: true
  },
  itemType: {
    type: String,
  }
})

</script>
<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
.note-title
  font-weight: 600
  font-size: 22px

.note-text-link
  font-size: 18px

.content
  min-height: 250px
  z-index: 0

.content-footer
  position: absolute
  bottom: 30px



</style>