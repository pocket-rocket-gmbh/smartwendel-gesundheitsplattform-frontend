<template>
  <div ref="contentBoxRef" class="content-box" v-resize="handleResize">
    <a class="image" :href="buttonHref" v-if="showImage">
      <img v-if="item.image_url" :src="item.image_url" />
      <img v-else :src="noImage" />
    </a>
    <div class="text">
      <template v-if="item.user">
        <div class="info">
          <div class="align-center user-information" v-if="item?.name_instructor">
            <v-icon class="facility-name">mdi-account-outline</v-icon
            ><span class="break-title">{{ item?.name_instructor }}</span>
          </div>

          <div class="d-flex align-center justify-end" v-if="item.created_at">
            <v-icon>mdi-calendar-outline</v-icon
            ><span class="break-title">{{
              useDatetime().parseDatetime(item.created_at)
            }}</span>
          </div>
          <div
            class="d-flex align-center facility-name is-clickable"
            v-if="item.user_care_facility?.name"
          >
            <v-btn
              :href="`/public/care_facilities/${item.user_care_facility?.id}`"
              variant="outlined"
              rounded="pill"
              size="small"
            >
              <span
                class="break-title facility-name"
                v-html="item.user_care_facility?.name"
              ></span>
            </v-btn>
          </div>
        </div>
        <hr />
      </template>
      <div class="content-wrapper">
        <div class="d-flex justify-space-between align-center">
          <span class="title is-clickable">{{ item.name }}</span>
          <span
            v-if="item.description.length > 260"
            class="is-clickable"
            @click="openContentModal()"
          >
            <v-btn size="small" variant="text" class="read-more"> weiter lesen </v-btn>
          </span>
        </div>

        <span class="content break-text general-font-size" v-html="item.description"></span>
      </div>

      <PublicCategoriesContentModal
        :open="contentModalOpen"
        :item="item"
        v-if="contentModalOpen"
      />
      <div class="action" v-if="buttonHref">
        <v-btn
          :href="buttonHref"
          :target="item.url ? '_blank' : ''"
          variant="flat"
          color="grey"
          rounded="pill"
          size="small"
        >
          Mehr anzeigen &gt;
        </v-btn>
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

const contentModalOpen = ref(false);

const openContentModal = () => {
  contentModalOpen.value = !contentModalOpen.value;
};

const contentBoxRef = ref<HTMLDivElement>();
const showImage = ref(true);

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

const handleResize = () => {
  if (!contentBoxRef.value) return;

  showImage.value = contentBoxRef.value.getBoundingClientRect().width > 550;
};
</script>
<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

.facility-name {
  color: #58595e;
}

$max-height: 240px;

.content-box {
  background-color: #f5f5f5;
  width: 100%;
  height: $max-height;
  border-radius: 2rem;
  box-shadow: 0 3px 3px -2px rgba(0, 0, 0, 0.2), 0 3px 4px 0 rgba(0, 0, 0, 0.14),
    0 1px 8px 0 rgba(0, 0, 0, 0.12);
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
      font-size: 0.75em;
      color: #a3a3a3;
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
      font-size: 1.2rem;
    }
  }
}
</style>
