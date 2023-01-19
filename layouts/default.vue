<template>
  <v-app>

    <div v-if="!authenticated">
      <PublicPasswordProtection />
    </div>

    <div v-else>
      <PublicLayoutsTopBar />
      <PublicLayoutsSecondBar />

      <v-main>
        <slot />
      </v-main>
      <PublicLayoutsFooter />
    </div>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthStore } from '@/store/auth'
export default defineComponent({
  setup () {

    onMounted(() => {
      const auth = localStorage.getItem('smartwendel_gesundheitsplattform_authenticated')
      if (auth && auth === 'true') {
        useAuthStore().$patch({
          'authenticated': true
        })
      }
    })

    const authenticated = computed(() => {
      return useAuthStore().authenticated
    })

    return {
      authenticated
    }
  }
})
</script>

<style lang="sass" scoped>

</style>