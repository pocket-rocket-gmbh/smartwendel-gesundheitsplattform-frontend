<template>
  <div class="categories-wrapper">
    <div class="text general-font-size">
      <h2 class="is-primary text-h4 font-weight-bold text-uppercase mb-5">
        Pflege, Ärtze, <br />
        Krankenhäuser und co.
      </h2>
      <p class="text-justify">
        Über diese Suchfunktion findest du sicher schnell die passende Einrichtung und den
        richtigen Ansprechpartner.
      </p>
      <p class="text-justify mt-5">
        Ob in Bereich Pflege, Gesundheit oder Prävention. Sicher findest du unter mehr als
        1.000 gelisteten Anbietern die Leistung, nach der du suchst. Du informierest dich über
        die Angebote oder nimmst direkt Kontakt auf und vereinbarst ein persönliches
        Beratungsgespräch.
      </p>
      <div class="button my-5">
        <v-btn
          variant="flat"
          color="primary"
          rounded="pill"
          size="large"
          @click="goToSearch()"
        >
          <span> Alle Einrichtungen </span>
        </v-btn>
      </div>
    </div>
    <div class="icons">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="d-flex is-clickable icon"
        @click="goToLink(item.content.link)"
      >
        <img class="image" :src="item.content.icon" />
        <div class="d-flex align-center">
          <div class="font-weight-bold d-flex align-center is-clickable">
            <span class="is-dark-grey general-font-size" v-html="item.content.heading"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>

import icon1 from "@/assets/images/categories/icon_fitness.svg";
import icon2 from "@/assets/images/categories/icon_doctor.svg";
import icon3 from "@/assets/images/categories/icon_clubs.svg";
import icon4 from "@/assets/images/categories/icon_caring.svg";
import icon5 from "@/assets/images/categories/icon_consulting.svg";
import icon6 from "@/assets/images/categories/icon_medical.svg";

const router = useRouter();

const goToSearch = () => {
  router.push({ path: "/public/search/facilities" });
};

const goToLink = (item: string) => {
  router.push({ path: `/public/search/facilities${item}` });
};

const items = [
  {
    content: {
      heading: "Sportstätten",
      icon: icon1,
      link: "",
    },
  },
  {
    content: {
      heading: "Ärztliche Versorgung",
      icon: icon2,
      link: "",
    },
  },
  {
    content: {
      heading: "Vereine",
      icon: icon3,
      link: "",
    },
  },
  {
    content: {
      heading: "Plege",
      icon: icon4,
      link: "",
    },
  },
  {
    content: {
      heading: "Beratung",
      icon: icon5,
      link: "",
    },
  },
  {
    content: {
      heading: "Kliniken",
      icon: icon6,
      link: "",
    },
  },
];
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main";

.categories-wrapper {
  margin: 5rem;
  display: flex;
  gap: 8rem;

  @include md {
    margin: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .text {
    flex: 3;
    display: flex;
    flex-direction: column;

    .button {
      @include md {
        align-self: center;
      }
    }
  }

  .icons {
    flex: 4;
    gap: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .icon {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: calc(50% - 0.5rem);
    box-sizing: border-box;

    .image {
      border-radius: 50%;
      border: 1px solid black;
      background-color: white;
      transition: transform 0.5s ease-in-out;

      &:hover {
        transform: scale(1.1);
        cursor: pointer;
      }
    }
  }

  @media (max-width: 768px) {
    .icon {
      flex: 100%;
      padding-top: 30px;
      text-align: center;
    }
  }
}
</style>
