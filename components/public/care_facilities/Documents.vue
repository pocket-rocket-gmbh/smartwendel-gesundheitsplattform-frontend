<template>
  <div class="box flex-column text-dark-grey font-weight-bold pa-5">
    <h2 class="is-primary is-uppercase mb-6">Dokumente</h2>
    <div class="flex-column">
      <v-icon size="large" color="warning">mdi-file-pdf-box</v-icon>
      <span>test</span>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    careFacility: {
      type: Object,
      required: true
    }
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