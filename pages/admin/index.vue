<template>
  <div v-if="useUser().isAdmin()">
    <div class="d-flex align-center">
      <div class="general-font-size is-dark-grey font-weight-bold">Dashboard</div>
      <div class="ml-3" v-if="!loading && updatedAt">
        <span> Letzte Aktualisierung: {{ updatedAt }}</span>
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
          <v-col
            md="3"
            v-for="sub_item in item?.sub_items"
            :class="!item?.divider ? 'mb-n14' : ''"
          >
            <AdminStatisticsBox :item="sub_item" :loading="loading" />
          </v-col>
        </v-row>
        <v-divider v-if="item?.divider" class="my-3 mr-15"></v-divider>
      </div>
    </div>
  </div>
  <div v-else>Du hast keine Berechtigung, diese Seite zu sehen.</div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { setItem, getItem } from '@/utils/indexedDB';

definePageMeta({
  layout: "admin",
});

const router = useRouter();
const loading = ref(false);
const updatedAt = ref('');
const facilities = ref([]);

const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const notUpToDate1 = new Date();
notUpToDate1.setDate(notUpToDate1.getDate() - 120);

const notUpToDate2 = new Date();
notUpToDate2.setDate(notUpToDate2.getDate() - 134);

const notUpToDate3 = new Date();
notUpToDate3.setDate(notUpToDate3.getDate() - 226);

const notUpToDate4 = new Date();
notUpToDate4.setDate(notUpToDate4.getDate() - 240);

type DashboardItem = {
  title: string;
  icon: string;
  id: number;
  divider?: boolean;
  sub_items: {
    title: string;
    content: any;
  }[];
};

