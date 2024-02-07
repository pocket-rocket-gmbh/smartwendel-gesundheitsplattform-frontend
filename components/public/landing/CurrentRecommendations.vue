<template>
  <div class="wrapper d-flex flex-column justify-center">
    <div
      class="d-flex flex-column align-center justify-center text-white"
    >
      <h2 class="my-5">Pflege und num?</h2>
      <h4 class="mb-5">Wir informieren Sie rund um das Thema Pflege</h4>
    </div>
    <v-container fluid>
      <v-row class="ga-16">
        <v-col v-for="card in items" :key="card.content.heading" >
          <v-card>
            <v-img
              :src="card.content.image"
              class="align-end card-body"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="300px"
              cover
            >
              <div
                class="pa-3 pr-15 card-heading is-label-medium is-white" 
                v-text="card.content.heading"
              ></div>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script setup lang="ts">
import image1 from "@/assets/images/current-recommendations/img-recomendation-1.png";

const router = useRouter();

const goToLink = (item: string) => {
  router.push({ path: item });
};

const items = [
  {
    content: {
      heading: "Pflege zuhause organisieren",
      image: image1,
      link:
        "/public/categories/d586e289-be57-4654-ac1f-3d64bf50c508?sub_category_id=9b3ed77f-d337-4064-a935-a9e41d6d99a5",
    },
  },
  {
    content: {
      heading: "Pflege in einer Einrichtung",
      image: image1,
      link:
        "/public/categories/d586e289-be57-4654-ac1f-3d64bf50c508?sub_category_id=c88b0ce6-e51d-435f-8689-ed4bb193fab1",
    },
  },
  {
    content: {
      heading: "Wohnangebote für Senioren",
      image: image1,
      link:
        "/public/categories/d586e289-be57-4654-ac1f-3d64bf50c508?sub_category_id=0c2cf2d5-2834-45d6-a912-957a1f8e5153",
    },
  },
  {
    content: {
      heading: "Persönliche Beratung",
      image: image1,
      link: "https://www.sankt-wendeler-land.de/aktiv",
    },
  },
  {
    content: {
      heading: "Informationen zu Anträgen",
      image: image1,
      link: "https://www.sankt-wendeler-land.de/aktiv",
    },
  },
];
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

.card-heading {
  background: $primary-color;
  width: 70%;
  margin: 1rem 0;
  height: 100px;
  display: flex;
  align-items: center;
  white-space: pre-wrap;
  &:hover {
    transform: scale(1.1);
    transition: transform 0.5s ease-in-out;
    cursor: pointer;
  }
}
.wrapper {
  padding: 6.25rem;
  background: rgb(34, 44, 52);
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
