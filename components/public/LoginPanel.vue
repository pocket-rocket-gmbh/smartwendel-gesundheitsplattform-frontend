<template>
  <div class="login-panel">
    <div>
      <v-btn
        v-if="!useUser().loggedIn()"
        href="/login"
        class="login-buttom"
        color="primary"
        icon
          >
          <v-icon size="x-large">mdi-account-circle-outline</v-icon>
      </v-btn>
    </div>
  </div>
</template>
<style lang="sass" scoped>

.login-panel
  width: 50px
  height: 50px
  position: fixed
  top: 45%
  right: 20px
  text-align: center
  display: grid
  place-items: center
  z-index: 10000
  font-weight: 700

.login-buttom
  box-shadow: -4px 0px 15px rgba(0, 0, 0, 0.5)

</style>