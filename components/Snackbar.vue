<template>
  <v-snackbar v-model="snackbar.visible" :color="snackbar.color" :timeout="snackbar.timeout">
    {{ snackbar.content }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { useSnackbarStore } from "~/store/snackbar";

const snackbar = useSnackbarStore();

onMounted(()=>{
  console.log("snackbar")
})
</script>
