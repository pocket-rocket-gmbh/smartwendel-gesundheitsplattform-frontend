<template>
  <div class="content-box">
    <a class="image" :href="buttonHref">
      <img v-if="item.image_url" :src="item.image_url" />
      <div v-else class="placeholder"></div>
    </a>
    <div class="content">
      <div class="title">
        <a :href="buttonHref" class="name">{{ item.name }}</a>
        <div class="info">
          <div class="author">{{ item.user.name }}</div>
          <span> &nbsp;-&nbsp;</span>
          <div class="facility">{{ item.user_care_facility_name }}</div>
          <span> &nbsp;-&nbsp;</span>
          <div class="date">{{ useDatetime().parseDateAndTime(item.created_at) }}</div>
        </div>
      </div>
      <div class="description break-text" v-html="item.description"></div>
      <div class="action" v-if="buttonHref">
        <a :href="buttonHref" :target="item.url ? '_blank' : ''">Mehr anzeigen &gt;</a>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Facility } from "~/store/searchFilter";

const props = defineProps<{
  item: Facility;
}>();

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

      .info {
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
      }
    }

    .description {
      flex: 1;
    }

    .action {
      a {
        cursor: pointer;
        font-size: 1.25rem;
        color: #636362;
        font-weight: bold;
      }
    }
  }
}
</style>
