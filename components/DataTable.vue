<template>
  <div>
    <v-row>
      <v-col class="d-flex align-center my-5">
        <v-radio-group
          inline
          class="d-flex justify-end align-center"
          v-model="listOptionValue"
          v-if="useUser().isAdmin() && endpoint === 'care_facilities?kind=facility'"
        >
          <v-radio
            v-for="(item, index) in listOptions"
            :key="index"
            :label="item.text"
            class="pl-5"
            :value="item.value"
            @click="setFilter(item.value)"
          ></v-radio>
        </v-radio-group>
        <v-radio-group
          inline
          class="d-flex justify-end align-center"
          v-model="listOptionValue"
          v-else-if="endpoint === 'users'"
        >
          <v-radio
            v-for="(item, index) in listOptionsUsers"
            :key="index"
            :label="item.text"
            class="pl-5"
            :value="item.value"
            @click="setFilter(item.value)"
          ></v-radio>
        </v-radio-group>
        <!-- 
        <v-radio-group
          inline
          class="d-flex justify-end align-center"
          v-model="listOptionValue"
        >
          <v-radio
            v-for="(item, index) in listOptionsComplaints"
            :key="index"
            :label="item.text"
            :value="item.value"
            @click="setFilter(item.value)"
          ></v-radio>
        </v-radio-group> -->
        <v-radio-group
          inline
          class="d-flex justify-end align-center"
          v-model="listOptionValue"
          v-else-if="endpoint === 'care_facilities?kind=event'"
        >
          <v-radio
            v-for="(item, index) in listOptionsEvents"
            :key="index"
            :label="item.text"
            class="pl-5"
            :value="item.value"
            @click="setFilter(item.value)"
          ></v-radio>
        </v-radio-group>

        <v-radio-group
          inline
          class="d-flex justify-end align-center"
          v-model="listOptionValue"
          v-else-if="endpoint === 'care_facilities?kind=course'"
        >
          <v-radio
            v-for="(item, index) in listOptionsCourses"
            :key="index"
            :label="item.text"
            class="pl-5"
            :value="item.value"
            @click="setFilter(item.value)"
          ></v-radio>
        </v-radio-group>

        <v-radio-group
          inline
          class="d-flex justify-end align-center"
          v-model="listOptionValue"
          v-else-if="endpoint === 'care_facilities?kind=news'"
        >
          <v-radio
            v-for="(item, index) in listOptionsNews"
            :key="index"
            :label="item.text"
            class="pl-5"
            :value="item.value"
            @click="setFilter(item.value)"
          ></v-radio>
        </v-radio-group>
        <span @click="toogleBar" v-if="!noBar">
          <v-icon class="is-clickable" v-if="showBar" size="x-large">mdi-menu-up</v-icon>
          <v-icon class="is-clickable" v-else size="x-large">mdi-menu-down</v-icon>
        </span>
      </v-col>
    </v-row>
  </div>

  <v-divider :class="noData ? 'mt-10' : ''"> </v-divider>
  <v-alert v-if="noData" type="warning">keine Ergebnisse gefunden </v-alert>
  <v-table v-else fixed-header class="my-5">
    <thead class="elevation-1 primary">
      <tr>
        <th
          v-for="field in fields"
          :key="field.text"
          :width="[
            field.type === 'move_up' ||
            field.type === 'move_down' ||
            field.type === 'icon' ||
            field.type === 'switch'
              ? '30px'
              : field.width,
          ]"
          :class="{ 'is-clickable': field.prop }"
          @click="field.prop && rotateColumnSortOrder(field.prop)"
        >
          <div
            class="table-head-item"
            :class="sortBy === field.prop ? 'selected-sort' : ''"
          >
            {{ field.text }}
            <div
              v-if="sortBy === field.prop"
              class="chevron"
              :class="{ up: sortOrder === 'desc', down: sortOrder === 'asc' }"
            ></div>
            <div v-else-if="field.text">
              <div class="chevron"></div>
            </div>
          </div>
        </th>
        <th width="15px" v-if="!disableEdit"></th>
        <th width="15px"></th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="(item, indexMain) in items"
        :key="item.id"
        :class="[
          item === activeItems ? 'activeItems' : '',
          item?.user ? '' : 'user-deleted',
          item?.kind !== 'user' ? '' : 'has-normal-bg',
          getCurrentRoute() === 'admin-users' || getCurrentRoute() === 'admin-tooltips' || getCurrentRoute() === 'admin-complaints' ? 'has-normal-bg' : '',
          isDraft(item) || item?.kind !== 'facility' ? 'draft' : 'has-bg-lighten-green',
        ]"
      >
        <td
          v-for="(field, index) in fields"
          :key="index"
          class="is-clickable"
          :class="{ disabled: field?.disabledConditions?.(item) }"
          @click="handleEmitParent(item, field, indexMain)"
          :width="field.width"
        >
          <span v-if="field.type === 'datetime' && item[field.value]">{{
            useDatetime().parseDatetime(item[field.value])
          }}</span>
          <span v-else-if="field.type === 'is-imported' && item?.imported">
            <v-tooltip location="top" width="250px">
              <template v-slot:activator="{ props }">
                <v-icon color="success" class="ml-2 pt-2" v-bind="props"
                  >mdi-application-import</v-icon
                >
              </template>
              <span>Benutzer wurde importiert </span>
            </v-tooltip>
          </span>
          <span v-else-if="field.type === 'currency' && item[field.value]">{{
            useCurrency().getCurrencyFromNumber(item[field.value])
          }}</span>
          <v-tooltip top v-else-if="field.type === 'icon' && field.tooltip">
            <template v-slot:activator="{ props }">
              <v-icon class="is-clickable" v-bind="props">{{ field.value }}</v-icon>
            </template>
            <span v-if="field.tooltip">{{ field.tooltip }}</span>
          </v-tooltip>
          <v-tooltip top v-else-if="field.type === 'move_up' && indexMain !== 0">
            <template v-slot:activator="{ props }">
              <v-icon class="is-clickable" v-bind="props">mdi-arrow-up</v-icon>
            </template>
            <span>Nach oben</span>
          </v-tooltip>
          <v-tooltip
            top
            v-else-if="field.type === 'move_down' && indexMain !== items.length - 1"
          >
            <template v-slot:activator="{ props }">
              <v-icon class="is-clickable" v-bind="props">mdi-arrow-down</v-icon>
            </template>
            <span>Nach unten</span>
          </v-tooltip>

          <v-icon v-else-if="field.type === 'icon' && !field.tooltip">{{
            field.value
          }}</v-icon>
          <span v-else-if="item[field.value] && field.type === 'association_name'">{{
            item[field.value].name
          }}</span>
          <span v-else-if="item[field.value] && field.type === 'associations_name'">
            <div v-for="(subItem, index) in item[field.value]" :key="index" class="small">
              {{ subItem.name }}
            </div>
          </span>
          <template v-else-if="field.type === 'switch'">
            <v-tooltip top>
              <template v-slot:activator="{ props }">
                <div v-bind="props">
                  <TableSwitch
                    :item="item"
                    :endpoint="field.endpoint"
                    :field-to-switch="field.fieldToSwitch"
                    :ask-notification="field.askNotification"
                    :notification-kind="field.notificationKind"
                    :notification-kind-explicit="field.notificationKindExplicit"
                    :notification-pre-filled-headline="
                      field.notificationPreFilledHeadline
                    "
                    :notification-pre-filled-text="field.notificationPreFilledText"
                    :notification-cta-link="field.notificationCtaLink"
                    :disabled="field?.disabledConditions?.(item)"
                    @toggled="handleToggled(item)"
                  />
                </div>
              </template>
              <div v-if="!useUser().statusOnHealthScope()" class="tooltip">
                {{
                  field?.disabledConditions?.(item)
                    ? field.disabledTooltip
                    : field.tooltip
                }}
              </div>
              <div v-else class="tooltip">
                {{
                  field?.disabledConditions?.(item)
                    ? field.disabledTooltipFacilityImcomplete
                    : field.tooltip
                }}
              </div>
            </v-tooltip>
          </template>
          <TableDropdown
            v-else-if="field.type === 'enumDropdown'"
            :item="item"
            :enum-name="field.enum_name"
            :endpoint="field.endpoint"
            :fieldName="field.value"
            :field-class="useEnums().getClassName(field.enum_name, item[field.value])"
            :disable-edit="!useUser().isAdmin()"
          />
          <div v-else-if="field.type === 'enum'">
            <span :class="useEnums().getClassName(field.enum_name, item[field.value])">
              {{ useEnums().getName(field.enum_name, item[field.value]) }}
            </span>
          </div>
          <div
            v-else-if="item[field.value] && field.enum_name && field.type === 'enumKinds'"
          >
            <v-chip
              :color="useEnums().getClassName(field.enum_name, item[field.value])"
              >{{ useEnums().getName(field.enum_name, item[field.value]) }}</v-chip
            >
          </div>
          <span v-else-if="field.type === 'array'">{{
            item[field.value].join(", ")
          }}</span>
          <span v-else-if="field.type === 'pathIntoObject'">{{
            pathInto(item, field.value)
          }}</span>
          <span v-else-if="field.type === 'facilities'">
            <div v-if="Array.isArray(item[field.value])">
              <div v-for="facility in item[field.value]">
                <v-row v-if="facility.kind === 'facility'">
                  <v-col>
                    <v-chip class="mx-2 mt-2" color="grey">
                      <v-icon v-if="facility.kind === 'facility'" class="mr-2"
                        >mdi-home-city-outline</v-icon
                      >
                      <span class="pr-3">
                        {{ facility.name }}
                      </span>
                      <div class="d-flex align-center" v-if="useUser().isAdmin()">
                        <v-tooltip v-if="!facility.is_active">
                          <template v-slot:activator="{ props }">
                            <v-icon size="x-small" color="error" v-bind="props"
                              >mdi-circle</v-icon
                            >
                          </template>
                          <span>Einrichtung offline</span>
                        </v-tooltip>

                        <v-tooltip v-else>
                          <template v-slot:activator="{ props }">
                            <v-icon size="x-small" color="success" v-bind="props"
                              >mdi-circle</v-icon
                            >
                          </template>
                          <span>Einrichtung online</span>
                        </v-tooltip>
                      </div>
                    </v-chip>
                  </v-col>
                </v-row>
              </div>
            </div>
          </span>
          <span v-else-if="field.type === 'protocol'">
            <span><v-icon size="x-large" color="red" @click.stop="emitGeneratePdf(item)">mdi-file-pdf-box</v-icon></span>
          </span>
          <span v-else-if="field.type === 'beinEdited' && item.user">
            <span v-if="isDraft(item)"><i>Bearbeitung fortsetzen</i></span>
          </span>
          <span v-else-if="field.type === 'has-dates' && !item.event_dates.length">
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-icon class="is-yellow" v-bind="props"
                  >mdi-calendar-alert-outline</v-icon
                >
              </template>
              <span>Kein Datum angegeben.</span>
            </v-tooltip>
          </span>
          <span
            v-else-if="
              field.type === 'is-lk' && item?.user?.role === 'care_facility_admin'
            "
          >
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <img :src="logo" width="20" class="ml-2 pt-2" v-bind="props" />
              </template>
              <span>Diese Einrichtung wurde vom Landkreis erstellt.</span>
            </v-tooltip>
          </span>
          <span
            v-else-if="
              field.type === 'send-invitation' &&
              item?.user?.onboarding_token &&
              useUser().isAdmin() &&
              !item?.owner_requested_maintenance
            "
            @click.stop="openConfirmationDialog(item)"
          >
            <span
              class="d-flex flex-column align-center"
              :class="
                item?.user?.notification_after_manual_import_sent_at?.length
                  ? 'onboard'
                  : ''
              "
            >
              <span v-if="item?.user?.notification_after_manual_import_sent_at">
                {{
                  useDatetime().parseDatetime(
                    item?.user?.notification_after_manual_import_sent_at
                  )
                }}</span
              >

              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props">mdi-send-variant-outline</v-icon>
                </template>
                <span>Email zur Einrichtungsübernahme versenden</span>
              </v-tooltip>
            </span>
          </span>

          <span
            v-else-if="
              field.type === 'imported' && item?.user?.imported && useUser().isAdmin()
            "
            @click.stop="copyTokenLink(item)"
          >
            <div class="d-flex ga-3">
              <span v-if="item?.user?.onboarding_token">
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-icon class="not-onboard" v-bind="props"
                      >mdi-application-import</v-icon
                    >
                  </template>
                  <span>Einrichtung wurde importiert, aber noch nicht übernommen.</span>
                </v-tooltip>
              </span>

              <span v-if="!item?.user?.onboarding_token">
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-icon class="onboard" v-bind="props">mdi-application-import</v-icon>
                  </template>
                  <span>Einrichtung wurde importiert und übernommen.</span>
                </v-tooltip>
              </span>

              <span v-if="!item?.owner_requested_maintenance">
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-icon class="no-maintenance" v-bind="props"
                      >mdi-flag-variant-remove</v-icon
                    >
                  </template>
                  <span>Die Inhaberschaft wurde dem Landkreis nicht übertragen.</span>
                </v-tooltip>
              </span>

              <span v-if="item?.owner_requested_maintenance">
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-icon class="yes-maintenance" v-bind="props"
                      >mdi-flag-variant-plus</v-icon
                    >
                  </template>
                  <span>Die Inhaberschaft wurde dem Landkreis übertragen.</span>
                </v-tooltip>
              </span>
            </div>
          </span>

          <span
            v-else-if="field.type === 'button' && field.action"
            class="d-flex align-center"
          >
            <button
              @click.stop="field.action(item)"
              v-if="field.value !== 'mdi-eye' && field.value !== 'mdi-check-decagram'"
            >
              <span
                v-if="pathInto(item, field.value) !== 'user.name'"
                class="break-title text-left"
              >
                {{ pathInto(item, field.value) }}
              </span>
              <span v-if="pathInto(item, field.value) === 'user.name'">
                Benutzer existiert nicht
                <v-icon color="warning">mdi-alert</v-icon>
              </span>
              <span v-if="pathInto(item, field.value) === ' '">
                keine Angaben
                <v-icon color="warning">mdi-alert</v-icon>
              </span>
            </button>
            <span v-if="field.value === 'user.name'">
              <span
                class="align-center ml-2"
                v-if="pathInto(item, field.value).length > 1 && useUser().isAdmin()"
              >
                <v-tooltip
                  location="top"
                  v-if="item?.user && item?.user?.is_active_on_health_scope"
                >
                  <template v-slot:activator="{ props }">
                    <v-icon size="x-small" color="success" v-bind="props"
                      >mdi-circle</v-icon
                    >
                  </template>
                  <span>Benutzer ist Freigeschaltet.</span>
                </v-tooltip>
                <v-tooltip
                  location="top"
                  v-if="item?.user && !item?.user?.is_active_on_health_scope"
                >
                  <template v-slot:activator="{ props }">
                    <v-icon size="x-small" color="error" v-bind="props"
                      >mdi-circle</v-icon
                    >
                  </template>
                  <span>Benutzer ist nicht Freigeschaltet</span>
                </v-tooltip>
              </span>
            </span>
            <span
              v-if="
                field.value === 'mdi-eye' &&
                item.is_active &&
                useUser().statusOnHealthScope()
              "
            >
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-icon class="is-clickable" @click="field.action(item)" v-bind="props"
                    >mdi-eye</v-icon
                  >
                </template>
                <span>Zur Einrichtungseite wechseln.</span>
              </v-tooltip>
            </span>
            <span
              v-if="
                field.value === 'mdi-check-decagram' &&
                item.billable_through_health_insurance_approved &&
                useUser().statusOnHealthScope()
              "
            >
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-icon
                    class="is-clickable"
                    color="primary"
                    v-bind="props"
                    @click="field.action(item)"
                    >mdi-check-decagram</v-icon
                  >
                </template>
                <span>Das Zertifikat wurde überprüft.</span>
              </v-tooltip>
            </span>
            <span v-else>
              <v-icon></v-icon>
            </span>
          </span>
          <span v-else>{{ item[field.value] }}</span>
        </td>
        <td v-if="!disableEdit">
          <v-icon class="is-clickable" @click="emitParent(item, null)">mdi-pencil</v-icon>
        </td>
        <td v-if="useUser().isAdmin() || !disableDelete">
          <v-icon class="is-clickable" @click="emitopenDeleteDialog(item.id)"
            >mdi-delete</v-icon
          >
        </td>
        <td v-else>
          <v-icon></v-icon>
        </td>
      </tr>
    </tbody>
  </v-table>
  <div
    class="d-flex my-1 justify-space-between pagination"
    v-if="!noData && !adminStore.loading && useUser().isAdmin()"
  >
    <div class="d-flex align-center mt-1">
      <v-select
        v-if="!searchQuery"
        v-model="pagination.itemsPerPage"
        @update:model-value="getItems"
        :items="paginationValues"
        item-title="text"
        item-value="value"
        density="compact"
        hide-details
        class="mx-1 my-5"
      />
      <p v-if="props.searchQuery">
        Zeigt
        {{ Math.min((pagination.page - 1) * pagination.itemsPerPage + 1, items.length) }}-
        {{ Math.min(pagination.page * pagination.itemsPerPage, items.length) }}
        von {{ items.length }} Einträgen
      </p>
      <p v-else>
        Zeigt {{ (pagination.page - 1) * pagination.itemsPerPage + 1 }}-
        {{ Math.min(pagination.page * pagination.itemsPerPage, pagination.totalItems) }}
        von {{ pagination.totalItems }} Einträgen
      </p>
    </div>
    <div class="d-flex justify-center align-center">
      <v-pagination
        v-if="!searchQuery"
        rounded="circle"
        :total-visible="7"
        v-model="pagination.page"
        :length="Math.ceil(pagination.totalItems / pagination.itemsPerPage)"
        @update:model-value="getItems"
      ></v-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEnums } from "@/composables/data/enums";
