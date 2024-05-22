<template>
  <div v-if="useUser().isAdmin()">
    <div class="d-flex align-center">
      <div class="general-font-size is-dark-grey font-weight-bold">Dashboard</div>
      <div class="ml-3" v-if="!loading && updatedAt">
        <span> Aktualisiert am: {{ updatedAt }}</span>
      </div>
      <v-skeleton-loader
        v-if="loading"
        class="ml-3"
        :width="300"
        :height="50"
        type="text"
      ></v-skeleton-loader>
      <v-icon
        size="x-large"
        class="ml-3"
        color="primary"
        v-if="!loading"
        @click="deleteFacilitiesFromLocalStorage()"
        >mdi-reload</v-icon
      >
    </div>
    <div v-for="item in items" :key="item.id" class="mt-5">
      <div class="d-flex align-center">
        <v-icon size="x-large" color="primary">{{ item.icon }}</v-icon>
        <div class="text-h4 ml-3 is-dark-grey">{{ item.title }}</div>
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
  <div v-else> Du hast keine Berechtigung, diese Seite zu sehen.</div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "admin",
});

const router = useRouter();

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

const getFacilitiesFromLocalStorage = () => {
  return localStorage.getItem("facilities");
};

const getUpdatedAtFromLocalStorage = () => {
  return localStorage.getItem("updatedAt");
};

const updatedAt = ref("");

const facilitiesFromLocalStorage = localStorage.getItem("facilities");
const updatedAtFromLocalStorage = localStorage.getItem("updatedAt");

const getItems = async () => {
  setNow();
  saveUpdatedAt();
  if (facilitiesFromLocalStorage && facilities.value.length === 0) {
    loading.value = true;
    facilities.value = JSON.parse(facilitiesFromLocalStorage);
    loading.value = false;
    return;
  }
  if (updatedAtFromLocalStorage) {
    updatedAt.value = updatedAtFromLocalStorage;
  }

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

  saveFacilities();

  loading.value = false;
};

const setNow = () => {
  updatedAt.value = new Date().toLocaleString("de-DE");
};

const saveFacilities = () => {
  localStorage.setItem("facilities", JSON.stringify(facilities.value));
};

const saveUpdatedAt = () => {
  localStorage.setItem("updatedAt", updatedAt.value);
};

const deleteFacilitiesFromLocalStorage = () => {
  getItems();
};

const items = computed<DashboardItem[]>(() => [
  {
    title: "Einrichtungen",
    icon: "mdi-home",
    id: 1,
    sub_items: [
      {
        title: "Angemeldet",
        content: facilities.value.filter((facility: any) => facility.kind === "facility")
          .length,
        type: "facility",
        query: "showAll",
      },
      {
        title: "Aktiv",
        content: facilities.value.filter(
          (facility: any) => facility.is_active === true && facility.kind === "facility"
        ).length,
        type: "facility",
        query: "active_facilities",
      },
      {
        title: "Inaktiv",
        content: facilities.value.filter(
          (facility: any) => facility.is_active === false && facility.kind === "facility"
        ).length,
        type: "facility",
        query: "inactive_facilities",
      },
      {
        title: "Übertragene Inhaberschaft",
        content: facilities.value.filter(
          (facility: any) => facility.owner_requested_maintenance === true && facility.kind === "facility"
        ).length,
        type: "facility",
        query: "managed_by_lk",
      },
      {
        title: "Eigen erstellte Profile",
        content: facilities.value.filter(
          (facility: any) => facility?.user?.role === 'care_facility_admin' && facility.kind === "facility"
        ).length,
        type: "facility",
        query: "created_by_lk",
      },
    ],
  },
  {
    title: "Import",
    icon: "mdi-home-import-outline",
    id: 2,
    sub_items: [
      {
        title: "Importierte Profile",
        content: facilities.value.filter(
          (facility: any) => facility?.user?.imported === true
        ).length,
        type: "facility",
        query: "imported_profiles",
      },
      {
        title: "Erfolgte Profilübernahmen",
        content: facilities.value.filter(
          (facility: any) =>
            facility?.user?.imported === true && !facility?.user?.onboarding_token?.length
        ).length,
        type: "facility",
        query: "successful_profile_takeovers",
      },
      {
        title: "Ausstehende Profilübernahmen",
        content: facilities.value.filter(
          (facility: any) =>
            facility?.user?.imported === true && facility?.user?.onboarding_token?.length
        ).length,
        type: "facility",
        query: "pending_profile_takeovers",
      },
    ],
  },
  {
    title: "Verifizierungsanfragen",
    icon: "mdi-check-decagram-outline",
    id: 3,
    sub_items: [
      {
        title: "In Prüfung",
        content: facilities.value.filter(
          (facility: any) =>
            facility?.user?.is_active_on_health_scope === false
        ).length,
        type: "users",
        query: "pending",
      },
      {
        title: "In Prüfung (importiert)",
        content: facilities.value.filter(
          (facility: any) =>
            facility?.user?.is_active_on_health_scope === false && facility?.user?.imported === true
        ).length,
        type: "users",
        query: "import_pending",
      },
      {
        title: "Freigeschaltet",
        content: facilities.value.filter(
          (facility: any) =>
            facility?.user?.is_active_on_health_scope === true
        ).length,
        type: "users",
        query: "approved",
      },
    ],
  },
  {
    title: "Datenaktualität",
    icon: "mdi-playlist-check",
    id: 4,
    sub_items: [
      {
        title: "Aktuell",
        content: 0,
        query: "data_up_to_date",
        type: "facility",
      },
    ],
  },
  {
    title: "Aktivität",
    icon: "mdi-progress-check",
    id: 5,
    sub_items: [
      {
        title: "Aktive Veranstaltungen",
        content: facilities.value.filter(
          (facility: any) => facility?.kind === "event" && facility.is_active === true
        ).length,
        /*         type: "event",
        query: "active_events", */
      },
      {
        title: "Aktive Kurse",
        content: facilities.value.filter(
          (facility: any) => facility?.kind === "course" && facility.is_active === true
        ).length,
        /*         type: "course",
        query: "active_courses", */
      },
      {
        title: "Aktive Beiträge",
        content: facilities.value.filter(
          (facility: any) => facility?.kind === "news" && facility.is_active === true
        ).length,
        /*         type: "news",
        query: "active_articles", */
      },
    ],
  },
]);

onMounted(async () => {
  if (!useUser().isAdmin()) {
    router.push({ path: "/" });
  } else {
    await getItems();
    getFacilitiesFromLocalStorage();
    getUpdatedAtFromLocalStorage();
    updatedAt.value = updatedAtFromLocalStorage;
  }
});
</script>
<style lang="sass">
.loader
  margin-right: 50%
</style>
