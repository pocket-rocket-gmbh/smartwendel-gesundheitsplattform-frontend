<template>
  <div class="categories-wrapper">
    <div class="text general-font-size">
      <div class="is-primary text-h4 font-weight-bold text-uppercase mb-5">
        <p>
          Anbieter aus Prävention und Gesundheit sowie medizinischer Versorgung
          auf einen Blick!
        </p>
        <br />
        <p>Was finde ich auf gesundesWND?</p>
      </div>
      <p class="text-justify">
        Du bist auf der Suche nach Sportstätten, Ärzten, persönlicher Beratung
        oder nach Vereinen im Gesundheitsbereich? Sicher findest du unter der
        Vielzahl an Anbietern aus den Bereichen Gesundheitsförderung &
        Prävention, medizinische Versorgung oder Pflege das passende Angebot.
      </p>
      <br />
      <p class="text-justify">
        Informiere dich schnell und einfach über die Angebote von
        Gesundheitsdienstleistern aus dem Sankt Wendeler Land. Über gesundesWND
        kannst du auch direkt mit den Anbietern in Kontakt treten.
      </p>
      <div class="button my-5">
        <v-btn
          variant="flat"
          color="primary"
          rounded="pill"
          size="large"
          @click="goToSearch()"
        >
          <span>ZUR ANBIETERSUCHE </span>
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
            <span
              class="is-dark-grey general-font-size"
              v-html="item.content.heading"
            ></span>
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
      heading: "Pflege",
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
