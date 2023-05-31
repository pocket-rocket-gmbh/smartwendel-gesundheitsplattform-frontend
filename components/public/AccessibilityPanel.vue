<template>
  <div class="accessibility-panel">
    <div class="increase-size is-clickable">
      <p>A+</p>
    </div>
    <div class="divider"></div>
    <div class="decrease-size is-clickable py-1">
      <p>A -</p>
    </div>
  </div>
</template>
<style style lang="sass" scoped>

.accessibility-panel
  background: linear-gradient(180deg, #00783B 0%, #009E55 40.42%, #006B38 97.19%)
  box-shadow: -4px 0px 15px rgba(0, 0, 0, 0.25)
  border-radius: 5px 0px 0px 5px
  color: #ffffff
  width: 50px
  height: 100px
  position: fixed
  top: 30%
  right: 0
  text-align: center
  display: grid
  place-items: center
  z-index: 10000
  font-weight: 700

.divider
  border: 2px white solid
  width: 80%
  opacity: .7

.increase-size
  font-size: 25px

.decrease-size
  font-size: 18px

</style>