<template>
  <div>
    <img :class="['is-rounded mr-2 bordered', size]" v-if="user.image_url" :src="user.image_url"  />
    <img class="is-rounded mr-2" src="@/assets/images/user-standard.png" v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    user: {
      type: Object
    },
    size: {
      type: String,
      default: 'medium'
    }
  }
})
</script>

<style lang="sass" scoped>
.medium
  width: 42px
  height: 42px
.large
  width: 84px
  height: 84px
.bordered
  border: thin solid #015281
</style>