import { pathIntoObject } from "~/utils/path.utils";
import { useAdminStore } from "~/store/admin";
import { isCompleteFacility } from "~/utils/facility.utils";
import type { RequiredField } from "~/types/facilities";
import logo from "@/assets/images/lk-logo.png";

const router = useRouter();

const pagination = ref({
  page: 1,
  itemsPerPage: 20,
  totalItems: 0,
});

const props = withDefaults(
  defineProps<{
    disableDelete: boolean;
    fields: any[];
    endpoint: string;
    disableEdit?: boolean;
    overwriteMoveEndpoint?: string;
    searchQuery?: string;
    searchColumns?: string[];
    defaultSortBy?: string;
    defaultSortOrder?: string;
    draftRequired?: RequiredField[];
    noBar?: boolean;
  }>(),
  {
    defaultSortBy: "created_at",
    defaultSortOrder: "desc",
  }
);

const snackbar = useSnackbar();

const emit = defineEmits([
  "close",
  "openCreateEditDialog",
  "openDeleteDialog",
  "itemsLoaded",
  "itemUpdated",
  "toogleBar",
  "openConfirmationDialog",
  "generatePdf",
]);

const emitGeneratePdf = (item: any) => {
  emit("generatePdf", item);
};

const openConfirmationDialog = (item: any) => {
  emit("openConfirmationDialog", item);
};

