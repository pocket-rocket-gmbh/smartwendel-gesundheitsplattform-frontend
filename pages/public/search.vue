<template>
  <v-container class="limited">
    <PublicSearchTheBasicSearchBox />

    <v-row class="mt-8">
      <v-col md="2">
        <PublicSearchTheFilter />
      </v-col>
      <v-col md="10">
        <PublicSearchTheFilteredCareFacilities />
      </v-col>
    </v-row>
  </v-container>
</template>