<template>
  <div class="wrapper bg-gradient">
    <div class="d-flex align-center justify-center">
      <div class="text-white text-h4 font-weight-medium my-5">
        Wir zeigen dir, was du Gutes für deine Gesundheit und dein Wohlbefinden
        tun kannst.
      </div>
    </div>
    <div class="recommendations-wrapper">
      <div
        class="recommendation flex-column justify-center text-center text-white align-center my-5"
        v-for="(item, index) in items"
        :key="index"
      >
        <div @click="goToLink(item.content.link)" class="is-white is-clickable">
          <img
            class="is-clickable icons"
            :src="item.content.image"
            width="120"
          />
          <div class="font-weight-medium general-font-size">
            {{ item.content.heading }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import image1 from "@/assets/images/current-recommendations/icon_sport.svg";
import image2 from "@/assets/images/current-recommendations/icon_nutrition.svg";
import image3 from "@/assets/images/current-recommendations/icon_mental_health.svg";
import image4 from "@/assets/images/current-recommendations/icon_health_course.svg";
import image5 from "@/assets/images/current-recommendations/icon_free_time.svg";

const router = useRouter();

const goToLink = (item: string) => {
  router.push({ path: item });
};

const items = [
  {
    content: {
      heading: "Sport und Bewegung",
      image: image1,
      link: "/public/categories/d586e289-be57-4654-ac1f-3d64bf50c508?sub_category_id=9b3ed77f-d337-4064-a935-a9e41d6d99a5",
    },
  },
  {
    content: {
      heading: "Ernährung",
      image: image2,
      link: "/public/categories/d586e289-be57-4654-ac1f-3d64bf50c508?sub_category_id=c88b0ce6-e51d-435f-8689-ed4bb193fab1",
    },
  },
  {
    content: {
      heading: "Mentale Gesundheit",
      image: image3,
      link: "/public/categories/d586e289-be57-4654-ac1f-3d64bf50c508?sub_category_id=0c2cf2d5-2834-45d6-a912-957a1f8e5153",
    },
  },
  {
    content: {
      heading: "Gesundheitskurse",
      image: image4,
      link: "/public/search/courses",
    },
  },
  {
    content: {
      heading: "Freizeitgestaltung",
      image: image5,
      link: "https://www.sankt-Wunsiedeler-land.de/aktiv",
    },
  },
];
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

.bg-gradient {
  // background: linear-gradient(85.85deg, #91a80d 5.31%, #bac323 35.73%, #9ea100 77.83%);
  background: $dark-green;
}
.icons {
  border-radius: 50%;
  border: 1px solid white;
  &:hover {
    transform: scale(1.1);
    transition: transform 0.5s ease-in-out;
    cursor: pointer;
  }
}

.wrapper {
  padding: 2rem 5rem;

  @include md {
    padding: 1rem;
  }
}

.recommendations-wrapper {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  // font-size: 22px;

  @include md {
    grid-template-columns: repeat(3, 1fr);
    font-size: 18px;
  }

  @include sm {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
