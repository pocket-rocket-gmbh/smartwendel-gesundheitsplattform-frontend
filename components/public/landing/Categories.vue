<template>
  <div class="categories-wrapper">
    <v-row>
      <v-col>
        <div class="text">
          <h2 class="is-primary text-h4 font-weight-bold text-uppercase mb-5">
            Pflege, Ärtze, <br />
            Krankenhäuser und co.
          </h2>
          <p class="text-justify">
            Über diese Suchfunktion findest du sicher schnell die passende Einrichtung und
            den richtigen Ansprechpartner.
          </p>
          <p class="text-justify mt-5">
            Ob in Bereich Pflege, Gesundheit oder Prävention. Sicher findest du unter mehr
            als 1.000 gelisteten Anbieten die Leistung, nach der du suchst. Informierest
            du über die Angebote oder nimmst direkt Kontakt auf und vereinbarst du
            persönliches Beratungsgespräch.
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
      </v-col>
      <v-col class="d-flex justify-center align-center">
        <div class="icons">
          <div v-for="(item, index) in items" :key="index" class="d-flex justify-start">
            <div class="is-clickable d-flex icon py-3" @click="goToLink(item.link)">
              <img class="image" :src="item.content.icon" />
              <div class="d-flex align-center">
                <div class="font-weight-bold d-flex align-center is-clickable">
                  <span class="is-dark-grey" v-html="item.content.heading"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts" setup>
import icon1 from "@/assets/images/categories/icon_doctor.svg";
import icon2 from "@/assets/images/categories/icon_fitness.svg";
import icon3 from "@/assets/images/categories/icon_clubs.svg";
import icon4 from "@/assets/images/categories/icon_pharmacies.svg";
import icon5 from "@/assets/images/categories/icon_caring.svg";
import icon6 from "@/assets/images/categories/icon_house.svg";

const router = useRouter();

const goToSearch = () => {
  router.push({ path: "/public/search/facilities" });
};

const goToLink = (item:string) => {
  router.push({ path: `/public/search/facilities${item}` });
};

const items = [
  {
    content: {
      heading: "Ärztinnen & Ärzte",
      icon: icon1,
      link: ""
    },
  },
  {
    content: {
      heading: "Fitnesseinrichtungen",
      icon: icon2,
      link: ""
    },
  },
  {
    content: {
      heading: "Vereine",
      icon: icon3,
      link: ""
    },
  },
  {
    content: {
      heading: "Apotheken",
      icon: icon4,
      link: ""
    },
  },
  {
    content: {
      heading: "Pflegeeinrichtungen",
      icon: icon5,
      link: ""
    },
  },
  {
    content: {
      heading: "Wohnheime",
      icon: icon6,
      link: ""
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

  .icons {
    flex: 4;
    display: grid;
    gap: 0.5rem;
    grid-template-columns: 1fr 1fr 1fr;

    @include xl {
      grid-template-columns: 1fr 1fr;
    }

    .icon {
      display: flex;
      align-items: center;
      font-size: 22px;
      gap: 0.5rem;

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

      @include md {
        flex-direction: column;
        font-size: 18px;
      }
    }
  }
}
</style>
