<template>
  <div class="box text-dark-grey font-weight-bold">
    <h2 class="is-primary is-uppercase mb-6">Kontakt & Infos</h2>

    <div class="pair-grid" v-if="careFacility.phone">
      <nuxt-icon name="phone" filled class="mr-2" />
      <div>{{ careFacility.phone }}</div>
    </div>
    <div class="pair-grid mt-2" v-if="careFacility.email">
      <nuxt-icon name="email" filled class="mr-2" />
      <div>{{ careFacility.email }}</div>
    </div>
    <div v-if="careFacility.street || careFacility.zip || careFacility.town">
      <div class="pair-grid mt-2">
        <nuxt-icon name="map" filled class="mr-2" />
        <div>
          <div>{{ careFacility.street }}</div>
          <div>{{ careFacility.zip }} {{ careFacility.town }}</div>
        </div>
      </div>
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
  .pair-grid
    display: grid
    grid-template-columns: 25px auto
</style>