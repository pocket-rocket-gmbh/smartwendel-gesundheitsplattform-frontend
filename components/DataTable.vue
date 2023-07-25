<template>
  <v-table>
    <thead>
      <tr>
        <th
          v-for="field in fields"
          :key="field.text"
          :width="[
            field.type === 'move_up' || field.type === 'move_down' || field.type === 'icon' || field.type === 'switch'
              ? '15px'
              : field.width,
          ]"
          class="is-clickable"
          @click="rotateColumnSortOrder(field)"
        >
          {{ field.text }}
        </th>
        <th width="15px" v-if="!disableEdit"></th>
        <th width="15px"></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, indexMain) in filteredItems"
        :key="item.id"
        :class="[item === activeItems ? 'activeItems' : '']"
      >
        <td
          v-for="(field, index) in fields"
          :key="index"
          class="is-clickable"
          @click="handleEmitParent(item, field, indexMain)"
          :width="field.width"
        >
          <span v-if="field.type === 'projectTimeRange'">{{ useDatetime().getProjectTimeRangeString(item) }}</span>
          <span v-if="field.type === 'datetime' && item[field.value]">{{
            useDatetime().parseDatetime(item[field.value])
          }}</span>
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
          <v-tooltip top v-else-if="field.type === 'move_down' && indexMain !== filteredItems.length - 1">
            <template v-slot:activator="{ props }">
              <v-icon class="is-clickable" v-bind="props">mdi-arrow-down</v-icon>
            </template>
            <span>Nach unten</span>
          </v-tooltip>
          <v-icon v-else-if="field.type === 'icon' && !field.tooltip">{{ field.value }}</v-icon>
          <span v-else-if="item[field.value] && field.type === 'association_name'">{{ item[field.value].name }}</span>
          <span v-else-if="item[field.value] && field.type === 'associations_name'">
            <div v-for="(subItem, index) in item[field.value]" :key="index" class="small">{{ subItem.name }}</div>
          </span>
          <TableSwitch
            v-else-if="field.type === 'switch'"
            :item="item"
            :endpoint="field.endpoint"
            :field-to-switch="field.fieldToSwitch"
            :ask-notification="field.askNotification"
            :notification-kind="field.notificationKind"
            :notification-kind-explicit="field.notificationKindExplicit"
            :notification-pre-filled-headline="field.notificationPreFilledHeadline"
            :notification-pre-filled-text="field.notificationPreFilledText"
            :notification-cta-link="field.notificationCtaLink"
          />

          <TableDropdown
            v-else-if="field.type === 'enumDropdown'"
            :item="item"
            :enum-name="field.enum_name"
            :endpoint="field.endpoint"
            :fieldName="field.value"
            :field-class="useEnums().getClassName(field.enum_name, item[field.value])"
            :disable-edit="!useUser().isAdmin()"
          />
          <div v-else-if="item[field.value] && field.enum_name && field.type === 'enum'">
            <span :class="useEnums().getClassName(field.enum_name, item[field.value])">
              {{ useEnums().getName(field.enum_name, item[field.value]) }}
            </span>
          </div>
          <span v-else-if="field.type === 'array'">{{ item[field.value].join(", ") }}</span>
          <span v-else-if="field.type === 'pathIntoObject'">{{ pathInto(item, field.value) }}</span>
          <span v-else-if="field.type === 'facilities'">
            <div v-if="Array.isArray(item[field.value])">
              <div v-for="facility in item[field.value]">
                <v-row>
                  <v-col>
                    <v-chip class="mx-2 mt-2" color="grey" v-if="facility.kind === 'facility'">
                      <v-icon v-if="facility.kind === 'facility'" class="mr-2">mdi-home-city-outline</v-icon>
                      {{ facility.name }}
                    </v-chip>
                  </v-col>
                </v-row>
              </div>
            </div>
          </span>
          <span v-else>{{ item[field.value] }}</span>
        </td>
        <td v-if="!disableEdit"><v-icon class="is-clickable" @click="emitParent(item.id, null)">mdi-pencil</v-icon></td>
        <td><v-icon class="is-clickable" @click="emitopenDeleteDialog(item.id)">mdi-delete</v-icon></td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { useEnums } from "@/composables/data/enums";
import { pathIntoObject } from "~/utils/path.utils";
import { useAdminStore } from "~/store/admin";

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
  }>(),
  {
    defaultSortBy: "created_at",
    defaultSortOrder: "desc",
  }
);

const emit = defineEmits(["close", "openCreateEditDialog", "openDeleteDialog", "itemsLoaded"]);

const loading = ref(false);

const resetActiveItems = () => {
  activeItems.value = null;
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
    emitParent(item.id, field.emit);
  }
};

const emitParent = (itemId: any, fieldEmit: any) => {
  if (!fieldEmit) {
    emit("openCreateEditDialog", itemId);
  } else {
    emit(fieldEmit, itemId);
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
  if (props.searchQuery === undefined || props.searchColumns === undefined) return items.value;

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
        if(Array.isArray(column)) {
          // TODO: Right now i only check for the 'name' field on my items, not all
          return column.find(item => item.name?.toUpperCase().includes(searchTerm))
        }
      }
    });
    return some;
  });
  return itemsFiltered;
});

const getItems = async () => {
  loading.value = true;
  const options = {
    page: 1,
    per_page: 9999999999,
    sort_by: props.defaultSortBy,
    sort_order: props.defaultSortOrder,
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

const rotateColumnSortOrder = (column: string) => {
  console.log(column);
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
.small
  font-size: 8px

.dropdown
  position: absolute
  margin-left: 100px
  margin-top: -50px
</style>
