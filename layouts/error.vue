<template>

</template>

<script lang="ts">
export default defineComponent({
  name: 'Index',
  setup() {
    const router = useRouter()
    const resetLink = () => {
      router.push({ path: '/' })
    }
     onMounted(() => {
      resetLink()
    })
  }
})
</script>

<style lang="sass" scoped>

</style>