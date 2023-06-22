<template>
 <v-row>
  <v-col class="mt-15">
    <v-container>
      <h2>2. Verantwortlicher</h2>
      <p>Verantwortlicher ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen) entscheidet. Verantwortlicher im Sinne der DSGVO und der geltenden nationalen Datenschutzgesetze (insbesondere BDSG und SDSG) sowie sonstiger datenschutzrechtlicher Bestimmungen ist die:</p>
      <br>
      <p>Landkreis St. Wendel</p>
      <p>Mommstr. 21 - 31</p>
      <p>66606 St. Wendel</p>
      <p>Telefon: (06851) 801 - 0</p>
      <p>E-Mail: info@lkwnd.de</p>
      <br>
      <p>Vertretungsberechtigter:</p>
      <p>Landrat Udo Recktenwald</p>
    </v-container>
  </v-col>
  <v-col class="mt-15">
    <div class="field">
      <v-text-field
        hide-details="auto"
        label="Vorname"
      />
    </div>
    <div class="field">
      <v-text-field
        hide-details="auto"
        label="Nachname"
      />
    </div>
    <div class="field">
      <v-text-field
        hide-details="auto"
        label="E-Mail *"
      />
    </div>
    <div class="field">
      <v-text-field
        hide-details="auto"
        label="Betreff *"
      />
    </div>
    <div class="field">
      <v-textarea
        rows="7"
        hide-details="auto"
        label="Ihre Nachricht *"
      />
    </div>
  </v-col>
 </v-row>
</template>

<script lang="ts" setup>


</script>

<style lang="sass" scoped>

</style>