const sortOrder = ref(props.defaultSortOrder);
const sortBy = ref(props.defaultSortBy);

const loading = ref(false);

const noData = ref(false);

const showBar = ref(true);

const listOptionValue = ref("showAll");

const listOptions = ref([
  { text: "Gesamt", value: "showAll" },
  { text: "Online", value: "active_facilities" },
  { text: "Offline", value: "inactive_facilities" },
  { text: "Importierte Profile", value: "imported_profiles" },
  { text: "Inhaberschaften LK", value: "successful_profile_takeovers" },
  { text: "Rückmeldung ausstehend", value: "pending_profile_takeovers" },
  { text: "Neu registrierte Einrichtungen", value: "thirty_days_ago" },
  { text: "Inhaberschaften Nutzer", value: "user_maintenance_requested" },
  { text: "Daten nicht aktuell", value: "data_not_up_to_date" },
  { text: "Nicht gesendete Emails", value: "mail_not_sent" },
]);

const listOptionsUsers = ref([
  { text: "Gesamt", value: "showAll" },
  { text: "Freigegeben", value: "approved" },
  { text: "in Prüfung (importiert)", value: "import_pending" },
  { text: "in Prüfung (import abgeschlossen)", value: "imported_pending" },
  { text: "in Prüfung", value: "pending" },
]);

