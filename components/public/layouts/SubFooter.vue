<template>
  <v-container :class="[($device.isMobile ? 'my-5' : '')]">
    <v-row class="align-center">
      <v-col cols="6" md="3" sm="6" class="d-flex justify-center">
        <a href="https://www.landkreis-st-wendel.de/" target="_blank">
          <img src="~/assets/images/sub-footer/logo-footer-wnd(black).png" class="is-clickable" :class="[($device.isMobile ? 'mobile-height' : 'desktop-height')]"/>
        </a>
      </v-col>
      <v-col cols="6" md="3" sm="6" class="d-flex justify-center">
        <a href=" https://www.wfg-wnd.de/" target="_blank">
          <img src="~/assets/images/sub-footer/logo-footer-wfg.png" class="is-clickable" :class="[($device.isMobile ? 'mobile-bigger-width' : 'desktop-height desktop-height-wfg')]"/>
        </a>
      </v-col>
      <v-col cols="6" md="3" sm="6" class="d-flex justify-center">
        <a href="https://www.bmwsb.bund.de" target="_blank">
          <img src="~/assets/images/sub-footer/logo-bundesministerium.png" class="is-clickable" :class="[($device.isMobile ? 'mobile-height' : 'desktop-height')]"/>
        </a>
      </v-col>
      <v-col cols="6" md="3" sm="6" class="d-flex justify-center">
        <a href="https://www.kfw.de/kfw.de.html" target="_blank">
          <img src="~/assets/images/sub-footer/logo-footer-kfw.png" class="is-clickable" :class="[($device.isMobile ? 'mobile-height' : 'desktop-height-kfw')]"/>
        </a>
      </v-col>
    </v-row>
  </v-container>  
</template>

<style lang="sass" scoped>
.sub-footer
  background: white

.mobile-height
  max-width: 100px

.desktop-height
  max-width: 200px

.desktop-height-kfw
  margin-top: -30px
  max-width: 100px

.desktop-height-wfg
  margin-top: -30px

.mobile-bigger-width
  max-width: 150px

</style>