<template>
  <div class="wrapper">
    <v-row>
      <v-col class="d-flex justify-center my-15">
        <h2 class="is-uppercase">Du benötigst dringend Hilfe?</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(item, index) in items" :key="index">
        <div class="justify-center text-center align-center">
          <div class="icons d-flex justify-center align-center">
            <img :src="item.content.image" min-width="50" max-width="50" />
          </div>
          <h3 class="is-dark-grey my-5 font-weight-bold">
            {{ item.content.heading }}
          </h3>
          <div class="my-5 is-dark-grey">
            {{ item.content.description }}
          </div>
          <div>
            <a :href="item.content.linkText" target="_blank" class="is-red is-clickable">
              {{ item.content.linkText }}
            </a>
          </div>
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
          heading: "Erste Hilfe",
          image: image1,
          description:
            "Du warst sicherlich schon mal in einer Situation, in der Du die Hilfe eines Mitmenschen benötigt hast. Hilf auch Du in Notfallsituationen. Weitere Informationen:",
          linkText: "Anleitung",
          link: "https://www.drk.de/hilfe-in-deutschland/erste-hilfe/",
        },
      },
      {
        content: {
          heading: "Rettungsdienste",
          image: image3,
          description:
            "Rufe den Rettungsdienst, wenn Du akut medizinische Hilfe benötigst. Egal ob es sich um die Folgen eines Unfalls handelt oder plötzliche starke gesundheitliche Beschwerden auftreten.",
          linkText: "Notruf 112",
          link: "https://www.drk.de/hilfe-in-deutschland/erste-hilfe/notruf-112/",
        },
      },
      {
        content: {
          heading: "Apothekennotdienst",
          image: image2,
          description:
            "Es ist Wochenende und Du benötigst dringend Medikamente? Rufe sofort den Apothekennotdienst an und erfahre, welche Apotheke im Landkreis Sankt Wendel für Dich da ist.",
          linkText: "Notruf 22833",
          link: "https://www.google.com/search?q=Apothekennotdienst+LK+WND&oq=Apothekennotdienst+LK+WND&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIJCAEQIRgKGKAB0gEHNjA1ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8",
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
</style>
