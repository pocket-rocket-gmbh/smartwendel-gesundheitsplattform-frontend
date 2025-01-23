<template>
  <div v-if="useUser().isAdmin()">
    <div class="d-flex align-center">
      <div class="general-font-size is-dark-grey font-weight-bold">Dashboard</div>
      <div
        class="ml-3"
        v-if="!loading && updatedAt"
      >
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
    <div v-if="!loading && loadingTime > 0">
      <i> Ladezeit: {{ loadingTime }} ms</i>
    </div>
    <div
      v-for="item in items"
      :key="item.id"
      class="mt-5"
    >
      <div class="d-flex align-center">
        <v-icon
          size="x-large"
          color="primary"
          >{{ item.icon }}</v-icon
        >
        <div class="text-h4 ml-3 is-dark-grey">{{ item.title }}</div>
      </div>
      <div>
        <v-row>
          <v-col
            md="3"
            v-for="sub_item in item?.sub_items"
            :class="!item?.divider ? 'mb-n14' : ''"
          >
            <AdminStatisticsBox
              :item="sub_item"
              :loading="loading"
            />
          </v-col>
        </v-row>
        <v-divider
          v-if="item?.divider"
          class="my-3 mr-15"
        ></v-divider>
      </div>
    </div>
  </div>

  <div v-else>Du hast keine Berechtigung, diese Seite zu sehen.</div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { setItem, getItem } from "@/utils/indexedDB";
import { openDB } from "idb";

definePageMeta({
  layout: "admin",
});

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

const router = useRouter();
const loading = ref(false);
const statistics = ref<any>(null);
const updatedAt = ref("");
const STATISTICS_KEY = "statistics";
const UPDATED_AT_KEY = "statisticsUpdatedAt";
const STORE_NAME = "facilities";
const loadingTime = ref(0);

const deleteFacilitiesFromLocalStorage = async () => {
  try {
    if (!loading.value) {
      const db = await openDB("facilitiesDb", 1);
      await db.clear(STORE_NAME);
      await getStatistics();
    }
  } catch (error) {
    console.error("Error clearing facilities data from IndexedDB:", error);
  }
};

const getStatistics = async () => {
  try {
    loading.value = true;
    const startTime = performance.now();
    const cachedStatistics = await getItem(STORE_NAME, STATISTICS_KEY);
    const cachedUpdatedAt = await getItem(STORE_NAME, UPDATED_AT_KEY);

    if (cachedStatistics && cachedUpdatedAt) {
      statistics.value = cachedStatistics;
      updatedAt.value = cachedUpdatedAt;
      const endTime = performance.now();
      loadingTime.value = Math.round(endTime - startTime);
      loading.value = false;
      return;
    }

    const api = useCollectionApi();
    api.setBaseApi(usePrivateApi());
    api.setEndpoint(`statistics`);

    const response = await api.retrieveCollection();
    statistics.value = response.data;

    const now = new Date().toLocaleString();
    updatedAt.value = now;
    await setItem(STORE_NAME, STATISTICS_KEY, response.data);
    await setItem(STORE_NAME, UPDATED_AT_KEY, now);
    const endTime = performance.now(); // End time for API call
    loadingTime.value = Math.round(endTime - startTime);
    loading.value = false;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    loading.value = false;
  }
};

const items = computed<DashboardItem[]>(() => {
  if (!statistics.value) return [];

  return [
    {
      title: "Einrichtungen",
      icon: "mdi-home",
      id: 1,
      divider: true,
      sub_items: [
        { title: "Gesamt", content: statistics.value.care_facility_count, type: "facility", query: "showAll" },
        { title: "Online", content: statistics.value.care_facility_active_count, type: "facility", query: "active_facilities" },
        { title: "Offline", content: statistics.value.care_facility_inactive_count, type: "facility", query: "inactive_facilities" },
        {
          title: "Neu registrierte *",
          content: statistics.value.care_facility_created_last_thirty_days_count,
          type: "facility",
          query: "thirty_days_ago",
          info: "*in den letzten 30 Tage",
        },
      ],
    },
    {
      title: "Import",
      icon: "mdi-home-import-outline",
      id: 2,
      divider: true,
      sub_items: [
        { title: "Importierte Profile", content: statistics.value.imported_profiles_count, type: "facility", query: "imported_profiles" },
        { title: "Inhaberschaften LK", content: statistics.value.ownership_on_host_count, type: "facility", query: "successful_profile_takeovers" },
        { title: "Inhaberschaften Nutzer", content: statistics.value.ownership_on_user_count, type: "facility", query: "user_maintenance_requested" },
        { title: "Rückmeldung ausstehend", content: statistics.value.feedback_pending_count, type: "facility", query: "pending_profile_takeovers" },
        {
          title: "Nicht gesendete Emails",
          content: statistics.value.feedback_pending_emails_count,
          type: "facility",
          query: "mail_not_sent",
          hasNoSpace: true,
        },
      ],
    },
    {
      title: "Verifizierungsanfragen",
      icon: "mdi-check-decagram-outline",
      id: 3,
      divider: true,
      sub_items: [
        { title: "In Prüfung", content: statistics.value.verification_requests_count, type: "users", query: "pending" },
        { title: "In Prüfung (importiert)", content: statistics.value.is_being_checked_on_imported_count, type: "users", query: "import_pending" },
        {
          title: "In Prüfung (import abgeschlossen)",
          content: statistics.value.is_being_checked_on_imported_completed_count,
          type: "users",
          query: "imported_pending",
        },
        { title: "Freigeschaltet", content: statistics.value.user_is_active_on_health_scope_count, type: "users", query: "approved" },
      ],
    },
    {
      title: "Datenaktualität",
      icon: "mdi-playlist-check",
      id: 4,
      divider: true,
      sub_items: [
        { title: "Nicht aktuell +120 Tage", content: statistics.value.facilities_not_up_to_date_120_count, query: "data_not_up_to_date_1", type: "users" },
        { title: "Nicht aktuell +134 Tage", content: statistics.value.facilities_not_up_to_date_134_count, query: "data_not_up_to_date_2", type: "users" },
        { title: "Nicht aktuell +226 Tage", content: statistics.value.facilities_not_up_to_date_226_count, query: "data_not_up_to_date_3", type: "users" },
        { title: "Nicht aktuell +240 Tage", content: statistics.value.facilities_not_up_to_date_240_count, query: "data_not_up_to_date_4", type: "users" },
      ],
    },
    {
      title: "Aktivität",
      icon: "mdi-progress-check",
      id: 5,
      sub_items: [
        { title: "Aktive Veranstaltungen", content: statistics.value.active_events_count, type: "event", query: "active_events" },
        { title: "Aktive Kurse", content: statistics.value.active_courses_count, type: "course", query: "active_courses" },
        { title: "Aktive Beiträge", content: statistics.value.active_news_count, type: "news", query: "active_news" },
      ],
    },
    {
      title: "",
      icon: "",
      id: 6,
      divider: false,
      sub_items: [
        { title: "Veranstaltungen gesamt", content: statistics.value.total_events_count, type: "event", query: "showAll", hasNoSpace: true },
        { title: "Kurse gesamt", content: statistics.value.total_courses_count, type: "course", query: "showAll", hasNoSpace: true },
        { title: "Beiträge gesamt", content: statistics.value.total_news_count, type: "news", query: "showAll", hasNoSpace: true },
      ],
    },
  ];
});

onMounted(async () => {
  if (!useUser().isAdmin()) {
    router.push({ path: "/" });
  } else {
    await getStatistics();
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
