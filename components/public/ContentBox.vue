<template>
  <div ref="contentBoxRef" class="content-box" v-resize="handleResize">
    <div
      class="image is-clickable"
      @click="goToFacility(buttonHref)"
      v-if="showImage && breakPoints.width.value >= 1420"
    >
      <img v-if="item.image_url" :src="item.image_url" />
      <img v-else :src="noImage" />
    </div>
    <div class="text">
      <template v-if="item.user">
        <div class="info">
          <div
            class="d-flex align-center facility-name is-clickable"
            v-if="item.user_care_facility?.name && item.kind !== 'facility'"
          >
            <span class="mr-3">
              <img :src="facilityIcon" />
            </span>
            <div
              class="is-dark-grey"
              @click="goToMainFacility(item)"
            >
              <span
                class="break-title facility-name general-font-size"
                v-html="item.user_care_facility?.name"
              ></span>
            </div>
          </div>
        </div>
        <hr v-if="item.kind !== 'facility'" />
      </template>
      <div class="content-wrapper">
        <div class="d-flex justify-space-between align-center">
          <a :href="buttonHref">
            <span class="title is-clickable break-title">{{ item.name }}</span>
          </a>
        </div>
        <span
          :class="item.description?.length > 300 ? 'break-text' : ''"
          class="content general-font-size"
          v-html="item.description"
        ></span>
      </div>
      <div
        :class="[
          breakPoints.width.value > 1420
            ? 'd-flex align-center justify-space-between'
            : item.kind !== 'facility'
            ? 'mb-3'
            : '',
        ]"
      >
        <div class="action mb-n2" v-if="buttonHref">
          <v-btn
            @click="goToFacility(buttonHref)"
            :target="item.url ? '_blank' : ''"
            variant="flat"
            color="primary"
            :size="breakPoints.width.value > 960 ? 'large' : 'large'"
            class="general-font-size"
            rounded="pill"
            :width="breakPoints.width.value > 1420 ? '' : '100%'"
          >
            <span class="general-font-size" v-if="item.kind">{{ buttonText }}</span>
            <span class="general-font-size" v-else-if="item.url_kind">{{
              item.button_text
            }}</span>
            <span class="general-font-size" v-else> Mehr anzeigen</span>
          </v-btn>
        </div>
        <div
          class="general-font-size d-flex align-center mb-n3"
          v-if="item.kind === 'event' || item.kind === 'course'"
        >
          <span v-if="item?.event_dates.length && breakPoints.width.value >= 1420">
            <img :src="eventsIcon" class="mr-1" />
            {{ item?.event_dates?.[0]?.slice(0, 10) }}
          </span>
        </div>
        <div
          class="general-font-size d-flex align-center mb-n3"
          v-if="item.kind === 'news'"
        >
          <span v-if="breakPoints.width.value >= 1700">
            <img :src="eventsIcon" class="mr-1" />
            {{ useDatetime().parseDatetime(item?.created_at) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { type Facility } from "~/store/searchFilter";
import noImage from "@/assets/images/no-image.svg";
import facilityIcon from "~/assets/icons/facilityTypes/facilities.svg";
import { useBreakpoints } from "~/composables/ui/breakPoints";
import { default as eventsIcon } from "~/assets/icons/facilityTypes/events.svg";

const props = defineProps<{
  item: Facility;
  size?: number;
}>();

const router = useRouter();

const contentBoxRef = ref<HTMLDivElement>();
const showImage = ref(true);

const breakPoints = useBreakpoints();

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

const goToFacility = (buttonHref: any) => {
  router.push({ path: buttonHref }); 
};

const goToMainFacility = (item:any) => {
  router.push({ path:`/public/care_facilities/${item.user_care_facility?.id}` });
};


const buttonText = computed(() => {
  if (!props.item) return null;
  if (props.item.kind) {
    if (props.item.kind === "course") return "Zum Kurs";
    if (props.item.kind === "event") return "Zur Veranstaltung";
    if (props.item.kind === "news") return "Zum Beitrag";
    if (props.item.kind === "facility") return "Zur Einrichtung";
  }
});

const handleResize = () => {
  if (!contentBoxRef.value) return;
  const imageWidth = contentBoxRef.value.getBoundingClientRect().width;
  showImage.value = imageWidth > 550;
};
</script>
<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

.facility-name {
  color: #58595e;
}

$max-height: 315px;
$max-width: 300px;
$min-width: 200px;

.content-box {
  background-color: #f5f5f5;
  width: 100%;
  height: $max-height;
  border-radius: 2rem;
  box-shadow: 0 3px 3px -2px rgba(0, 0, 0, 0.2), 0 3px 4px 0 rgba(0, 0, 0, 0.14),
    0 1px 8px 0 rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;
  @include md {
    flex-direction: column;
    height: auto;
  }

  .image {
    display: block;

    img {
      width: $max-width;
      height: $max-height;
      object-fit: cover;
    }

    @include md {
      display: none;
    }
  }

  .text {
    flex: 1;
    padding: 1rem;
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
      line-height: 30px;

      .title {
        font-size: 1.4rem;
        font-weight: 500;
        color: #8ab61d;
        &:visited {
          color: #8ab61d;
        }
      }
    }

    .action {
      font-size: 1.2rem;
      @include md {
        margin-top: 1rem;
        margin-bottom: 1rem;
      }
    }
  }
}

.break-text {
  word-break: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  -webkit-box-orient: vertical;
}

.break-title {
  word-break: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

.content {
  line-height: 28px;
}
</style>