const getItems = async () => {
  try {
    setNow();
    await saveUpdatedAt();

    const facilitiesFromDB = await getItem('facilities', 'all');
    if (facilitiesFromDB && facilities.value.length === 0) {
      loading.value = true;
      facilities.value = facilitiesFromDB;
      loading.value = false;
      return;
    }

    const updatedAtFromDB = await getItem('metadata', 'updatedAt');
    if (updatedAtFromDB) {
      updatedAt.value = updatedAtFromDB;
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

    await saveFacilities();
    loading.value = false;
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};

const setNow = () => {
  updatedAt.value = new Date().toLocaleString("de-DE");
};

const saveFacilities = async () => {
  try {
    await setItem('facilities', 'all', facilities.value);
  } catch (error) {
    console.error("Error saving facilities:", error);
  }
};

const saveUpdatedAt = async () => {
  try {
    await setItem('metadata', 'updatedAt', updatedAt.value);
  } catch (error) {
    console.error("Error saving updated at:", error);
  }
};

const deleteFacilitiesFromLocalStorage = async () => {
  await getItems();
};

const items = computed<DashboardItem[]>(() => [
  {
    title: "Einrichtungen",
    icon: "mdi-home",
    id: 1,
    divider: true,
    sub_items: [
      {
        title: "Gesamt",
        content: facilities.value.filter((facility: any) => facility.kind === "facility").length,
        type: "facility",
        query: "showAll",
      },
      {
        title: "Online",
        content: facilities.value.filter(
          (facility: any) => facility.is_active === true && facility.kind === "facility"
        ).length,
        type: "facility",
        query: "active_facilities",
      },
      {
        title: "Offline",
        content: facilities.value.filter(
          (facility: any) => facility.is_active === false && facility.kind === "facility"
        ).length,
        type: "facility",
        query: "inactive_facilities",
      },
      {
        title: "Neu registrierte Einrichtungen*",
        info: "*in den letzten 30 Tagen",
        content: facilities.value.filter(
          (facility: any) => facility.kind === "facility" && new Date(facility.created_at) >= thirtyDaysAgo
        ).length,
        type: "facility",
        query: "thirty_days_ago",
      },
    ],
  },
  {
    title: "Import",
    icon: "mdi-home-import-outline",
    divider: true,
    id: 2,
    sub_items: [
      {
        title: "Importierte Profile",
        content: facilities.value.filter(
          (facility: any) => facility?.user?.imported === true && facility.kind === "facility"
        ).length,
        type: "facility",
        query: "imported_profiles",
      },
      {
        title: "Inhaberschaften LK",
        content: facilities.value.filter(
          (facility: any) =>
            facility?.user?.imported === true &&
            facility?.owner_requested_maintenance &&
            facility.kind === "facility"
        ).length,
        type: "facility",
        query: "successful_profile_takeovers",
      },
      {
        title: "Inhaberschaften Nutzer",
        content: facilities.value.filter(
          (facility: any) =>
            facility?.user?.imported === true &&
            facility?.owner_requested_maintenance === false &&
            facility?.user?.onboarding_status === "completed"
            && facility.kind === "facility"
        ).length,
        type: "facility",
        query: "user_maintenance_requested",
      },
      {
        title: "Rückmeldung ausstehend",
        content: facilities.value.filter(
          (facility: any) =>
            facility?.user?.imported === true &&
            facility?.user?.notification_after_manual_import_sent &&
            facility?.user?.onboarding_token?.length &&
            facility.kind === "facility"
        ).length,
        type: "facility",
        query: "pending_profile_takeovers",
      },
      {
        title: "Nicht gesendete Emails",
        hasNoSpace: true,
        content: facilities.value.filter(
          (facility: any) =>
            facility?.user?.imported === true &&
            !facility?.user?.notification_after_manual_import_sent &&
            facility?.user?.onboarding_token?.length &&
            facility.kind === "facility"
        ).length,
        type: "facility",
        query: "mail_not_sent",
      },
    ],
  },
  {
    title: "Verifizierungsanfragen",
    icon: "mdi-check-decagram-outline",
    id: 3,
    divider: true,
    sub_items: [
      {
        title: "In Prüfung",
        content: facilities.value.filter(
          (facility: any) =>
            facility?.user?.is_active_on_health_scope === false &&
            facility?.user?.imported === false && facility.kind === "facility"
        ).length,
        type: "users",
        query: "pending",
      },
      {
        title: "In Prüfung (importiert)",
        content: facilities.value.filter(
          (facility: any) =>
            facility?.user?.is_active_on_health_scope === false &&
            facility?.user?.imported === true && facility?.user?.onboarding_status !== "completed" && facility.kind === "facility" && facility?.user?.care_facilities?.length !== 0
        ).length,
        type: "users",
        query: "import_pending",
      },
      {
        title: "in Prüfung (import abgeschlossen)",
        content: facilities.value.filter(
          (facility: any) =>
            facility?.user?.is_active_on_health_scope === false &&
            facility?.user?.imported === true &&
            facility?.user?.onboarding_status === "completed"
            && facility.kind === "facility"
        ).length,
        type: "users",
        query: "imported_pending",
      },
      {
        title: "Freigeschaltet",
        content:
          facilities.value.filter(
            (facility: any) =>
              facility?.user?.is_active_on_health_scope === true && facility.kind === "facility" && facility?.user?.care_facilities?.length > 0
          ).length,
        type: "users",
        query: "approved",
      },
    ],
  },
  {
    title: "Datenaktualität",
    icon: "mdi-playlist-check",
    divider: true,
    id: 4,
    sub_items: [
      {
        title: "Nicht aktuell",
        info: "+ 120 Tagen",
        content: facilities.value.filter(
          (facility: any) =>
           new Date(facility?.user?.last_care_facility_updated_at) < notUpToDate1
        ).length,
        query: "data_not_up_to_date_1",
        type: "users",
      },
      {
        title: "Nicht aktuell",
        info: "+ 134 Tagen",
        content: facilities.value.filter(
          (facility: any) =>
            new Date(facility?.user?.last_care_facility_updated_at) < notUpToDate2
        ).length,
        query: "data_not_up_to_date_2",
        type: "users",
      },
      {
        title: "Nicht aktuell",
        info: "+ 226 Tagen",
        content: facilities.value.filter(
          (facility: any) =>
           new Date(facility?.user?.last_care_facility_updated_at) < notUpToDate3
        ).length,
        query: "data_not_up_to_date_3",
        type: "users",
      },
      {
        title: "Nicht aktuell",
        info: "+ 240 Tagen",
        content: facilities.value.filter(
          (facility: any) =>
           new Date(facility?.user?.last_care_facility_updated_at) < notUpToDate4
        ).length,
        query: "data_not_up_to_date_4",
        type: "users",
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
        type: "event",
        query: "active_events",
      },
      {
        title: "Aktive Kurse",
        content: facilities.value.filter(
          (facility: any) => facility?.kind === "course" && facility.is_active === true
        ).length,
        type: "course",
        query: "active_courses",
      },
      {
        title: "Aktive Beiträge",
        content: facilities.value.filter(
          (facility: any) => facility?.kind === "news" && facility.is_active === true
        ).length,
        type: "news",
        query: "active_news",
      },
    ],
  },
  {
    title: "",
    icon: "",
    id: 6,
    divider: false,
    sub_items: [
      {
        title: "Veranstaltungen gesamt",
        content: facilities.value.filter((facility: any) => facility?.kind === "event")
          .length,
        type: "event",
        query: "showAll",
        hasNoSpace: true,
      },
      {
        title: "Kurse gesamt",
        content: facilities.value.filter((facility: any) => facility?.kind === "course")
          .length,
        type: "course",
        query: "showAll",
        hasNoSpace: true,
      },
      {
        title: "Beiträge gesamt",
        content: facilities.value.filter((facility: any) => facility?.kind === "news")
          .length,
        type: "news",
        query: "showAll",
        hasNoSpace: true,
      },
    ],
  },
]);

onMounted(async () => {
  if (!useUser().isAdmin()) {
    router.push({ path: '/' });
  } else {
    await getItems();
  }
});
</script>

<style scoped>
.ml-3 {
  margin-left: 1rem;
}
.ml-5 {
  margin-left: 3rem;
}
.mb-n14 {
  margin-bottom: -14px !important;
}
.mt-5 {
  margin-top: 3rem;
}
</style>