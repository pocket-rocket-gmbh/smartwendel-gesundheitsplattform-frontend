<template>
  <v-row class="mt-6">
    <v-col sm="3" md="4" offset-sm="4">
      <v-card  :class="['pa-6', {'shake' : animated}]">
        <img class="is-fullwidth" src="~/assets/images/logo.png" />
        <div v-if="!registerSuccessful" class="mt-3">
          <div class="field">
            <v-text-field
              v-model="careFacilityName"
              type="text"
              label="Name der Einrichtung/ Unternehmen/Verband/Verein/Behörde *"
              :error-messages="useErrors().checkAndMapErrors('firstname', errors)"
              hide-details="auto"
            />
          </div>
          <div class="field">
            <v-text-field
              v-model="firstname"
              type="text"
              label="Vorname *"
              :error-messages="useErrors().checkAndMapErrors('firstname', errors)"
              hide-details="auto"
            />
          </div>
          <div class="field">
            <v-text-field
              v-model="lastname"
              type="text"
              label="Nachname *"
              :error-messages="useErrors().checkAndMapErrors('lastname', errors)"
              hide-details="auto"
            />
          </div>
          <div class="field">
            <v-text-field v-model="email"
              type="email"
              label="E-Mail Adresse *"
              hide-details="auto"
              :error-messages="useErrors().checkAndMapErrors('email', errors)"
            />
          </div>
          <v-checkbox v-model="privacyAccepted">
            <template v-slot:label>
              <div>
                Ich stimme der
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <a
                      target="_blank"
                      href="/privacy_policy"
                      @click.stop
                      v-on="on"
                    >
                      <u>Datenschutzerklärung</u>
                    </a>
                  </template>
                  Datenschutzerklärung öffnen
                </v-tooltip>
                <span> und den </span>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <a
                      target="_blank"
                      href="/terms_of_use"
                      @click.stop
                      v-on="on"
                    >
                      <u>Nutzungsbedingungen</u>
                    </a>
                  </template>
                  Nutzungsbedingungen öffnen
                </v-tooltip>
                zu
              </div>
            </template>
          </v-checkbox>
          <v-btn color="primary" block depressed @click="register" :disabled="!formValidated">Registrieren</v-btn>
        </div>
        <div v-else align="center">
          Deine Registrierung war erfolgreich.<br/>Wir haben Dir soeben eine E-Mail mit weiteren Anweisungen und einem temporären Passwort geschickt.
        </div>
        <v-btn block depressed to="/" class="mt-2">zurück</v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { ResultStatus, ServerCallResult } from '@/types/serverCallResult'
import axios from 'axios'

const careFacilityName = ref('')
const email = ref('')
const firstname = ref('')
const lastname = ref('')
const loading = ref(false)
const animated = ref(false)
const errors = ref({})
const registerSuccessful = ref(false)
const privacyAccepted = ref(false)

const isValidEmail = (email:string) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return re.test(email);
}

const formValidated = computed(() => {
  return careFacilityName.value.length > 0 && firstname.value.length > 0 && lastname.value.length > 0 && isValidEmail(email.value) && privacyAccepted.value
})

const register = async () => {
  loading.value = true
  errors.value = {}
  const data = {
    email: email.value,
    firstname: firstname.value,
    lastname: lastname.value,
    care_facility_name: careFacilityName.value,
    commercial_register_number: " "
  }

  const {data: result} = await axios.post<ServerCallResult>("/api/register_with_facility", {data});

  if (result.status === ResultStatus.SUCCESSFUL) {
    localStorage.setItem('health_platform._remembered_email', email.value)
    registerSuccessful.value = true
  } else {
    errors.value = { errors: [{ field_name: 'email', code: 'register.failed' }] }
    loading.value = false

    // animate shake
    animated.value = true
    setTimeout(() => {
      animated.value = false
    }, 1000)
  }
}

onMounted(() => {
  const rememberedEmail = localStorage.getItem('health_platform._remembered_email')
  if (rememberedEmail) {
    setTimeout(() => {
      email.value = rememberedEmail
    }, 300)
  }
})
</script>

<style lang="css" scoped>
.shake {
  animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
}
@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>