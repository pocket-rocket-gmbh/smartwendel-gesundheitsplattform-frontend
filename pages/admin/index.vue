<template>
  <div>
    <span class="general-font-size is-dark-grey font-weight-bold"
      >Dashboard</span
    >
    <div v-for="item in items" :key="item.id">
      <div class="d-flex align-center">
        <v-icon size="x-large" color="primary">{{ item.icon }}</v-icon>
        <span class="text-h4 ml-3 is-dark-grey">{{ item.title }}</span>
      </div>

      <div>
        <v-row>
          <v-col md="3" v-for="sub_item in item?.sub_items">
            <AdminStatisticsBox :item="sub_item" :loading="loading" />
          </v-col>
        </v-row>
        <v-divider class="my-3 mr-15"></v-divider>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "admin",
});

const loading = ref(false);

type DashboardItem = {
  title: string;
  icon: string;
  id: number;
  sub_items: {
    title: string;
    content: any;
  }[];
};

const facilities = ref([]);

const getCoursesArticles = async () => {
  loading.value = true;
  const options = {
    page: 1,
    per_page: 10000,
  };

  const api = useCollectionApi();
  api.setBaseApi(usePrivateApi());
  api.setEndpoint(`care_facilities`);

  await api.retrieveCollection(options as any);
  facilities.value = api.items.value as any;
  loading.value = false;
};

const items = computed<DashboardItem[]>(() => [
  {
    title: "Einrichtungen",
    icon: "mdi-home",
    id: 1,
    sub_items: [
      {
        title: "Angemeldet",
        content: facilities.value?.length,
      },
      {
        title: "Aktiv",
        content: facilities.value.filter(
          (facility: any) => facility.is_active === true
        ).length,
      },
      {
        title: "Inaktiv",
        content: facilities.value.filter(
          (facility: any) => facility.is_active === false
        ).length,
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
        content: facilities.value.filter(
          (facility: any) => facility?.user?.imported === true
        ).length,
      },
      {
        title: "erfolgte Profilübernahmen",
        content: facilities.value.filter(
          (facility: any) =>
            facility?.user?.imported === true &&
            !facility?.user?.onboarding_token?.length
        ).length,
      },
      {
        title: "ausstehende Profilübernahmen",
        content: facilities.value.filter(
          (facility: any) =>
            facility?.user?.imported === true &&
            facility?.user?.onboarding_token?.length
        ).length,
      },
    ],
  },
  {
    title: "Verifizierungsanfragen",
    icon: "mdi-check-decagram-outline",
    id: 3,
    sub_items: [
      {
        title: " gesendet",
        content: facilities.value.filter(
          (facility: any) =>
            facility?.user?.imported === true &&
            facility?.user?.notification_after_manual_import_sent_at?.length
        ).length,
      },
    ],
  },
  {
    title: "Datenaktualität",
    icon: "mdi-playlist-check",
    id: 4,
    sub_items: [{ title: "Aktuell", content: 0 }],
  },
  {
    title: "Aktivität",
    icon: "mdi-progress-check",
    id: 5,
    sub_items: [
      {
        title: "Aktive Veranstaltungen",
        content: facilities.value.filter(
          (facility: any) =>
            facility?.kind === "event" && facility.is_active === true
        ).length,
      },
      {
        title: "Aktive Kurse",
        content: facilities.value.filter(
          (facility: any) =>
            facility?.kind === "course" && facility.is_active === true
        ).length,
      },
      {
        title: "Aktive Beiträge",
        content: facilities.value.filter(
          (facility: any) =>
            facility?.kind === "news" && facility.is_active === true
        ).length,
      },
    ],
  },
]);

onMounted(async () => {
  await getCoursesArticles();
});
</script>
