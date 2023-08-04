<template>
    <div class="has-text-white mt-10">
      <v-container>
        <h1 class="text-center">Vielen Dank! Deine Email-Bestätigung war erfolgreich! Du wirst in wenigen Sekunden zur Webseite zurück geleitet.</h1>
        <v-row class="mt-10">
          <v-col sm="3" md="4" offset="4">
            <v-btn
              variant="outlined"
              size="large"
              rounded="pill"
              width="100%"
              href="/" 
              target="_blank"
              >
                Zurück zur Webseite
            </v-btn>
        </v-col>
      </v-row>

      </v-container>
    </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'newsletter_success',
  setup() {
    const router = useRouter()

    const resetLink = () => {
      router.push({ path: '/' })
    }


     onMounted(() => {
      setTimeout(() => {
        resetLink()
      }, 8000)
    })

    return {

    }

  }
})
</script>

<style lang="sass" scoped>

</style>