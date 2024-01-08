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
            <span>{{ itemKindStep2 }} wurde online geschaltet! </span>
          </div>
          <div class="is-dark-grey text-h5 font-weight-bold is-clickable">
            <a :href="linkToFacility" target="_blank">
              <v-btn
                v-if="facilityId || item.id"
                variant="flat"
                color="primary"
                @click="emitAccept(), confettiReward()"
              >
                <span> auf Webseite ansehen </span>
              </v-btn>
            </a>
          </div>
        </div>
        <div v-else class="text-h5 pa-5 d-flex flex-column justify-center align-center">
          <span class="mb-5"><v-icon color="primary">mdi-check-outline</v-icon></span>
          <span class="text-h5 mb-5">Deine Daten wurden gespeichert!</span>
          <span v-if="user.is_active_on_health_scope"
            >Möchtest du {{ itemKindStep1 }} veröffentlichen?</span
          >
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions v-if="!finished">
        <v-row no-gutters v-if="!item.id && !facilityId">
          <v-col class="d-flex justify-center">
            <LoadingSpinner />
          </v-col>
        </v-row>
        <v-row
          no-gutters
          v-if="user.is_active_on_health_scope && (item.id || facilityId)"
        >
          <v-col md="6" class="d-flex justify-start">
            <v-btn
              variant="outlined"
              class="save-buttons"
              elevation="0"
              @click="emitCloser()"
            >
              Später veröffentlichen
            </v-btn>
          </v-col>
          <v-col md="6" class="d-flex justify-end">
            <v-btn variant="flat" color="primary" @click="emitAccept(), confettiReward()">
              <span> Jetzt veröffentlichen </span>
            </v-btn>
          </v-col>
        </v-row>
        <v-row
          no-gutters
          v-if="!user.is_active_on_health_scope"
        >
          <v-col class="d-flex justify-center">
            <v-btn
              variant="outlined"
              class="save-buttons"
              elevation="0"
              @click="emitCloser()"
            >
              Schließen
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { Loading, LoadingSpinner } from "#build/components";
import { useReward } from "vue-rewards";
export default defineComponent({
  emits: ["close", "accepted", "update"],
  props: {
    open: Boolean,
    item: {
      type: Object,
      required: true,
    },
    facilityId: {
      type: String,
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

    const itemKindStep1 = computed(() => {
      if (props.item.kind === "facility") {
        return "deine Einrichtung";
      } else if (props.item.kind === "course") {
        return "deinen Kurs";
      } else if (props.item.kind === "event") {
        return "deine Veranstaltung";
      } else if (props.item.kind === "news") {
        return "deinen Beitrag";
      }
    });
    const itemKindStep2 = computed(() => {
      if (props.item.kind === "facility") {
        return "Deine Einrichtung";
      } else if (props.item.kind === "course") {
        return "Dein Kurs";
      } else if (props.item.kind === "event") {
        return "Deine Veranstaltung";
      } else if (props.item.kind === "news") {
        return "Dein Beitrag";
      }
    });

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

    const loadingSpinner = ref(false);

    const save = async () => {
      loadingSpinner.value = true;
      if (props.facilityId) {
        updateApi.setEndpoint(`care_facilities/${props.facilityId}`);
      } else {
        updateApi.setEndpoint(`care_facilities/${props.item.id}`);
      }
      let data: any = {};
      data.is_active = true;
      await updateApi.updateItem(data, null);

      emit("update");
      loadingSpinner.value = false;
    };

    const setupFinished = ref(false);

    const linkToFacility = computed(() => {
      if (props.item.id) {
        return `/public/care_facilities/${props.item.id}`;
      }
      if (props.facilityId) {
        return `/public/care_facilities/${props.facilityId}`;
      }
      if (itemId) {
        return `/public/care_facilities/${itemId}`;
      }
    });

    const user = useUser().currentUser;

    onMounted(async () => {
      setupFinished.value = await useUser().setupFinished();
    });

    return {
      emitClose,
      emitCloser,
      emitAccept,
      save,
      confettiReward,
      finished,
      itemId,
      itemKindStep1,
      itemKindStep2,
      setupFinished,
      user,
      linkToFacility,
      loadingSpinner,
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
