<template>
  <div class="accessibility-panel">
    <div class="increase-size is-clickable" @click="createEditDialogOpen = true">
      <v-icon color="red">mdi-emoticon-angry-outline</v-icon>
    </div>
    <PublicComplaintModal
      v-if="createEditDialogOpen"
      @close="createEditDialogOpen = false"
      @click:outside="createEditDialogOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
const createEditDialogOpen = ref(false);
</script>

<style style lang="sass" scoped>

.accessibility-panel
  background: linear-gradient(89.48deg, #91A80D 19.14%, #BAC323 42.28%, #9EA100 83.7%)
  box-shadow: -4px 0px 15px rgba(0, 0, 0, 0.25)
  border-radius: 5px 0px 0px 5px
  color: #ffffff
  width: 50px
  height: 50px
  position: fixed
  top: 30%
  right: 0
  text-align: center
  display: grid
  place-items: center
  z-index: 10000
  font-weight: 700

.divider
  border: 2px white solid
  width: 80%
  opacity: .7

.increase-size
  font-size: 1.5em

.decrease-size
  font-size: 1.5em

</style>