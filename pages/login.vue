<template>
  <v-row class="my-15">
    <v-col sm="3" md="4" offset-sm="4">
      <v-form @submit.prevent="auth">
        <v-card  :class="['pa-6', {'shake' : animated}]">
          <img class="is-fullwidth" src="~/assets/images/logo.png" />
          <div class="mb-3">
            <v-text-field v-model="email"
              class="pt-6"
              label="E-Mail Adresse"
              hide-details="auto"
            />
          </div>
          <div class="mb-3">
            <v-text-field v-model="password"
              type="password"
              label="Passwort"
              :error-messages="useErrors().mappedErrorCode(errors)"
              hide-details="auto"
            />
          </div>
          <v-btn color="primary" block depressed type="submit">Login</v-btn>
          <nuxt-link to="/password_forgotten"><div align="center" class="mt-2">Passwort vergessen?</div></nuxt-link>
          <nuxt-link to="/register"><div align="center" class="mt-6">Noch keinen Account? Jetzt registrieren!</div></nuxt-link>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { useUserStore } from '@/store/user'
import { ResultStatus } from '@/types/serverCallResult'

export default defineComponent({
  name: 'Login',
  setup() {
    const email = ref('')
    const password = ref('')
    const loading = ref(false)
    const animated = ref(false)
    const errors = ref('')
    const lastRoute = ref(null)

    const router = useRouter()
    const privateApi = usePrivateApi()
    const userStore = useUserStore()

    const auth = async () => {
      loading.value = true
      errors.value = ''
      const data = { email: email.value, password: password.value }

      const result = await privateApi?.call('post', '/auth', data)

      if (result?.status === ResultStatus.SUCCESSFUL) {
        const jwt = result.data.jwt_token

        if (process.client) {
          localStorage.setItem('auth._token.jwt', jwt)
          localStorage.setItem('smartwendelerland_gesundheitsplattform._remembered_email', email.value)
        }

        // set user
        userStore.currentUser = result.data.user
        userStore.loggedIn = true

        if (userStore.currentUser) {
          // move to dashboard
          if (lastRoute.value && lastRoute.value !== '/password_forgotten') {
            router.push({ path: lastRoute.value })
          } else if (result.data.user.role === 'user') {
            router.push({ path: '/' })
          } else {
            router.push({ path: '/admin' })
          }
        }
      } else {
        errors.value = result?.data
        loading.value = false

        // animate shake
        animated.value = true
        setTimeout(() => {
          animated.value = false
        }, 2000)
      }
    }

    onMounted(() => {
      lastRoute.value = router.options.history.state.back as null
      if (process.client) {
        const rememberedEmail = localStorage.getItem('smartwendelerland_gesundheitsplattform._remembered_email')
        if (rememberedEmail) {
          setTimeout(() => {
            email.value = rememberedEmail
          }, 300)
        }
      }
    })

    return {
      email,
      password,
      loading,
      animated,
      errors,
      auth
    }
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