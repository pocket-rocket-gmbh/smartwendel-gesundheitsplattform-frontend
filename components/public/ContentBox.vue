<template>
  <v-col :md="`${size}`" class="content-box d-flex flex-column">
    <v-card
      class="rounded-xl mx-auto has-bg-light-grey content elevation-3 fill-height d-flex flex-column"
      width="100%"
    >
      <v-row>
        <v-col md="5" class="d-none d-md-flex">
          <v-img
            v-if="item.image_url"
            class="align-center is-clickable"
            cover
            max-height="300px"
            :src="item.image_url"
          />
          <!-- <div v-else></div> -->
        </v-col>
        <v-col class="d-flex ma-2">
          <div class="notes-card">
            <v-row v-if="item.user">
              <v-col class="d-flex">
                <div class="d-flex align-center user-informations" v-if="item.user.name">
                  <v-icon>mdi-account-outline</v-icon>{{ item.user.name }}
                </div>
              </v-col>
              <v-col class="justify-center d-flex">
                <div class="d-flex align-center is-clickable" v-if="item.user_care_facility?.name">
                  <a :href="`/public/care_facilities/${item.user_care_facility?.id}`" class="is-clickable d-flex">
                    <v-icon>mdi-home-outline</v-icon>
                    <p class="break-title" v-html="item.user_care_facility?.name"></p>
                  </a>
                </div>
              </v-col>
              <v-col>
                <div class="d-flex align-center justify-end" v-if="item.created_at">
                  <v-icon>mdi-calendar-outline</v-icon>{{ useDatetime().parseDatetime(item.created_at) }}
                </div>
              </v-col>
            </v-row>
            <v-divider v-if="item.user" class="my-1"></v-divider>
            <div class="flex-grow-1 d-flex flex-column justify-start">
              <v-card-title class="is-primary pa-0 mt-2">
                <div class="action text-h5" v-if="buttonHref">
                  <a :href="buttonHref">
                    <p class="break-title action" v-html="item.name"></p>
                  </a>
                </div>
              </v-card-title>
              <v-card-text class="flex-grow-1 pa-0 mt-2">
                <p class="break-text" v-html="item.description"></p
              ></v-card-text>
              <v-spacer></v-spacer>
              <v-card-actions>
                <div class="content-footer d-flex mb-3">
                  <div class="action text-h5" v-if="buttonHref">
                    <a :href="buttonHref" :target="item.url ? '_blank' : ''">Mehr anzeigen &gt;</a>
                  </div>
                </div>
              </v-card-actions>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>
<script lang="ts" setup>
import { Facility } from "~/store/searchFilter";
import noImage from "@/assets/images/no-image.svg";
const props = withDefaults(
  defineProps<{
    item: Facility;
    size?: number;
  }>(),
  {
    size: 6,
  }
);

const log = console.log;

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
</script>
<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

$max-height: 240px;

.content-box {
  padding: 1rem;

  @include md {
    padding: 0;
    margin: 0;
  }
}

.content-footer {
  position: absolute;
  bottom: 0;
}

.notes-card {
  flex: 1;
}
</style>
