<template>
  <div class="wrapper">
    <v-row>
      <v-col class="d-flex justify-center align-center text-center">
        <h2
          >Sie haben dringende Fragen <br> und benötigen schnelle Antworten:</h2
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(item, index) in items" :key="index" class="items-nummber">
        <div
          class="d-flex flex-column justify-space-between text-center align-center items"
        >
          <div>
            <div class="icons d-flex flex-column justify-center align-center">
              <img :src="item.content.image" min-width="50" max-width="50" />
              <h4
                class="d-flex align-center title"
              >
                {{ item.content.heading }}
              </h4>
            </div>
            <div
              class="is-paragraph"
              :class="[breakPoints.width.value > 960 ? 'description' : '']"
            >
              {{ item.content.description }}
            </div>
          </div>
          <div class="items-column">
            <div class="d-flex flex-column flex-1 buttons-wrapper">
              <a :href="`tel:${item.content.linkText}`" class="is-clickable is-paragraph is-red">
                  <span>{{ item.content.linkText }}</span>
              </a>
            </div>
          </div>
        </div>
        <v-divider v-if="breakPoints.width.value < 960"></v-divider>
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import image1 from "@/assets/images/help-links/icon_care_telephone.svg";
import image2 from "@/assets/images/help-links/icon_counseling_center.svg";
import image3 from "@/assets/images/help-links/icon_socio_educational_service.svg";
import { useBreakpoints } from "~/composables/ui/breakPoints";
export default defineComponent({
  setup() {
    const items = [
      {
        content: {
          heading: "Pflegetelefon",
          image: image1,
          description:
            'Die meisten älteren Menschen wünschen sich, solange wie möglich zuhause leben zu können. Auch dann, wenn der eigene Unterstützungs-bedarf immer größer wird. Oft übernehmen Angehörige die Pflege - und stehen plötzlich vor neuen Herausforderungen. Das Pflegetelefon des Bundesfamilienministeriums soll pflegenden Angehörigen ganz konkrete Hilfe leisten.',
          linkText: "030 20179131",
          link: "https://www.drk.de/hilfe-in-deutschland/erste-hilfe/notruf-112/",
        },
      },
      {
        content: {
          heading: "Senioren- und Pflegeberatungsstelle",
          image: image2,
          description:
            'Sie selbst, Ihr Partner, ein Elternteil oder ein anderes Familienmitglied benötigt Unterstützung. Sei es altersbedingt, durch Krankheit oder einen Unfall: es tauchen viele Fragen auf, was als nächstes zu tun ist. Unsere Pflegeberater vor Ort unterstützen Sie eine passgenaue Lösung für Ihre Situation zu finden.',
          linkText: "09231 9626-63",
          link: "https://www.116117.de/de/index.php",
        },
      },
      {
        content: {
          heading: "Sozialpädagogischer Dienst",
          image: image3,
          description:
            'Pflegestützpunkte sind umfassende Beratungsstellen für Betroffene und Angehörige rund um das Thema Pflege und die Leistungen der Pflegeversicherung. Nutzen Sie daher unseren Sozialpädagogischen Dienst, welcher Ihnen Ihre Fragen gerne im Detail beantwortet.',
          linkText: "09232-80101",
          link: "https://www.telefonseelsorge.de/",
        },
      },
    ];

    const breakPoints = useBreakpoints();

    return {
      items,
      breakPoints,
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
  margin: 6.25rem
  @include md
    margin: 1rem 1rem

.items-column
  margin: 1rem 2.5rem

.description
  min-height: 150px


.buttons-wrapper
  @include md
    height: auto
    margin: 2rem 0

.items-nummber
  margin: 0 2rem
</style>
