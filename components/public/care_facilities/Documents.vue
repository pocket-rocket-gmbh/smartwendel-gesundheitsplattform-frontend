<template>
  <div class="box flex-column text-dark-grey font-weight-bold pa-5" v-if="careFacility.sanitized_documents?.filter((doc:any) => doc.tag === 'documents')?.length > 0">
    <h2 class="is-primary is-uppercase mb-6">Dokumente</h2>
    <div class="flex-column">
      <div v-for="document in careFacility.sanitized_documents.filter((doc:any) => doc.tag === 'documents')" class="my-3">
        <v-btn
            class="mx-3"
            size="large"
            color="red"
            :href="document.url"
            target="_blank"
            density="compact" icon="mdi-file-pdf-box"
            >
        </v-btn>
        {{ document.name.replace('-documents', '') }}
        <v-divider class="my-5"></v-divider>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    careFacility: {
      type: Object,
      required: true
    }
  })
</script>

<style lang="sass" scoped>
.box
  background: white
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
  border-radius: 20px
  padding: 20px

</style>