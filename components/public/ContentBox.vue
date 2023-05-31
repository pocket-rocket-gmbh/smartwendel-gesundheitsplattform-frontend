<template>
  <v-col md="6" class="d-flex flex-column mt-10">
    <v-card class="rounded-xl mx-auto has-bg-light-grey content elevation-1 fill-height">
      <div class="d-flex notes-card">
        <v-img
          cover
          width="200" 
          heigth="200"
          aspect-ratio="16/9"
          :src="item.image_url"
        />
        <div>
          <v-card-title class="note-title is-primary">
            {{ item.name }}
          </v-card-title>
          <div class="px-5 pb-5">
            <p class="" v-html="item.description"></p>
          </div>
          <v-card-actions>
            <div class="content-footer">
              <v-btn
                color="secondary"
                class="note-text-link"
                size="small"
              >
              Mehr erfahren >
              </v-btn>
            </div>
          </v-card-actions>
        </div>
      </div>
    </v-card>
  </v-col>
  
</template>
<script lang="ts" setup>
defineProps({
  item: {
    required: true
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
  max-height: auto
  z-index: 0

.content-footer
  bottom: 0

</style>