<template>
  <div class="categories-wrapper">
    <div class="text general-font-size">
      <div class="is-primary text-h4 font-weight-medium mb-5">
        <p>
          Anbieter aus Prävention und Gesundheit sowie medizinischer Versorgung auf einen
          Blick!
        </p>
        <br />
        <p>Was finde ich auf gesundesWND?</p>
      </div>
      <div class="text-description">
        <p class="text-justify">
          Du bist auf der Suche nach Sportstätten, Ärzten, persönlicher Beratung oder nach
          Vereinen im Gesundheitsbereich? Sicher findest du unter der Vielzahl an
          Anbietern aus den Bereichen Gesundheitsförderung & Prävention, medizinische
          Versorgung oder Pflege das passende Angebot.
        </p>
        <br />
        <p class="text-justify">
          Informiere dich schnell und einfach über die Angebote von
          Gesundheitsdienstleistern aus dem Sankt Wendeler Land. Über gesundesWND kannst
          du auch direkt mit den Anbietern in Kontakt treten.
        </p>
      </div>

      <div class="button my-5">
        <v-btn
          variant="flat"
          class="general-font-size"
          color="primary"
          rounded="pill"
          size="large"
          @click="goToSearch()"
        >
          <span>ZUR ANBIETERSUCHE </span>
        </v-btn>
      </div>
    </div>
    <div class="icons mb-2">
      <div v-for="(item, index) in items" :key="index" class="icon">
        <div @click="goToLink(item.content.link)" class="d-flex">
          <div class="is-clickable items-content">
            <img class="image mt-3" :src="item.content.icon" />
            <div
              class="is-dark-grey general-font-size font-weight-medium title-content"
              v-html="item.content.heading"
            ></div>
          </div>
          <div class="d-flex align-center is-clickable">
            <div class="font-weight-bold"></div>
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
  router.push({ path: item });
};

const items = [
  {
    content: {
      heading: "Sportstätten",
      icon: icon1,
      link:
        '/public/search/facilities',
    },
  },
  {
    content: {
      heading: "Ärztliche Versorgung",
      icon: icon2,
      link:
        '/public/search/facilities',
    },
  },
  {
    content: {
      heading: "Vereine",
      icon: icon3,
      link:
        '/public/search/facilities',
    },
  },
  {
    content: {
      heading: "Pflege",
      icon: icon4,
      link:
        '/public/search/facilities',
    },
  },
  {
    content: {
      heading: "Beratung",
      icon: icon5,
      link:
        '/public/search/facilities',
    },
  },
  {
    content: {
      heading: "Kliniken",
      icon: icon6,
      link:
        '/public/search/facilities',
    },
  },
];
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main";

.categories-wrapper {
  margin: 5rem;
  display: flex;
  gap: 1rem;

  @include md {
    margin: 1rem;
    flex-direction: column;
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

  .text-description {
    line-height: 27px;
  }
  .icons {
    flex: 4;
    gap: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: baseline;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    flex: calc(50% - 0.5rem);
    box-sizing: border-box;

    .image {
      border-radius: 50%;
      border: 1px solid $primary-color;
      background-color: white;
      transition: transform 0.5s ease-in-out;
      width: 120px;

      &:hover {
        transform: scale(1.1);
        cursor: pointer;
      }
    }
  }

  @media (max-width: 768px) {
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: calc(50% - 1.5rem);
      box-sizing: border-box;
    }
  }
}

.items-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.title-content {
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
}
</style>
