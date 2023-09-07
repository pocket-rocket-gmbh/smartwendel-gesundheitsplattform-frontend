<template>
  <v-table>
    <thead>
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
          <div class="table-head-item">
            {{ field.text }}
            <div
              v-if="sortBy === field.prop"
              class="chevron"
              :class="{ up: sortOrder === 'desc' }"
            ></div>
          </div>
        </th>
        <th width="15px" v-if="!disableEdit"></th>
        <th width="15px"></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, indexMain) in filteredItems"
        :key="item.id"
        :class="[
          item === activeItems ? 'activeItems' : '',
          { cached: isCached(item.id) },
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
          <span v-if="field.type === 'projectTimeRange'">{{
            useDatetime().getProjectTimeRangeString(item)
          }}</span>
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
              field.type === 'move_down' &&
              indexMain !== filteredItems.length - 1
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
              <span>{{
                field?.disabledConditions?.(item)
                  ? field.disabledTooltip
                  : field.tooltip
              }}</span>
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
                <v-row>
                  <v-col>
                    <v-chip
                      class="mx-2 mt-2"
                      color="grey"
                      v-if="facility.kind === 'facility'"
                    >
                      <v-icon v-if="facility.kind === 'facility'" class="mr-2"
                        >mdi-home-city-outline</v-icon
                      >
                      {{ facility.name }}
                    </v-chip>
                  </v-col>
                </v-row>
              </div>
            </div>
          </span>
          <span v-else-if="field.type === 'beinEdited'">
            <span v-if="isCached(item.id)"><i>wird bearbeitet</i></span>
          </span>
          <span v-else-if="field.type === 'isCompleteFacility'">
            <span class="text-warning" v-if="isCompleteFacility(item)">
              <v-icon class="mr-2">mdi-alert</v-icon>
              <i>Nicht alle Pflichtfelder ausgefüllt</i>
            </span>
          </span>
          <span v-else-if="field.type === 'button' && field.action">
            <button @click.stop="field.action(item)">
              {{ pathInto(item, field.value) }}
            </button>
          </span>
          <span v-else>{{ item[field.value] }}</span>
        </td>
        <td v-if="!disableEdit">
          <v-icon class="is-clickable" @click="emitParent(item, null)"
            >mdi-pencil</v-icon
          >
        </td>
        <td>
          <v-icon class="is-clickable" @click="emitopenDeleteDialog(item.id)"
            >mdi-delete</v-icon
          >
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

const router = useRouter();

const props = withDefaults(
  defineProps<{
    fields: any[];
    endpoint: string;
    disableEdit?: boolean;
    overwriteMoveEndpoint?: string;
    searchQuery?: string;
    searchColumns?: string[];
    defaultSortBy?: string;
    defaultSortOrder?: string;
    cachePrefix?: string;
  }>(),
  {
    defaultSortBy: "created_at",
    defaultSortOrder: "desc",
  }
);

const emit = defineEmits([
  "close",
  "openCreateEditDialog",
  "openDeleteDialog",
  "itemsLoaded",
  "itemUpdated",
]);

const sortOrder = ref(props.defaultSortOrder);
const sortBy = ref(props.defaultSortBy);

const loading = ref(false);

const resetActiveItems = () => {
  activeItems.value = null;
};

const isCached = (itemId: string) => {
  if (!props.cachePrefix) return false;
  if (!props.cachePrefix.includes(",")) {
    return localStorage.getItem(
      `${props.cachePrefix}_${itemId.replaceAll("-", "_")}`
    );
  }
  return props.cachePrefix
    .split(",")
    .some((prefix) =>
      localStorage.getItem(`${prefix}_${itemId.replaceAll("-", "_")}`)
    );
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

const filteredItems = computed(() => {
  if (props.searchQuery === undefined || props.searchColumns === undefined)
    return items.value;

  const itemsFiltered = items.value.filter((item) => {
    const some = props.searchColumns.some((columnProp) => {
      let column = pathIntoObject(item, columnProp);
      if (column) {
        let searchTerm = props.searchQuery.toUpperCase();
        if (columnProp === "kind") {
          if ("VERANSTALTUNG".includes(searchTerm)) {
            searchTerm = "EVENT";
          } else if ("BERICHT".includes(searchTerm)) {
            searchTerm = "NEWS";
          } else if ("KURS".includes(searchTerm)) {
            searchTerm = "COURSE";
          } else if ("EINRICHTUNG".includes(searchTerm)) {
            searchTerm = "FACILITY";
          }
        }
        if (columnProp === "created_at" || columnProp === "last_seen") {
          column = useDatetime().parseDatetime(column);
        }
        if (typeof column === "string") {
          return column.toUpperCase().includes(searchTerm);
        }
        if (Array.isArray(column)) {
          // TODO: Right now i only check for the 'name' field on my items, not all
          return column.find((item) =>
            item.name?.toUpperCase().includes(searchTerm)
          );
        }
      }
    });
    return some;
  });
  return itemsFiltered;
});

const handleToggled = async (item: any) => {
  emit("itemUpdated", item);
};

const getItems = async () => {
  loading.value = true;
  const options = {
    page: 1,
    per_page: 9999,
    sort_by: sortBy.value,
    sort_order: sortOrder.value,
    searchQuery: null as string,
    concat: false,
    filters: [] as any[],
  };
  adminStore.loading = true;
  await api.retrieveCollection(options);
  adminStore.loading = false;
  emit("itemsLoaded", items.value);
  loading.value = false;
};

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
.cached
  background: rgba(orange, 0.1)

.small
  font-size: 8px

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
    background-image: url("@/assets/icons/chevron-down.svg")
    background-repeat: no-repeat
    background-position: center
    transition: transform 150ms linear

    &.up
      transform: rotate(180deg)


.disabled
  cursor: not-allowed !important
</style>
