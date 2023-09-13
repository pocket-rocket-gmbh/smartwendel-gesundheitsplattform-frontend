<template>
  <div class="user-profile-image-wrapper">
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
@import "@/assets/sass/main.sass"
.user-profile-image-wrapper
  display: flex
  align-items: center
  justify-content: center

.medium
  width: 42px
  height: 42px
.large
  width: 84px
  height: 84px
.bordered
  border: thin solid #015281
</style>