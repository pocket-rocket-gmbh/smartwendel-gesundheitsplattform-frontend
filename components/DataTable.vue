<template>
  <div class="d-flex flex-column align-center justify-center my-1 pagination">
    <div class="d-flex align-center justify-center mt-1">
      <p v-if="props.searchQuery">
        Zeigt
        {{
          Math.min(
            (pagination.page - 1) * pagination.itemsPerPage + 1,
            items.length
          )
        }}-
        {{ Math.min(pagination.page * pagination.itemsPerPage, items.length) }}
        von {{ items.length }} Einträgen
      </p>
      <p v-else>
        Zeigt {{ (pagination.page - 1) * pagination.itemsPerPage + 1 }}-
        {{
          Math.min(
            pagination.page * pagination.itemsPerPage,
            pagination.totalItems
          )
        }}
        von {{ pagination.totalItems }} Einträgen
      </p>

      <v-select
        v-if="!searchQuery"
        v-model="pagination.itemsPerPage"
        @update:model-value="getItems"
        :items="paginationValues"
        item-title="text"
        item-value="value"
        density="compact"
        hide-details
        class="mx-1"
      />

      <span @click="toogleBar">
        <v-icon class="is-clickable" v-if="showBar" size="x-large"
          >mdi-menu-up</v-icon
        >
        <v-icon class="is-clickable" v-else size="x-large"
          >mdi-menu-down</v-icon
        >
      </span>
    </div>
    <v-pagination
      v-if="!searchQuery"
      rounded="circle"
      :total-visible="7"
      v-model="pagination.page"
      :length="Math.ceil(pagination.totalItems / pagination.itemsPerPage)"
      @update:model-value="getItems"
    ></v-pagination>
  </div>
  <v-divider> </v-divider>
  <v-table fixed-header>
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
          item?.kind !== 'facility' ? 'has-normal-bg' : '',
          getCurrentRoute() === 'admin-users' ? '' : '',
          isDraft(item) || item?.kind !== 'facility'
            ? 'draft'
            : 'has-bg-lighten-green',
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
          <span v-else-if="field.type === 'currency' && item[field.value]">{{
            useCurrency().getCurrencyFromNumber(item[field.value])
          }}</span>
          <v-tooltip top v-else-if="field.type === 'icon' && field.tooltip">
            <template v-slot:activator="{ props }">
              <v-icon class="is-clickable" v-bind="props">{{
                field.value
              }}</v-icon>
            </template>
            <span v-if="field.tooltip">{{ field.tooltip }}</span>
          </v-tooltip>
          <v-tooltip
            top
            v-else-if="field.type === 'move_up' && indexMain !== 0"
          >
            <template v-slot:activator="{ props }">
              <v-icon class="is-clickable" v-bind="props">mdi-arrow-up</v-icon>
            </template>
            <span>Nach oben</span>
          </v-tooltip>
          <v-tooltip
            top
            v-else-if="
              field.type === 'move_down' && indexMain !== items.length - 1
            "
          >
            <template v-slot:activator="{ props }">
              <v-icon class="is-clickable" v-bind="props"
                >mdi-arrow-down</v-icon
              >
            </template>
            <span>Nach unten</span>
          </v-tooltip>

          <v-icon v-else-if="field.type === 'icon' && !field.tooltip">{{
            field.value
          }}</v-icon>
          <span
            v-else-if="item[field.value] && field.type === 'association_name'"
            >{{ item[field.value].name }}</span
          >
          <span
            v-else-if="item[field.value] && field.type === 'associations_name'"
          >
            <div
              v-for="(subItem, index) in item[field.value]"
              :key="index"
              class="small"
            >
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
                    :notification-pre-filled-text="
                      field.notificationPreFilledText
                    "
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
            :field-class="
              useEnums().getClassName(field.enum_name, item[field.value])
            "
            :disable-edit="!useUser().isAdmin()"
          />
          <div
            v-else-if="
              item[field.value] && field.enum_name && field.type === 'enum'
            "
          >
            <span
              :class="
                useEnums().getClassName(field.enum_name, item[field.value])
              "
            >
              {{ useEnums().getName(field.enum_name, item[field.value]) }}
            </span>
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
                      <div class="d-flex align-center">
                        <v-icon
                          v-if="!facility.is_active"
                          size="x-small"
                          color="error"
                          >mdi-circle</v-icon
                        >
                        <v-icon
                          v-if="facility.is_active"
                          size="x-small"
                          color="success"
                          >mdi-circle</v-icon
                        >
                      </div>
                    </v-chip>
                  </v-col>
                </v-row>
              </div>
            </div>
          </span>
          <span v-else-if="field.type === 'beinEdited' && item.user">
            <span v-if="isDraft(item)"><i>Bearbeitung fortsetzen</i></span>
          </span>
          <span
            v-else-if="field.type === 'has-dates' && !item.event_dates.length"
          >
            <v-icon class="is-yellow">mdi-calendar-alert-outline</v-icon>
          </span>
          <span
            v-else-if="
              field.type === 'is-lk' &&
              item?.user?.role === 'care_facility_admin'
            "
          >
            <img :src="logo" width="20" class="ml-2 pt-2" />
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
              <v-icon>mdi-send-variant-outline</v-icon>
            </span>
          </span>

          <span
            v-else-if="
              field.type === 'imported' &&
              item?.user?.imported &&
              useUser().isAdmin()
            "
            @click.stop="copyTokenLink(item)"
          >
            <div class="d-flex ga-3">
              <v-icon
                :class="[
                  item?.user?.onboarding_token ? 'not-onboard' : 'onboard',
                ]"
                >mdi-application-import</v-icon
              >
              <v-icon
                v-if="!item?.owner_requested_maintenance"
                class="no-maintenance"
                >mdi-flag-variant-remove</v-icon
              >
              <v-icon
                v-if="item?.owner_requested_maintenance"
                class="yes-maintenance"
              >
                mdi-flag-variant-plus
              </v-icon>
            </div>
          </span>
          <span v-else-if="field.type === 'beinEdited' && !item.user"
            ><i>Benutzer existiert nicht</i></span
          >
          <span v-else-if="field.type === 'button' && field.action">
            <button
              @click.stop="field.action(item)"
              v-if="
                field.value !== 'mdi-eye' &&
                field.value !== 'mdi-check-decagram'
              "
            >
              <span v-if="pathInto(item, field.value) !== 'user.name'">
                {{ pathInto(item, field.value) }}
              </span>
              <span v-if="pathInto(item, field.value) === 'user.name'">
                Benutzer existiert nicht
              </span>
            </button>
            <span v-if="field.value === 'user.name'">
              <span
                class="align-center ml-2"
                v-if="pathInto(item, field.value).length > 1"
              >
                <v-icon
                  v-if="item?.user?.is_active_on_health_scope"
                  size="x-small"
                  color="success"
                  >mdi-circle</v-icon
                >
                <v-icon
                  v-if="!item?.user?.is_active_on_health_scope"
                  size="x-small"
                  color="error"
                  >mdi-circle</v-icon
                >
              </span>
            </span>
            <span
              v-if="
                field.value === 'mdi-eye' &&
                item.is_active &&
                useUser().statusOnHealthScope()
              "
            >
              <v-icon class="is-clickable" @click="field.action(item)"
                >mdi-eye</v-icon
              >
            </span>
            <span
              v-if="
                field.value === 'mdi-check-decagram' &&
                item.billable_through_health_insurance_approved &&
                useUser().statusOnHealthScope()
              "
            >
              <v-icon
                class="is-clickable"
                color="primary"
                @click="field.action(item)"
                >mdi-check-decagram</v-icon
              >
            </span>
            <span v-else>
              <v-icon></v-icon>
            </span>
          </span>
          <span v-else>{{ item[field.value] }}</span>
        </td>
        <td v-if="!disableEdit">
          <v-icon class="is-clickable" @click="emitParent(item, null)"
            >mdi-pencil</v-icon
          >
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
]);