const listOptionsEvents = ref([
  { text: "Gesamt", value: "showAll" },
  { text: "Online", value: "active_events" },
  { text: "Offline", value: "inactive_events" },
]);

const listOptionsCourses = ref([
  { text: "Gesamt", value: "showAll" },
  { text: "Online", value: "active_courses" },
  { text: "Offline", value: "inactive_courses" },
]);

const listOptionsNews = ref([
  { text: "Gesamt", value: "showAll" },
  { text: "Online", value: "active_news" },
  { text: "Offline", value: "inactive_news" },
]);

/* const listOptionsComplaints = ref([
  { text: "Gesamt", value: "showAll" },
  { text: "Beantwortet", value: "answered" },
]); */

const toogleBar = () => {
  showBar.value = !showBar.value;
  emit("toogleBar", showBar.value);
};

const resetActiveItems = () => {
  activeItems.value = null;
};

const getCurrentRoute = () => {
  return router.currentRoute.value.name;
};

const isFilled = (itemToCheck: any, requiredField: RequiredField) => {
  const props: string[] = requiredField.props;
  if (!props) return;

  if (requiredField.specialFilter) {
    if (requiredField.specialFilter === "filter_facility") {
      // TODO: Filter korrekt
      return true; //facilitiesFilterSet.value;
    } else if (requiredField.specialFilter === "filter_service") {
      // TODO: Filter korrekt
      return true; // servicesFilterSet.value;
    } else if (requiredField.specialFilter === "opening_hours") {
      return itemToCheck.opening_hours.some((day: any) => day.hours.length > 0);
    }
  }

  if (requiredField.checkHandler) {
    const result = props.every((prop) => {
      return !requiredField.checkHandler(itemToCheck[prop]);
    });
    return result;
  }

  if (requiredField.justSome) {
    const result = props.some((prop) => {
      return itemToCheck[prop] && itemToCheck[prop].length;
    });
    return result;
  }

  const result = props.every((prop) => {
    return itemToCheck[prop] && itemToCheck[prop].length;
  });

  return result;
};

