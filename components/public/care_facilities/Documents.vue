<template>
  <div
    class="box flex-column text-dark-grey font-weight-bold pa-5"
    v-if="careFacility?.sanitized_documents?.filter((doc:any) => doc.tag === 'documents')?.length > 0"
  >
    <h2 class="is-primary is-uppercase mb-6">Dokumente</h2>
    <div class="flex-column">
      <div
        v-for="document in careFacility.sanitized_documents.filter((doc:any) => doc.tag === 'documents')"
        class="my-3"
      >
        <span class="d-flex align-center">
          <a :href="document.url" target="_blank"
            ><img class="mr-2 icon" :src="iconDownload" />{{
              document.name.replace("-documents", ".pdf")
            }}</a
          >
        </span>
        <v-divider class="my-10"></v-divider>
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
