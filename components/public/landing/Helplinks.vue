<template>
  <div class="wrapper">
    <v-row>
      <v-col class="d-flex justify-center my-3">
        <h2 class="is-uppercase">Du benötigst dringend Hilfe?</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(item, index) in items" :key="index">
        <div class="justify-center text-center align-center">
          <div class="icons d-flex justify-center align-center">
            <img :src="item.content.image" min-width="50" max-width="50" />
          </div>
          <div class="items-column">
            <div class="is-dark-grey my-5 font-weight-bold text-h5">
              {{ item.content.heading }}
            </div>

            <div class="my-5 is-dark-grey general-font-size">
              {{ item.content.description }}
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(item, index) in items"
        :key="index"
        class="justify-center text-center align-center"
      >
        <div class="general-font-size">
          <a
            :href="item.content.linkText"
            target="_blank"
            class="is-red is-clickable"
          >
            {{ item.content.linkText }}
          </a>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import image1 from "@/assets/images/help-links/icon_firstaid.svg";
import image2 from "@/assets/images/help-links/icon_pharmacy.svg";
import image3 from "@/assets/images/help-links/icon_rescue.svg";
export default defineComponent({
  setup() {
    const items = [
      {
        content: {
          heading: "Rettungsdienste",
          image: image3,
          description:
            "Wenn es eine akute Gefahr für das Leben gibt und es nicht ausgeschlossen werden kann, dass bleibende Schäden auftreten, sollte unverzüglich der Notruf gewählt werden.",
          linkText: "Notruf 112",
          link: "https://www.drk.de/hilfe-in-deutschland/erste-hilfe/notruf-112/",
        },
      },
      {
        content: {
          heading: "Ärztlicher Bereitschaftsdienst",
          image: image2,
          description:
            "Es ist Wochenende und Du benötigst dringend Medikamente? Rufe sofort den Apothekennotdienst an und erfahre, welche Apotheke im Landkreis Sankt Wendel für Dich da ist.",
          linkText: "Notruf 116 117",
          link: "https://www.google.com/search?q=Apothekennotdienst+LK+WND&oq=Apothekennotdienst+LK+WND&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIJCAEQIRgKGKAB0gEHNjA1ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8",
        },
      },
      {
        content: {
          heading: "Nummer gegen Kummer",
          image: image1,
          description:
            'Die "Nummer gegen Kummer" ist eine Anlaufstelle für Kinder und Jugendliche, die mit Sorgen und Problemen zu kämpfen haben. Hier finden sie Unterstützung durch psychologisch geschulte Fachkräfte, die ihre Dienste anonym und kostenlos anbieten.',
          linkText: "Notruf 116 123",
          link: "https://www.drk.de/hilfe-in-deutschland/erste-hilfe/",
        },
      },
      
      
    ];

    return {
      items,
    };
  },
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.wrapper
  margin: 0 5rem
  @include md
    margin: 0 1rem

.items-column
  margin: 0 2.5rem
</style>
