<template>
  <div class="wrapper">
    <v-row>
      <v-col class="d-flex justify-center my-3">
        <h2 class="is-uppercase">Du benötigst dringend Hilfe?</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(item, index) in items" :key="index">
        <div class="d-flex flex-column justify-space-between text-center align-center items">
          <div>
            <div class="icons d-flex flex-column justify-center align-center">
              <img :src="item.content.image" min-width="50" max-width="50" />
              <span class="d-flex align-center is-dark-grey font-weight-medium general-font-size title">
                {{ item.content.heading }}
              </span>
            </div>
            <div class="my-5 is-dark-grey general-font-size description">
              {{ item.content.description }}
            </div>
          </div>
          <div class="items-column">
            <div class="general-font-size d-flex flex-column flex-1 buttons-wrapper">
              <a :href="item.content.link" target="_blank" class="is-red is-clickable">
                <v-btn variant="flat" color="primary" rounded="pill" size="large">
                  <span>{{ item.content.linkText }}</span>
                </v-btn>
              </a>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import image1 from "@/assets/images/help-links/icon_rescue.svg";
import image2 from "@/assets/images/help-links/icon_emergency.svg";
import image3 from "@/assets/images/help-links/icon_grief.svg";
export default defineComponent({
  setup() {
    const items = [
      {
        content: {
          heading: "Rettungsdienste",
          image: image1,
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
            "Der Bereitschaftsdienst leistet dir auch an Wochenenden, Feiertagen und in der Nacht medizinische Hilfe.",
          linkText: "Notruf 116 117",
          link: "https://www.116117.de/de/index.php",
        },
      },
      {
        content: {
          heading: "Nummer gegen Kummer",
          image: image3,
          description:
            'Die "Nummer gegen Kummer" ist eine Anlaufstelle für Kinder und Jugendliche, die mit Sorgen und Problemen zu kämpfen haben. Hier findest du Unterstützung durch psychologisch geschulte Fachkräfte, die ihre Dienste anonym und kostenlos anbieten.',
          linkText: "Notruf 116 123",
          link: "https://www.telefonseelsorge.de/",
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

.title
  min-height: 70px

.items
  height: 100%
.wrapper
  margin: 0 5rem
  @include md
    margin: 0 1rem

.items-column
  margin: 0 2.5rem

.description
  min-height: 150px

.buttons-wrapper
  @include md
    height: auto
    margin: 2rem 0
</style>
