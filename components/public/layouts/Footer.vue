<template>
  <v-footer class="is-light-grey-background is-white-color footer-wraper">
    <v-row justify="center" no-gutters>
      <v-col class="d-flex flex-column justify-start align-center align-md-start order-2 order-md-first order-sm-2 order-xs-2" cols="12" md="4" sm="12" xl="4" xs="12">
        <h3 class="mb-3 is-secondary">Landkreis Wunsiedel i. Fichtelgebirge</h3>
        <div v-for="link in links" class="is-paragraph is-secondary my-1">
          {{ link.title }}
        </div>
        <div class="mt-3">
          <v-row>
            <v-col>
              <v-btn
                href="https://www.facebook.com/freiraumfichtelgebirge"
                target="_blank"
                variant="outlined"
                :size="[breakPoints.width.value < 600 ? 'small' : 'large'].join('')"
                icon
                class="social-buttons"
              >
                <v-icon>mdi-facebook</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                href="https://www.instagram.com/freiraumfichtelgebirge"
                target="_blank"
                variant="outlined"
                :size="[breakPoints.width.value < 600 ? 'small' : 'large'].join('')"
                icon
                class="social-buttons"
              >
                <v-icon>mdi-instagram</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                href="https://www.youtube.com/channel/UCdwdUZRBXLr-fEZ09YwVINQ"
                target="_blank"
                variant="outlined"
                :size="[breakPoints.width.value < 600 ? 'small' : 'large'].join('')"
                icon
                class="social-buttons"
              >
                <v-icon>mdi-youtube</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col class="d-flex justify-center align-start order-md-2 order-sm-first order-1 order-xs-first" cols="12" md="4" sm="12" xl="4" xs="12">
        <img class="mt-3 ml-4" src="~/assets/images/logo.png" width="200" />
      </v-col>
      <v-col class="d-flex flex-column justify-start align-center order-3 align-md-end order-sm-3 order-xs-3 mt-sm-10 my-md-0 my-10 " cols="12" md="4" sm="12" xl="4" xs="12">
        <div class="is-label-big is-secondary my-md-3 my-5">Ihr Angebot fehlt?</div>
        <div class="is-paragraph text-md-right is-secondary text-center mb-md-5 my-5">
          Sie betreiben eine Pflegeeinrichtung und bieten sonstige Leistungen im Bereich
          Pflege an? Dann registrieren Sie sich.
        </div>
        <div>
          <v-btn
            variant="flat"
            class="is-button-text"
            color="primary"
            rounded="pill"
            size="x-large"
          >
            <router-link class="" to="/register"> Registrieren </router-link>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script setup lang="ts">
const route = useRoute();
import { useBreakpoints } from "~/composables/ui/breakPoints";

const breakPoints = useBreakpoints();

const links = [
  {
    title: "Kontakt",
    link: "/impressum",
  },
  {
    title: "Nutzungsbedinungen",
    link: "/datenschutz",
  },
  {
    title: "Datenschutz",
    link: "/kontakt",
  },
  {
    title: "Impressum",
    link: "/sitemap",
  },
];

const currentRoute = computed(() => {
  return route.path as string;
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.footer-wraper
  padding: 6.25rem
  @include md
    padding: 2rem 1rem
.social-buttons
  border: 1px solid
  color: $dark-green
  &:visited
    color: $dark-green
  @include md
    padding: 5px
</style>
