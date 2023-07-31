<template>
  <v-col :md="`${size}`" class="d-flex flex-column">
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
                <div
                  class="d-flex align-center is-clickable"
                  v-if="item.user_care_facility?.name"
                >
                  <a
                    :href="`/public/care_facilities/${item.user_care_facility?.id}`"
                    class="is-clickable d-flex"
                  >
                    <v-icon>mdi-home-outline</v-icon>
                    <p
                      class="break-title"
                      v-html="item.user_care_facility?.name"
                    ></p>
                  </a>
                </div>
              </v-col>
              <v-col>
                <div
                  class="d-flex align-center justify-end"
                  v-if="item.created_at"
                >
                  <v-icon>mdi-calendar-outline</v-icon
                  >{{ useDatetime().parseDatetime(item.created_at) }}
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
                    <a :href="buttonHref" :target="item.url ? '_blank' : ''"
                      >Mehr anzeigen &gt;</a
                    >
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
    size?: string;
  }>(),
  {
    size: "6",
  }
);

const log = console.log;

const buttonHref = computed(() => {
  if (!props.item) return null;

  if (props.item.kind) {
    if (props.item.kind === "course")
      return `/public/care_facilities/${props.item.id}`;
    if (props.item.kind === "event")
      return `/public/care_facilities/${props.item.id}`;
    if (props.item.kind === "news")
      return `/public/care_facilities/${props.item.id}`;
    if (props.item.kind === "facility")
      return `/public/care_facilities/${props.item.id}`;
  }

  if (props.item.url) {
    if (props.item.url_kind === "internal") {
      return props.item.url;
    }

    if (
      props.item.url.includes("http://") ||
      props.item.url.includes("https://")
    ) {
      return props.item.url;
    } else return "https://" + props.item.url;
  }

  return null;
});
</script>
<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

$max-height: 240px;

.content-footer {
  position: absolute;
  bottom: 0;
}

.notes-card {
  flex: 1;
}

.content-box {
  display: flex;
  width: 100%;
  min-height: $max-height;
  max-height: $max-height;
  background-color: #f5f5f5;
  display: flex;
  margin: 1rem;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15);

  .image {
    width: $max-height;
    height: $max-height;
    max-width: $max-height;
    max-height: $max-height;
    min-width: $max-height;
    min-height: $max-height;

    img {
      width: $max-height;
      height: $max-height;
      max-width: $max-height;
      max-height: $max-height;
      min-width: $max-height;
      min-height: $max-height;
      object-fit: cover;
    }
  }

  .content {
    padding: 1.75rem 1.25rem;
    display: flex;
    flex-direction: column;
    flex: 1;

    .title {
      color: #8ab61d;
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .name {
        color: #8ab61d;
      }
    }

    .description {
      flex: 1;
    }

    .user-informations {
      font-size: 12px;
    }

    .action {
      a {
        cursor: pointer;
        font-size: 1.25rem;
      }
    }
  }
}
</style>
