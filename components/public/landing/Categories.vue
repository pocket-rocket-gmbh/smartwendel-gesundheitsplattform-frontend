<template>
  <div class="categories-wrapper">
    <div class="text general-font-size">
      <div class="is-primary text-h4 font-weight-medium mb-5">
        <p>Anbieter aus Prävention und Gesundheit sowie medizinischer Versorgung auf einen Blick!</p>
        <br />
        <p>Was finde ich auf gesundesWND?</p>
      </div>
      <div class="text-description">
        <p class="text-justify">
          Du bist auf der Suche nach Sportstätten, Ärzten, persönlicher Beratung oder nach Vereinen im Gesundheitsbereich? Sicher findest du unter der Vielzahl
          an Anbietern aus den Bereichen Gesundheitsförderung & Prävention, medizinische Versorgung oder Pflege das passende Angebot.
        </p>
        <br />
        <p class="text-justify">
          Informiere dich schnell und einfach über die Angebote von Gesundheitsdienstleistern aus dem Sankt Wendeler Land. Über gesundesWND kannst du auch
          direkt mit den Anbietern in Kontakt treten.
        </p>
      </div>

      <div class="button my-5">
        <a
          href="#"
          @click.prevent="goToSearch()"
          style="display: block; width: auto"
        >
          <v-btn
            variant="flat"
            class="general-font-size"
            color="primary"
            rounded="pill"
            size="large"
          >
            <span>ZUR ANBIETERSUCHE</span>
          </v-btn>
        </a>
      </div>
    </div>
    <div class="icons mb-2">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="icon"
      >
        <a
          class="is-white text-decoration-underline"
          :href="item.content.link"
        >
          <div class="d-flex">
            <div class="is-clickable items-content">
              <img
                class="image mt-3"
                :src="item.content.icon"
              />
              <div
                class="is-dark-grey general-font-size font-weight-medium title-content"
                v-html="item.content.heading"
              ></div>
            </div>
            <div class="d-flex align-center is-clickable">
              <div class="font-weight-bold"></div>
            </div></div
        ></a>
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
      link: '/public/search/facilities?filter={"currentSearchTerm":"","currentZips":[],"currentFacilityTags":["7dcbda4d-a37f-4dd5-8a8e-e59d42be8dac","2af6c174-ded9-4fd2-afae-a93ff36927c1","3f6beacf-1a13-48af-b640-7aa49c72f755"],"currentServiceTags":[],"filterSort":"A-Z","currentKinds":["facility"]}',
    },
  },
  {
    content: {
      heading: "Ärztliche Versorgung",
      icon: icon2,
      link: '/public/search/facilities?filter={"currentSearchTerm":"","currentZips":[],"currentFacilityTags":["e5d73dc1-919d-486f-b430-64df4bd4b031","a8b27c4e-0c2a-44f6-a13b-f41892636449","4cd91627-3ea3-4956-87b8-c0ad9e0ef898","20948809-40fd-4857-9101-c84874e1537e"],"currentServiceTags":[],"filterSort":"A-Z","currentKinds":["facility"]}',
    },
  },
  {
    content: {
      heading: "Vereine",
      icon: icon3,
      link: '/public/search/facilities?filter={"currentSearchTerm":"","currentZips":[],"currentFacilityTags":["2d957fd0-c79f-411b-a826-037f99551d39"],"currentServiceTags":[],"filterSort":"A-Z","currentKinds":["facility"]}',
    },
  },
  {
    content: {
      heading: "Pflege",
      icon: icon4,
      link: '/public/search/facilities?filter={"currentSearchTerm":"","currentZips":[],"currentFacilityTags":["e0face48-e5b3-44e4-ba4a-c8a11693fc9d","75ad08a3-6060-4ef7-9a18-53ec073d7c6e"],"currentServiceTags":[],"filterSort":"A-Z","currentKinds":["facility"]}',
    },
  },
  {
    content: {
      heading: "Beratung",
      icon: icon5,
      link: '/public/search/facilities?filter={"currentSearchTerm":"","currentZips":[],"currentFacilityTags":["b6ac9f61-0d2d-4a24-81e0-d42520aeab78","f2bfffad-665c-4b43-a9bc-eba787b710a9","55423b7d-1bbf-4c03-8fff-8002df77409c","6903784c-ef1c-4b06-a253-db03c19cbd64","04fc1460-a1e0-47de-a515-dab88d5c1748","6842b72c-f678-4d96-9f48-ba6a21dcda95","ed4b6e4f-7c01-4a58-a09a-6dc3a154a42a"],"currentServiceTags":[],"filterSort":"A-Z","currentKinds":["facility"]}',
    },
  },
  {
    content: {
      heading: "Kliniken",
      icon: icon6,
      link: '/public/search/facilities?filter={"currentSearchTerm":"","currentZips":[],"currentFacilityTags":["8a534452-bdc1-4f9e-b8da-5597cce5d50b","23d0d5cf-71b2-49fd-a000-1727fc0fe7cf","38ab9a5d-9e9b-4bd2-b287-4a73576c1c98"],"currentServiceTags":[],"filterSort":"A-Z","currentKinds":["facility"]}',
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

a {
  text-decoration: none !important;
}
</style>
