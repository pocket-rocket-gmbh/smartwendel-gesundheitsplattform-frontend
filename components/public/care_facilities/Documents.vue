<template>
  <div
    class="box flex-column is-dark-grey font-weight-medium pa-5"
    v-if="careFacility?.sanitized_documents?.filter((doc:any) => doc.tag === 'documents')?.length > 0"
  >
    <span class="is-primary is-uppercase general-font-size font-weight-medium mb-6">Dokumente</span>
    <div class="flex-column">
      <div
        v-for="document in careFacility.sanitized_documents.filter((doc:any) => doc.tag === 'documents')"
        class="my-3 d-flex align-center"
      >
      <img class="mr-2 icon" :src="iconDownload" />
        <span class="d-flex align-center">
          <a class="general-font-size is-dark-grey" :href="document.url" target="_blank"
            >{{
              document.name.replace("-documents", ".pdf")
            }}</a
          >
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import iconDownload from "@/assets/icons/facilities/icon_download.svg";
defineProps({
  careFacility: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="sass" scoped>

.box
  background: white
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
  border-radius: 20px
  padding: 20px

.icon
  width: 1.25rem
</style>
