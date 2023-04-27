<template>
  <div>
    <v-row v-if="!sucessMessage">
      <v-col cols="8" md="6" class="d-flex justify-start justify-sm-left">
        <v-text-field
          hide-details
          variant="plain"
          density="compact"
          class="input-field pl-5 pb-2"
          clear-icon="mdi-close-circle"
          clearable
          color="58595E"
          :rules="emailRules"
          v-model="newsLetterEmail"
          :append-inner-icon:disabled="terms"
          @click:append-inner="subscribeNewsLetter"
        />
      </v-col>
      <v-col>
        <v-btn
         @click="subscribeNewsLetter"
          variant="outlined"
          icon
          :disabled="!terms || !isValidEmail"
          >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <ClientOnly>
      <v-row v-if="!sucessMessage">
        <v-col class="d-flex justify-start justify-sm-left has-text-white">
          <v-checkbox v-model="terms">
            <template v-slot:label>
              <div>
                Ich willige in die
                <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <a
                      target="_blank"
                      href="/privacy_policy"
                      v-bind="props"
                      @click.stop
                    >
                    Datenschutzerklärung
                    </a>
                  </template>
                  Datenschutzerklärung
                </v-tooltip>
                ein.
              </div>
            </template>
          </v-checkbox>
        </v-col>
      </v-row>
      <v-container v-if="sucessMessage" class="pa-3">
        <v-row>
          <v-col class="has-text-white background pa-3">
            <p class="pa-4">Bitte bestätige deine E-Mail-Adresse über den Bestätigungslink, den wir dir gerade per Email zugeschickt haben.</p>
            <h3 class="pa-4">Wichtig: Checke auch deinen SPAM-Ordner!</h3>
          </v-col>
        </v-row>
      </v-container>
      <div class="has-text-white pa-4">
        <h3 v-if="error">Bitte überprüfe deine Email-Adresse. Zu der von dir eingegebenen Email-Adresse gibt es bereits ein Nutzerkonto.</h3>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";

const sucessMessage = ref(false)
const newsLetterEmail = ref(null)
const config = useRuntimeConfig()
const emailRules = ref([])
const terms = ref(false)
const error = ref(false)

const isValidEmail = computed(() => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return re.test(newsLetterEmail.value);
})

const subscribeNewsLetter = async () => {
  try {
    await axios.post("/api/newsletter", {newsLetterEmail: newsLetterEmail.value})
    sucessMessage.value = true
    } catch (err) {
      if (err) {
        error.value = true
      }
    }
  };
</script>
<style style lang="sass" scoped>

.input-field
  border: 2px solid #58595E
  border-radius: 25px

.background
  background: rgba(255,255,255, 0.1)
  border-radius: 20px

</style>