const isDraft = (item: any) => {
  if (!props.draftRequired) return false;

  return !props.draftRequired.every((requiredField: any) => {
    const isRequiredFieldFilled = isFilled(item, requiredField);
    return isRequiredFieldFilled;
  });
};

const copyTokenLink = (item: any) => {
  console.log(item);
  if (!item?.preview_token) return;
  const link = `${window.location.origin}/public/care_facilities/${item?.id}?token_id=${item?.preview_token}`;
  navigator.clipboard.writeText(link);
  snackbar.showSuccess(`Link kopiert`);
};

const emitopenDeleteDialog = (itemId: any) => {
  emit("openDeleteDialog", itemId);
};
const activeItems = ref(null);
const handleEmitParent = (item: any, field: any, menu_order: any) => {
  activeItems.value = item;
  if (field.type === "move_up") {
    move(item, items.value[(menu_order -= 1)]);
  } else if (field.type === "move_down") {
    move(item, items.value[(menu_order += 1)]);
  } else if (field.type !== "switch" && field.type !== "enumDropdown") {
    emitParent(item, field.emit);
  }
};

const emitParent = (item: any, fieldEmit: any) => {
  if (!fieldEmit) {
    emit("openCreateEditDialog", item);
  } else {
    emit(fieldEmit, item.id);
  }
};

