<template>
  <v-row class="mt-4">
    <v-col sm="3" md="3" offset-sm="4">
      <v-card :class="['pa-6', {'shake' : animated}]">
        <img class="is-fullwidth" src="~/assets/images/logo.png" />

        <div class="mb-3 mt-3">
          <v-text-field
            v-model="password"
            type="password"
            label="Passwort"
            hide-details="auto"
          />
        </div>
        <v-btn color="primary" block depressed @click="auth">Anmelden</v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { useAuthStore } from '@/store/auth'
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
    const password = ref('')
    const animated = ref(false)
    const config = useRuntimeConfig()

    const auth = () => {
      if (password.value === config.public.LOGIN_PASSWORD) {
        useAuthStore().$patch({
          'authenticated': true
        })
        localStorage.setItem('smartwendel_gesundheitsplattform_authenticated', 'true')
      } else {
        animated.value = true
        setTimeout(() => {
          animated.value = false
        }, 2000)
      }
    }

    return {
      password,
      animated,
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