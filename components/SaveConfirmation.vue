<template>
  <v-dialog v-model="open" width="500" transition="dialog-bottom-transition" persistent>
    <img
      v-if="finished"
      class="close-btn is-clickable"
      src="~/assets/images/icon-times.svg"
      height="20"
      @click="emitCloser()"
    />
    <v-card class="dialog">
      <span id="confetti-elem" class="confetti-effect"></span>
      <v-card-text class="card-text">
        <div v-if="finished" class="d-flex flex-column align-center justify-center">
          <v-icon color="primary" size="50" @click="confettiReward()"
            >mdi-party-popper</v-icon
          >
          <div
            id="confetti-elem"
            class="text-h5 pa-10 d-flex flex-column align-center justify-center"
          >
            <span class="mb-5 text-h5"> Vielen Dank! </span>
            <span> Deine Einrichtung wurde online geschaltet! </span>
          </div>

          <div class="is-dark-grey text-h5 font-weight-bold is-clickable">
            <a :href="`/public/care_facilities/${$props.item.id}`"
              ><v-btn
                variant="outlined"
                class="save-buttons"
                color="success"
                elevation="0"
              >
                <span> auf Webseite ansehen </span>
              </v-btn></a
            >
          </div>
        </div>
        <div v-else class="text-h5 pa-10 d-flex flex-column justify-center align-center">
          <span class="text-h5 mb-5">Deine Daten wurden gespeichert!</span>
          <span>Möchtest du deine Einrichtung veröffentlichen?</span>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions v-if="!finished">
        <v-row no-gutters>
          <v-col md="6" class="d-flex justify-start">
            <v-btn
              variant="outlined"
              class="save-buttons"
              elevation="0"
              @click="emitClose()"
            >
              Später veröffentlichen
            </v-btn>
          </v-col>
          <v-col md="6" class="d-flex justify-end">
            <v-btn
              variant="outlined"
              class="save-buttons"
              color="success"
              elevation="0"
              @click="emitAccept(), confettiReward()"
            >
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

    const emitCloser = async () => {
      emit("close");
    };

    const itemId = props.item.id;

    const config = {
      startVelocity: 10,
      spread: 580,
      elementCount: 200,
      // etc...
      // you can make this reactive instead etc.
    };
    const finished = ref(false);

    const { reward: confettiReward, isAnimating: isConfettiAnimating } = useReward(
      "confetti-elem",
      "confetti",
      config
    );

    const emitAccept = async () => {
      await save();
      finished.value = true;
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
      emitCloser,
      emitAccept,
      save,
      confettiReward,
      finished,
      itemId,
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