const move = async (entry: any, nextEntry: any) => {
  let endpoint = props.overwriteMoveEndpoint;
  if (!props.overwriteMoveEndpoint) {
    endpoint = props.endpoint;
  }

  const result = await useTableMove().move(entry, nextEntry, endpoint);
  if (result) {
    getItems();
  }
};
const adminStore = useAdminStore();

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());
api.setEndpoint(props.endpoint);
const items = api.items;

const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const notUpToDate = new Date();
notUpToDate.setDate(notUpToDate.getDate() - 120);

//limit items to 10

const handleToggled = async (item: any) => {
  emit("itemUpdated", item);
};

const filterQuery = ref("");

const getFilterQueryFromUrl = () => {
  const query = String(router.currentRoute.value.query.filter);
  if (query) {
    filterQuery.value = query;
  }
};

const setRouteQuery = () => {
  if (!filterQuery.value || !router.currentRoute.value.query.filter) {
    router.push({ query: { filter: "showAll" } });
  }
};

const filtersMap = {
  active_facilities: {
    field: "is_active",
    value: true,
  },
  inactive_facilities: {
    field: "is_active",
    value: false,
  },
  imported_profiles: {
    field: "user.imported",
    value: true,
  },
  successful_profile_takeovers: [
    {
      field: "owner_requested_maintenance",
      value: true,
    },
    {
      field: "user.imported",
      value: true,
    },
  ],

  user_maintenance_requested: [
    {
      field: "owner_requested_maintenance",
      value: false,
    },
    {
      field: "user.onboarding_status-eq",
      value: "completed",
    },
    {
      field: "user.imported",
      value: true,
    },
  ],
  pending_profile_takeovers: [
    {
      field: "user.onboarding_status-eq",
      value: "pending",
    },
    {
      field: "user.imported",
      value: true,
    },
    {
      field: "user.onboarding_token-ne",
      value: null as any,
    },
    {
      field: "user.notification_after_manual_import_sent",
      value: true,
    },
  ],
  data_not_up_to_date: {
    field: "updated_at-lt",
    value: notUpToDate,
  },
  active_events: {
    field: "is_active",
    value: true,
  },
  inactive_events: {
    field: "is_active",
    value: false,
  },
  active_courses: {
    field: "is_active",
    value: true,
  },
  inactive_courses: {
    field: "is_active",
    value: false,
  },
  active_news: {
    field: "is_active",
    value: true,
  },
  inactive_news: {
    field: "is_active",
    value: false,
  },

  showAll: [],
  approved: [
    {
      field: "is_active_on_health_scope",
      value: true,
    },

    {
      field: "care_facilities-ne",
      value: "[]",
    },
  ],
  pending: [
    {
      field: "is_active_on_health_scope",
      value: false,
    },
    {
      field: "imported",
      value: false,
    },
  ],

  import_pending: [
    {
      field: "imported",
      value: true,
    },
    {
      field: "onboarding_status-eq",
      value: "pending",
    },
    {
      field: "is_active_on_health_scope",
      value: false,
    },
  ],

  imported_pending: [
    {
      field: "imported",
      value: true,
    },

    {
      field: "is_active_on_health_scope",
      value: false,
    },
    {
      field: "onboarding_status-eq",
      value: "completed",
    },
  ],

  mail_not_sent: [
    {
      field: "user.notification_after_manual_import_sent",
      value: false,
    },
    {
      field: "user.imported",
      value: true,
    },
  ],

  thirty_days_ago: {
    field: "created_at-ge",
    value: thirtyDaysAgo,
  },

  /*   all_complaints: {
    field: "is_active_on_health_scope",
    value: false,
  },
  answered_complaints: {
    field: "is_active_on_health_scope",
    value: true,
  }, */
} as const;

