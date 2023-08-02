<template>
  <div class="content-box">
    <a class="image" :href="buttonHref">
      <img v-if="item.image_url" :src="item.image_url" />
      <img v-else :src="noImage" />
    </a>

    <div class="text">
      <template v-if="item.user">
        <div class="info">
          <div class="align-center user-information" v-if="item.user.name">
            <v-icon>mdi-account-outline</v-icon><span class="break-title">{{ item.user.name }}</span>
          </div>
          <div class="d-flex align-center is-clickable" v-if="item.user_care_facility?.name">
            <a :href="`/public/care_facilities/${item.user_care_facility?.id}`" class="is-clickable d-flex">
              <v-icon>mdi-home-outline</v-icon>
              <span class="break-title" v-html="item.user_care_facility?.name"></span>
            </a>
          </div>
          <div class="d-flex align-center justify-end" v-if="item.created_at">
            <v-icon>mdi-calendar-outline</v-icon
            ><span class="break-title">{{ useDatetime().parseDatetime(item.created_at) }}</span>
          </div>
        </div>
        <hr />
      </template>

      <div class="content-wrapper">
        <a :href="buttonHref" class="title">{{ item.name }}</a>
        <div class="content break-text" v-html="item.description"></div>
      </div>
      <div class="action" v-if="buttonHref">
        <a :href="buttonHref" :target="item.url ? '_blank' : ''">Mehr anzeigen &gt;</a>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Facility } from "~/store/searchFilter";
import noImage from "@/assets/images/no-image.svg";
const props = defineProps<{
  item: Facility;
  size?: number;
}>();

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
  background-color: #f5f5f5;
  width: 100%;
  height: $max-height;
  border-radius: 2rem;
  box-shadow: 0 3px 3px -2px rgba(0, 0, 0, 0.2), 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 1px 8px 0 rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;

  .image {
    display: block;

    img {
      width: $max-height;
      height: $max-height;
      object-fit: cover;
    }

    @include md {
      display: none;
    }
  }

  .text {
    flex: 1;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .info {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .user-information {
        display: flex;

        @include sm {
          display: none;
        }
      }
    }

    .content-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-height: 100%;
      overflow: hidden;

      .title {
        font-size: 1.5rem;
        color: #8ab61d;
        &:visited {
          color: #8ab61d;
        }
      }
    }

    .action {
      font-size: 1.5rem;
      color: #8ab61d;
      &:visited {
        color: #8ab61d;
      }
    }
  }
}
</style>
