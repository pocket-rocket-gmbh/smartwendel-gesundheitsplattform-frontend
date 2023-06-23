<template>
  <div>
    <h1 class="is-dark-grey">{{ careFacility.name }}</h1>
    <ClientOnly>
      <PublicTextTooltipWrap
        :text="careFacility.description"
      />
    </ClientOnly>
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
  @import "@/assets/sass/main.sass"

</style>