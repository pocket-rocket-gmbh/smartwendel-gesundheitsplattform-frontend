<template>
  <v-container class="my-5">
    <v-row>
      <v-col class="d-flex justify-start align-center is-uppercase">
        <h2 class="is-primary">Aktuelle Informationen zu Gesundheitsthemen</h2>
      </v-col>
      <v-col md="3" class="d-flex justify-end align-center">
        <v-btn
          class="rounded-xl text-white"
          rounded
          color="#3CB5E7"
          >
          Alle Informationen ansehen
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
      <v-row>
        <v-col md="4" class="flex-column justify-center align-center ">
          <v-card class="rounded-xl">
            <div class="flex-column notes-card">
              <img src="@/assets/images/ernaehrung.jpg" height="300"/>
              <div>
                <v-card-title class="note-title">
                  Was ist eine gesunde Ernährung?
                </v-card-title>
                <div class="px-5 pb-5">
                  <p>Was für die einen ungesund ist, bekommt anderen recht gut. Heißt auch: Jeder bekommt einen Klinik und Praxis und natürlich die interdisziplinäre ...</p>
                </div>
                <v-card-actions>
                  <v-btn
                    class="note-text-link"
                    size="small"
                  >
                  Mehr erfahren >
                  </v-btn>
                </v-card-actions>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col md="4" class="d-flex justify-center align-center">
          <v-card class="rounded-xl">
            <div class="flex-column notes-card">
              <img src="@/assets/images/diabetes.jpg" height="300"/>
              <div>
                <v-card-title class="note-title">
                  Diabätisforum 2023
                </v-card-title>
                <div class="px-5 pb-5">
                  <p>Das Forum für professionelle Diabetiker-Versorgung: Themen wie Qualitätsmanagement in Klinik und Praxis und natürlich die interdisziplinäre ...</p>
                </div>
                <v-card-actions>
                  <v-btn
                    class="note-text-link"
                    size="small"
                  >
                  Mehr erfahren >
                  </v-btn>
                </v-card-actions>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col md="4" class="d-flex justify-center align-center">
          <v-card class="rounded-xl">
            <div class="flex-column notes-card">
              <img src="@/assets/images/grippeimpfung.png" height="300"/>
              <div>
                <v-card-title class="note-title">
                  Tai Chi für mehr innere Balance
                </v-card-title>
                <div class="px-5 pb-5">
                  <p>Ruhe Harmonie und Ausgelassenheit verspricht Tai Chi. Die fernöstlichen Heilmethoden verhelfen dem Körper zu neuer Energie und sind dabei ...</p>
                </div>
                <v-card-actions>
                  <v-btn
                    class="note-text-link"
                    size="small"
                  >
                  Mehr erfahren >
                  </v-btn>
                </v-card-actions>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
  </v-container>
  
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
    
  },
})
</script>

<style lang="sass" scoped>

.note-title
  color: #3CB5E7
  font-weight: 600
  font-size: 22px

.note-text-link
  color: #017DC2
  font-size: 18px


</style>