const openConfirmationDialog = (item: any) => {
  emit("openConfirmationDialog", item);
};

const sortOrder = ref(props.defaultSortOrder);
const sortBy = ref(props.defaultSortBy);

const loading = ref(false);

const showBar = ref(true);

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
  if (!item?.user?.onboarding_token) return;
  const link = `${window.location.origin}/onboarding?token=${item?.user?.onboarding_token}`;
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

//limit items to 10

const handleToggled = async (item: any) => {
  emit("itemUpdated", item);
};

const getItems = async () => {
  loading.value = true;
  const options = {
    page: pagination.value.page,
    per_page: props.searchQuery ? 999 : pagination.value.itemsPerPage,
    sort_by: sortBy.value,
    sort_order: sortOrder.value,
    searchQuery: props.searchQuery || null,
    concat: false,
    filters: [] as any[],
  };
  adminStore.loading = true;
  const response = await api.retrieveCollection(options);

  if (response.data && response.data.resources) {
    items.value = Array.isArray(response.data.resources)
      ? response.data.resources
      : [];
  } else {
    items.value = Array.isArray(response.data) ? response.data : [];
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
  { text: "Alle", value: 9999 },
]);

watch(
  () => props.searchQuery,
  debounce(() => {
    pagination.value.page = 1;
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
</style>
