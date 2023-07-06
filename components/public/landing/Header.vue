<template>
  <div class="mt-15 my-15 pl-3">
    <h1 class="title">Deine Gesundheits-plattform im Landkreis Sankt Wendel</h1>
    <PublicLandingChooseCategory class="my-15"/>
    <p class="has-font-size-medium sub-title my-15">Informationen zu Gesundheitsthemen, Präventionsmaßnahmen sowie umfangreiche Pflegeangebote finden.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
  },
})
</script>

<style lang="sass" scoped>
.title
  color: white
  font-size: 55px
  text-transform: uppercase
  line-height: 150%
.sub-title
  color: white
  font-style: normal
  font-weight: 400
  line-height: 160%
  width: 75%

.header
  margin-top: 20%
</style>