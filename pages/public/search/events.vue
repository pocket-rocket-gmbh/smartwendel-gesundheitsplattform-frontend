<template>
  <ClientOnly>
    <div>
      <PublicSearchTheBasicSearchBox
        title="Veranstaltungen"
        sub-title="Finde die passende Veranstaltung!"
        :filter-kind="'event'"
      />
      <div class="container">
        <div class="results">
          <PublicSearchTheFilteredCareFacilities :doubled="true" />
        </div>
      </div>
      <v-row v-if="!filterStore.filteredResults.length && !appStore.loading">
        <v-col class="d-flex flex-column align-center justify-center">
          <div class="flex-column" align="center">
            <div class="general-font-size text-h4">
              Leider haben wir kein Suchergebnis zu deiner Anfrage.
            </div>
          </div>
          <img :src="noResults" class="no-results-image mt-10" />
        </v-col>
      </v-row>
<!--       <div>
        <v-sheet class="d-flex" height="54" tile>
          <v-select
            v-model="type"
            :items="types"
            class="ma-2"
            label="View Mode"
            variant="outlined"
            dense
            hide-details
          ></v-select>
          <v-select
            v-model="weekday"
            :items="weekdays"
            class="ma-2"
            label="weekdays"
            variant="outlined"
            dense
            hide-details
          ></v-select>
        </v-sheet>
        <v-sheet>
          <v-calendar
            ref="calendar"
            :events="events"
            view-mode="month"
            :weekdays="weekday"
          ></v-calendar>
        </v-sheet>
      </div> -->
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { BreakPoints, useBreakpoints } from "~/composables/ui/breakPoints";
import { useFilterStore } from "~/store/searchFilter";
import { useAppStore } from "~/store/app";
import noResults from "~/assets/images/search_no_results.jpg";
/* import { VCalendar } from "vuetify/labs/VCalendar"; */

const filterStore = useFilterStore();
const breakpoints = useBreakpoints();

const appStore = useAppStore();

/* const showSearchFilter = computed(() => {
  return breakpoints.width.value > BreakPoints.md;
});

const results = computed(() => {
  return filterStore.filteredResults;
});

const type = ref("month");
const types = ref(["month", "week", "day"]);
const weekday = ref([0, 1, 2, 3, 4, 5, 6]);
const weekdays = ref([
  { title: "Sun - Sat", value: [0, 1, 2, 3, 4, 5, 6] },
  { title: "Mon - Sun", value: [1, 2, 3, 4, 5, 6, 0] },
  { title: "Mon - Fri", value: [1, 2, 3, 4, 5] },
  { title: "Mon, Wed, Fri", value: [1, 3, 5] },
]);

const getFilteredResultsAllEventDatesArray = computed(() => {
  const eventsArray = filterStore.filteredResults.map((item: any) => {
    const eventDateTime = item.event_dates[0].split(" ");
    const [day, month, year] = eventDateTime[0].split(".");
    const [hour, minute] = eventDateTime[1].split(":");
    const eventDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute)
    );
    const eventDuration = Number(item.event_duration);

    const start = eventDate;
    const end = new Date(eventDate.getTime() + eventDuration * 60000);

    return {
      title: [item.name],
      start,
      end,
      color: "green",
      allDay: false,
    };
  });
   events.value = eventsArray;

  return eventsArray;
}); */

/* const events = computed(() => {
  return getFilteredResultsAllEventDatesArray.value;
});
 */
onMounted(async () => {
  filterStore.currentKinds = ["event"];
  filterStore.updateFromUrlQuery();
  filterStore.loadAllResults();
});

onBeforeUnmount(() => {
  filterStore.resetAllFilters();
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.container
  padding: 2rem 5rem
  display: flex
  gap: 1rem

  @include md
    padding: 1rem

  .filters
    flex: 1

  .results
    flex: 2

  .row
    max-width: 100%
    margin: 0
    gap: 1rem
    @include md
      margin: 0

.no-results-image
  max-width: 500px
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15)
  border-radius: 20px
</style>
