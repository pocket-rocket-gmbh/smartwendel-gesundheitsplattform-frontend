<template>
  <v-dialog
    v-model="dialog"
    width="500"
    transition="dialog-bottom-transition"
    @click:outside="emitClose()"
  >
    <v-card class="dialog">
      <v-card-title class="text-h5"> Löschen </v-card-title>
      <v-card-text> Möchtest du {{ term }} wirklich löschen? </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-row>
          <v-col md="6" class="d-flex justify-start">
            <v-btn variant="outlined" elevation="0" @click="emitClose()"> abbrechen </v-btn>
          </v-col>
          <v-col md="6" class="d-flex justify-end">
            <v-btn variant="outlined" color="error" elevation="0" @click="deleteItem()"> Löschen </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default defineComponent({
  emits: ["close"],
  props: {
    term: String,
    endpoint: String,
    itemId: String,
  },
  setup(props, { emit }) {
    const dialog = ref(true);

    const api = useCollectionApi();
    api.setBaseApi(usePrivateApi());
    api.setEndpoint(`${props.endpoint}/${props.itemId}`);

    const emitClose = () => {
      emit("close");
    };

    const deleteItem = async () => {
      await api.deleteItem("Der Eintrag wurde erfolgreich gelöscht");
      useNuxtApp().$bus.$emit("triggerGetItems");
      emit("close");
    };

    return {
      dialog,
      emitClose,
      deleteItem,
    };
  },
});
</script>

<style lang="sass">
.dialog
  overflow: hidden !important
</style>