const getFilter = <T extends keyof typeof filtersMap>(filter: T) => {
  const activeFilterFromUrl = filterQuery.value;
  if (activeFilterFromUrl) {
    const filterValues = filtersMap[activeFilterFromUrl as keyof typeof filtersMap];

    const value = Array.isArray(filterValues) ? filterValues : [filterValues];

    activeFilter.value = value;
  }
};

const activeFilter = ref([]);

const getItems = async () => {
  loading.value = true;
  const options = {
    page: pagination.value.page,
    per_page: props.searchQuery ? 999 : pagination.value.itemsPerPage,
    sort_by: sortBy.value,
    sort_order: sortOrder.value,
    searchQuery: props.searchQuery || null,
    concat: false,
    filters: activeFilter.value !== null ? activeFilter.value : ([] as any[]),
  };

  adminStore.loading = true;
  const response = await api.retrieveCollection(options);

  if (response.data.resources?.length === 0) {
    loading.value = false;
    adminStore.loading = false;
    noData.value = true;

    return;
  }

  if (response.data && response.data.resources) {
    noData.value = false;
    items.value = Array.isArray(response.data.resources) ? response.data.resources : [];
    noData.value = false;
  } else {
    noData.value = false;
    items.value = Array.isArray(response.data) ? response.data : [];
    noData.value = false;
  }

  if (props.searchQuery) {
    pagination.value.totalItems = items.value.length;
  } else {
    pagination.value.totalItems = response.data.total_results;
  }

  adminStore.loading = false;
  emit("itemsLoaded", items.value);
  loading.value = false;
};

