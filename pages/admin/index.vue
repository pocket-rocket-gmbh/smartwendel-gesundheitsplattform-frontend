<template>
  <div>
    <h2>Dashboard</h2>
  </div>
  <div>
    <v-list>
      <v-list-item title="Änderungen am: 05.07 17:30Uhr - Alex L.">
        <v-container>
          - "Erstellt von" hinzugefügt - Einrichtungen<br>
        
        </v-container>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list>
      <v-list-item title="Änderungen am: 105.07 17:00Uhr - Alex L.">
        <v-container>
          - Bestätigung vor dem Ändern der Daten der Einrichtung<br>
          - Fehler behoben, dass "Bild löschen" Text angezeigt wird, wenn keine Bild in der Galerie vorhanden sind<br>
          - Korrekter Text im Beschreibungsfeld hinzugefügt<br>
          - "Meine" zu Dashboard-Elementen hinzugefügt<br>
          - neue Umleitungsregel beim Login: facility_owner wird zu "meine Einrichtung" und admin zu "dashboard" umgeleitet<br>
        </v-container>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'AdminIndex',
  setup() {

    definePageMeta({
      layout: "admin",
    })
  }
})
</script>