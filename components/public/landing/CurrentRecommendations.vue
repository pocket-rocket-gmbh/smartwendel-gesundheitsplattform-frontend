<template>
  <div class="wrapper bg-gradient">
    <div class="d-flex align-center justify-center is-uppercase">
      <h2 class="text-white">Wir zeigen dir, was du für deinen Gesundheitszustand und dein Wohlbefinden tun kannst.</h2>
    </div>
    <div class="d-flex align-center justify-center text-white is-uppercase my-5">
      <h3>Bitte Bereich auswählen:</h3>
    </div>
    <div class="recommendations-wrapper">
      <div
        class="recommendation flex-column justify-center text-center text-white align-center my-5"
        v-for="(item, index) in items"
        :key="index"
      >
        <img class="is-clickable icons" :src="item.content.image" width="120" />
        <div class="font-weight-bold">
          <a :href="item.content.link" target="_blank" class="is-white is-clickable">
            {{ item.content.heading }}
          </a>
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

const items = [
  {
    content: {
      heading: "Sport und Bewegung",
      image: image1,
      link: "www.google.com",
    },
  },
  {
    content: {
      heading: "Ernährung",
      image: image2,
      link: "",
    },
  },
  {
    content: {
      heading: "Mentale Gesundheit",
      image: image3,
      link: "",
    },
  },
  {
    content: {
      heading: "Gesundheitskurse",
      image: image4,
      link: "",
    },
  },
  {
    content: {
      heading: "Freizeitgestaltung",
      image: image5,
      link: "",
    },
  },
];
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

.bg-gradient {
  background: linear-gradient(85.85deg, #91a80d 5.31%, #bac323 35.73%, #9ea100 77.83%);
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
  padding: 5rem;

  @include md {
    padding: 1rem;
  }
}

.recommendations-wrapper {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  // display: grid;
  // grid-template-columns: repeat(5, 1fr);
  // font-size: 22px;

  // @include md {
  //   grid-template-columns: repeat(3, 1fr);
  //   font-size: 18px;
  // }

  // @include sm {
  //   grid-template-columns: 1fr 1fr;
  // }
}
</style>
