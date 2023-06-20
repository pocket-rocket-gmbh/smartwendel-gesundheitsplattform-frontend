<template>
  <v-row>
    <v-col>
      <h2 class="is-uppercase">Wählen Sie hier Ihre Suchkriterien aus</h2>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <div class="field">
        <label class="font-weight-bold">Ich suche...</label>
        <input type="text" placeholder="Suchbegriff eingeben" class="input mt-1" />
      </div>
    </v-col>
    <v-col>
      <PublicFilterSelect
        color="dark-grey"
        filter-name="category"
        label="Schwerpunkt"
        endpoint="categories"
      />
    </v-col>
    <v-col>
      <PublicFilterSelect
        color="dark-grey"
        filter-name="category"
        label="Weitere Auswahlmöglichkeiten"
        endpoint=""
      />
    </v-col>
  </v-row>
  <v-row class="mt-3">
    <v-col class="d-flex justify-end">
      <v-btn
        class="mx-3"
        variant="outlined"
        size="large"
        rounded="pill"
      >
        Auswahl zurücksetzen
      </v-btn>
      <v-btn variant="flat" 
        color="primary" 
        rounded="pill" 
        size="large" >
        <span> Suche starten </span>
      </v-btn>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
</script>
<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

</style>