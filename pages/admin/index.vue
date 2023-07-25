<template>
  <div>
    <h2>Dashboard</h2>
  </div>
  <div>
    <v-list>
      <v-list-item title="Änderungen am: 25.07 11:00Uhr - Alex L.">
        <v-container>
          <b>Startseite</b><br>
          - Neue startbild (fix)<br>
          - Startseite optimierungen (fix)<br>
          <b>Backend</b><br>
          - Einrichtung name für News/Events<br>
        </v-container>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list>
      <v-list-item title="Änderungen am: 24.07 12:40Uhr - Alex L.">
        <v-container>
          <b>Startseite</b><br>
          - Neue startbild<br>        
        </v-container>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list>
      <v-list-item title="Änderungen am: 24.07 12:07Uhr - Alex L.">
        <v-container>
          <b>Bereiche</b><br>
          - Neue Beschreibung Zeichen lange - 600 Zeichen<br>        
        </v-container>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
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
    <v-list>
      <v-list-item title="Änderungen am: 06.07 13:45Uhr - Norman">
        <v-container>
          - Es können jetzt bei der Einrichtungserstellung andere Standorte angegeben werden<br>
        
        </v-container>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list>
      <v-list-item title="Änderungen am: 06.07 13:45Uhr - Norman">
        <v-container>
          - Es können jetzt bei der Einrichtungserstellung Dokumente hochgeladen werden<br>
        
        </v-container>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list>
      <v-list-item title="Änderungen am: 25.07 11:00Uhr - Norman">
        <v-container>
          - Tabellen sind durchsuchbar<br>
        
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