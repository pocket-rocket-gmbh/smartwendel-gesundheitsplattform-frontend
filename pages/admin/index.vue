<template>
  <div>
    <span class="general-font-size is-dark-grey font-weight-bold"
      >Dashboard</span
    >
<!--     <div v-for="item in items" :key="item.id">
      <div class="d-flex align-center">
        <v-icon size="x-large" color="primary">{{ item.icon }}</v-icon>
        <span class="text-h4 is-dark-grey">{{ item.title }}</span>
      </div>
      <div class="d-flex align-center mt-5">
        <div v-for="sub_item in item?.sub_items">
          <AdminStatisticsBox :item="sub_item" />
        </div>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "admin",
});

const items = ref([
  {
    title: "Einrichtungen",
    icon: "mdi-home",
    id: 1,
    sub_items: [
      {
        title: "Angemeldet",
        props: 'registered'
      },
      {
        title: "Aktiv",
        props: 'active'
      },
      {
        title: "Inaktiv",
        props: 'inactive'
      },
    ],
  },
  {
    title: "Import",
    icon: "mdi-home-import-outline",
    id: 2,
    sub_items: [
      {
        title: "importierte Profile",
        props: 'imported'
      },
      {
        title: "erfolgte Profilübernahmen",
        props: 'successful-imported'
      },
      {
        title: "ausstehende Profilübernahmen",
        props: 'pending-imported'
      },
    ],
  },
  {
    title: "Verifizierungsanfragen",
    icon: "mdi-check-decagram-outline",
    id: 3,
    sub_items: [
      {props: 'pending-verification'},
    ]
  },
  {
    title: "Datenaktualität",
    icon: "mdi-playlist-check",
    id: 4,
    sub_items: [
      {props: 'data-accuracy'},
    ]
  },
  {
    title: "Aktivität",
    icon: "mdi-progress-check",
    id: 5,
    sub_items: [
      {
        title: "Aktive Veranstaltungen",
        props: 'active-events'
      },
      {
        title: "Aktive Kurse",
        props: 'active-courses'
      },
      {
        title: "Aktive Beiträge",
        props: 'active-articles'
      },
    ],
  },
]);
</script>
