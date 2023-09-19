<template>
  <v-dialog
    width="900"
    height="600"
    v-model="opened"
    transition="dialog-bottom-transition"
    class="mt-10 general-font-size"
    scrollable
  >
    <img
      class="close-btn is-clickable"
      src="~/assets/images/icon-times.svg"
      height="20"
      @click="close()"
    />
    <v-card class="dialog">
      <v-card-text>
        <v-row>
          <v-col class="d-flex align-center justify-center">
            <v-img
              v-if="item?.image_url"
              :src="item?.image_url"
              contain
              aspect-ratio="16/9"
            />
            <v-img
              v-else
              :src="noImage"
              contain
              aspect-ratio="1"
              class="no-image"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex flex-column justify-center aligin-center">
            <h3 class="mb-4">{{ item?.name }}</h3>
            <div class="content" v-html="item?.description"></div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-row>
          <v-col class="d-flex"   :class="[item.kind ? 'justify-space-between' : 'justify-center']">
            <v-btn elevation="0" variant="outlined" @click="close"> Schließen </v-btn>
          </v-col>
          <v-col class="d-flex justify-end" v-if="item.kind">
            <v-btn
              :href="buttonHref"
              :target="item.url ? '_blank' : ''"
              variant="flat"
              color="primary"
            >
              <span >{{ buttonText }}</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import noImage from "@/assets/images/no-image.svg";
const emit = defineEmits(["close"]);
const props = defineProps({
  open: Boolean,
  item: {
    type: Object,
    required: true,
  },
});

const buttonHref = computed(() => {
  if (!props.item) return null;

  if (props.item.kind) {
    if (props.item.kind === "course") return `/public/care_facilities/${props.item.id}`;
    if (props.item.kind === "event") return `/public/care_facilities/${props.item.id}`;
    if (props.item.kind === "news") return `/public/care_facilities/${props.item.id}`;
    if (props.item.kind === "facility") return `/public/care_facilities/${props.item.id}`;
  }

  if (props.item.url) {
    if (props.item.url_kind === "internal") {
      return props.item.url;
    }

    if (props.item.url.includes("http://") || props.item.url.includes("https://")) {
      return props.item.url;
    } else return "https://" + props.item.url;
  }

  return null;
});

const buttonText = computed(() => {
  if (!props.item) return null;
  if (props.item.kind) {
    if (props.item.kind === "course") return "Zum Kurs";
    if (props.item.kind === "event") return "Zur Veranstaltung";
    if (props.item.kind === "news") return "Zum Beitrag";
    if (props.item.kind === "facility") return "Zur Einrichtung";
  }
});

const opened = ref(props.open);
const item = ref(props.item);

const close = () => {
  opened.value = false;
  emit("close");
};

onMounted(() => {});
</script>

<style lang="sass">
.dialog
  overflow: hidden !important

.card-text
  text-align: center

.no-image
  opacity: 0.5

.confetti-effect
  padding-top: 20px
  text-align: center
</style>