const paginationValues = ref([
  { text: "10", value: 10 },
  { text: "20", value: 20 },
  { text: "30", value: 30 },
  { text: "40", value: 40 },
  { text: "50", value: 50 },
]);

const setFilter = (filter: string) => {
  filterQuery.value = filter;
  router.replace({ query: { filter } });
};

watch(
  () => props.searchQuery,
  debounce(() => {
    pagination.value.page = 1;
    getItems();
  })
);

watch(
  () => router.currentRoute.value.query.filter,
  debounce(() => {
    filterQuery.value = String(router.currentRoute.value.query.filter);
    pagination.value.page = 1;
    pagination.value.itemsPerPage = 20;
    getFilterQueryFromUrl();
    getFilter("active_facilities");
    getItems();
  })
);

const rotateColumnSortOrder = (columnProp: string) => {
  if (sortBy.value !== columnProp) {
    sortOrder.value = "asc";
  } else {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  }
  sortBy.value = columnProp;
  getItems();
};

onMounted(() => {
  getFilterQueryFromUrl();
  setRouteQuery();
  getFilter("active_facilities");
  listOptionValue.value = filterQuery.value;
  useNuxtApp().$bus.$on("triggerGetItems", () => {
    getItems();
  });
  getItems();
});

defineExpose({ resetActiveItems, getItems });
</script>

<style lang="sass">
.draft
  background: rgba(orange, 0.1)

.user-deleted
  background: rgba(red, 0.1)

.small
  font-size: 0.5em

.tick-icon
  position: absolute
  margin-left: 0.7rem
  margin-top: -1rem
  z-index: 99
  color: #8ab61d



.has-normal-bg
  background: white

.dropdown
  position: absolute
  margin-left: 100px
  margin-top: -50px

.table-head-item
  display: flex
  align-items: center

  .chevron
    margin-left: 0.5rem
    width: 20px
    height: 20px
    background-image: url("@/assets/icons/minus.svg")
    background-repeat: no-repeat
    background-position: center
    transition: transform 150ms linear
    border-radius: 50%
    background-color: #E7E8E7

    &.up
      background-image: url("@/assets/icons/chevron-down.svg")
      background-color: #E7E8E7

    &.down
      background-image: url("@/assets/icons/chevron-up.svg")
      background-color: #E7E8E7


.selected-sort
  color: #8ab61d


.onboard
  color: #8ab61d

.not-onboard
  color: #FB8C00

.disabled
  cursor: not-allowed !important

.tooltip
  max-width: 400px

.pagination
  position: sticky

.no-maintenance
  color: red

.yes-maintenance
  color: #358BBC


.v-radio .v-icon
  color: #8ab61d
  border-radius: 50%
</style>
