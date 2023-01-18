<template>
  <img src="@/assets/images/logo.png" class="logo my-10" />
  <h1>
    Ihre Gesundheits plattform im Landkreis St. Wendel
  </h1>
  <p>Finden Sie Informationen zu Gesundheitsthemen und Präventionsmaßnahmen sowie unser umfangreiche Pflegeangebote aus der Region St. Wendel</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
  },
})
</script>

<style lang="sass" scoped>
.logo
  width: 30%
h1
  color: #015281
  font-size: 55px
  font-weight: 600
  text-transform: uppercase
  line-height: 120%
p
  color: #015281
  font-style: normal
  font-weight: 400
  font-size: 15px
  line-height: 160%
</style>