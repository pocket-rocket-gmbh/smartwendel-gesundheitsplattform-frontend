<template>
  <div class="wrapper mt-15 my-15">
    <v-row>
      <v-col cols="12" xl="8" md="10">
        <h1 class="title">Deine Gesundheits-plattform im Landkreis Sankt Wendel</h1>
        <PublicLandingChooseCategory class="my-15" />
        <p class="has-font-size-medium sub-title my-15">
          Informationen zu Gesundheitsthemen, Präventionsmaßnahmen sowie umfangreiche Pflegeangebote finden.
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

.wrapper {
  .title {
    color: white;
    font-size: 55px;
    text-transform: uppercase;
    line-height: 150%;
  }
  .sub-title {
    color: white;
    font-style: normal;
    font-weight: 400;
    line-height: 160%;
    width: 75%;
  }
  .header {
    margin-top: 20%;
  }
}
</style>
