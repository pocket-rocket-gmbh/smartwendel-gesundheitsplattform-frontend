<template>

  
  <div class="categories-wrapper">
    <div class="text intro-wraper is-primary">
      <div>
        <h2 class="is-secondary">Finden Sie unter zahlreichen Pflegeanbietern Ihr passendes Angebot!</h2>
      </div>
      <div>
        <p class="is-paragraph is-secondary">
          At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
          gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
          dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
        </p>
      </div>

      <div class="button my-5">
        <v-btn
          variant="flat"
          class="is-button-text"
          color="primary"
          rounded="pill"
          size="x-large"
          @click="goToSearch()"
        >
          <span>Alle Anbieter </span>
        </v-btn>
      </div>
    </div>
    <div class="icons mb-2">
      <div v-for="(item, index) in items" :key="index" class="icon mt-3">
        <div @click="goToLink(item.content.link)" class="is-clickable items-content">
          <img class="image" :src="item.content.icon" />
          <h4
            class="is-secondary ml-4"
            v-html="item.content.heading"
          ></h4>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import icon1 from "@/assets/images/categories/icon_assisted_living.svg";
import icon2 from "@/assets/images/categories/icon_day_care.svg";
import icon3 from "@/assets/images/categories/icon_night_care.svg";
import icon4 from "@/assets/images/categories/icon_short-term_care.svg";


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
      heading: "Stationäre Pflege",
      icon: icon1,
      link:
        '/public/search/facilities?filter={"currentSearchTerm":"","currentZip":null,"currentTags":["7dcbda4d-a37f-4dd5-8a8e-e59d42be8dac","2af6c174-ded9-4fd2-afae-a93ff36927c1","8f3627be-b232-41cc-8bff-8713486768dc","22a61bcf-faf4-4834-b149-3adddf016a1d","3f6beacf-1a13-48af-b640-7aa49c72f755"],"filterSort":"A-Z","currentKinds":["facility"]}',
    },
  },
  {
    content: {
      heading: "Ambulante Pflege",
      icon: icon2,
      link:
        '/public/search/facilities?filter={"currentSearchTerm":"","currentZip":null,"currentTags":["0c4de7f3-aca1-4059-9057-e6245ede8ed9","c8d886cf-8050-4313-9b14-e47483a947b4","7c94cfde-d4ba-4f0d-800c-59ae30386205","8c7695ce-d7b5-4c8c-a999-48964afec8d7","891b4c1d-dec0-4546-9c14-8b0deda0c9f1","cc33dbea-a094-4f0d-9cc3-ec197db6f250","c3c7be28-8116-4737-829e-61c06b5f8af4","4cd91627-3ea3-4956-87b8-c0ad9e0ef898","29294e3e-7429-4506-9327-986ad7aa34f4","a8b27c4e-0c2a-44f6-a13b-f41892636449","012ce7b1-a6b7-4f35-a689-15fbe9959178","2bb5b0ce-5bc7-4e38-a9ee-68e8394661fe","a49a04d1-cba0-477f-a7a4-761b641128c7","e5d73dc1-919d-486f-b430-64df4bd4b031","3daedbca-2c4e-448c-af9a-883a2bb94333","4c17604f-33bf-4c20-bc85-f2b55e3337b7"],"filterSort":"A-Z","currentKinds":["facility"]}',
    },
  },
  {
    content: {
      heading: "Betreutes Wohnen",
      icon: icon3,
      link:
        '/public/search/facilities?filter={"currentSearchTerm":"","currentZip":null,"currentTags":["2d957fd0-c79f-411b-a826-037f99551d39"],"filterSort":"A-Z","currentKinds":["facility"]}',
    },
  },
  {
    content: {
      heading: "Tagespflege",
      icon: icon4,
      link:
        '/public/search/facilities?filter={"currentSearchTerm":"","currentZip":null,"currentTags":["e0face48-e5b3-44e4-ba4a-c8a11693fc9d","75ad08a3-6060-4ef7-9a18-53ec073d7c6e","ca4b584d-01f1-4a2c-83b7-ed1eadc354df"],"filterSort":"A-Z","currentKinds":["facility"]}',
    },
  },
  {
    content: {
      heading: "Kurzzeitpflege",
      icon: icon4,
      link:
        '/public/search/facilities?filter={"currentSearchTerm":"","currentZip":null,"currentTags":["b6ac9f61-0d2d-4a24-81e0-d42520aeab78","f2bfffad-665c-4b43-a9bc-eba787b710a9","c49252a5-2440-4c4f-87d7-843db65aee75","55423b7d-1bbf-4c03-8fff-8002df77409c","6903784c-ef1c-4b06-a253-db03c19cbd64","04fc1460-a1e0-47de-a515-dab88d5c1748","6842b72c-f678-4d96-9f48-ba6a21dcda95","ed4b6e4f-7c01-4a58-a09a-6dc3a154a42a"],"filterSort":"A-Z","currentKinds":["facility"]}',
    },
  },
  {
    content: {
      heading: "Nachtpflege",
      icon: icon4,
      link:
        '/public/search/facilities?filter={"currentSearchTerm":"","currentZip":null,"currentTags":["8a534452-bdc1-4f9e-b8da-5597cce5d50b","23d0d5cf-71b2-49fd-a000-1727fc0fe7cf"],"filterSort":"A-Z","currentKinds":["facility"]}',
    },
  },
];
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main";

.categories-wrapper {
  margin: 6.25rem ;
  display: flex;
  gap: 5rem;

  @include md {
    margin: 1rem;
    gap: 1rem;
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

  .icons {
    flex: 3;
    gap: 4.40rem 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: baseline;
    @include md {
      justify-content: center;
    }
  }

  .icon {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: calc(50% - 0.5rem);
    box-sizing: border-box;
    @include md {
      justify-content: center;
    }

    .image {
      border-radius: 50%;
      background-color: $lighter-grey;
      transition: transform 0.5s ease-in-out;
      width: 120px;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);

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

.intro-wraper {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  @include md {
    margin: 1rem;
  }
}
.items-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  @include md {
    flex-direction: column;
  }
}
.title-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}
</style>
