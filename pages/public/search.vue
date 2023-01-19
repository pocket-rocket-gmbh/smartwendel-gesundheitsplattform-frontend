<template>
  <v-container class="limited offset">
    <PublicSearchTheBasicSearchBox />

    <v-row class="mt-8">
      <v-col md="3" lg="2">
        <PublicSearchTheFilter />
      </v-col>
      <v-col md="9" lg="10">
        <PublicSearchTheFilteredCareFacilities />
      </v-col>
    </v-row>
  </v-container>
</template>