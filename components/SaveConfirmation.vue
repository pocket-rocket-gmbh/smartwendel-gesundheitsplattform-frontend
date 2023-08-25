<template>
  <v-dialog
    v-model="open"
    width="500"
    transition="dialog-bottom-transition"
    persistent
    
  >
    <v-card class="dialog">
      <span id="confetti-elem" class="confetti-effect"></span>
      <v-card-text class="card-text"
        ><div class="text-h5 pa-10">Deine Daten wurden gespeichert!</div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-row no-gutters>
          <v-col md="6" class="d-flex justify-start">
            <v-btn variant="outlined" class="save-buttons" elevation="0" @click="emitClose()">
              Später veröffentlichen
            </v-btn>
          </v-col>
          <v-col md="6" class="d-flex justify-end">
            <v-btn variant="outlined" class="save-buttons" color="success" elevation="0" @click="emitAccept(), confettiReward()">
              Jetzt veröffentlichen
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { useReward } from "vue-rewards";
export default defineComponent({
  emits: ["close", "accepted"],
  props: {
    open: Boolean,
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const emitClose = async () => {
      await save();
      emit("close");
    };

    const config = {
      startVelocity: 10,
      spread: 180,
      elementCount: 100,
      // etc...
      // you can make this reactive instead etc.
    };

    const { reward: confettiReward, isAnimating: isConfettiAnimating } = useReward('confetti-elem', 'confetti', config) ;

    const emitAccept = async () => {
      await save();
      setTimeout(() => {
        emit("close");
      }, 2000);
     
    };

    const updateApi = useCollectionApi();
    updateApi.setBaseApi(usePrivateApi());

    const save = async () => {
      updateApi.setEndpoint(`care_facilities/${props.item.id}`);
      let data: any = {};
      data.is_active = true;
      await updateApi.updateItem(data, null);
    };

    return {
      emitClose,
      emitAccept,
      save,
      confettiReward,
    };
  },
});
</script>

<style lang="sass">
.dialog
  overflow: hidden !important

.card-text
  text-align: center

.confetti-effect
  padding-top: 20px
  text-align: center
</style>
