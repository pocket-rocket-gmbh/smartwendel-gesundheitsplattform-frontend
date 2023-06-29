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
        >
          {{ field.text }}
        </th>
        <th width="15px" v-if="!disableEdit"></th>
        <th width="15px"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, indexMain) in items" :key="item.id" :class="[item === activeItems ? 'activeItems' : '']">
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
          <v-tooltip top v-else-if="field.type === 'move_down' && indexMain !== items.length - 1">
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
          />
          <div v-else-if="item[field.value] && field.enum_name && field.type === 'enum'">
            <span :class="useEnums().getClassName(field.enum_name, item[field.value])">
              {{ useEnums().getName(field.enum_name, item[field.value]) }}
            </span>
          </div>
          <span v-else-if="field.type === 'array'">{{ item[field.value].join(", ") }}</span>
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
import { useAdminStore } from "~/store/admin";

const props = withDefaults(
  defineProps<{
    fields: any[];
    endpoint: string;
    disableEdit?: boolean;
    overwriteMoveEndpoint?: string;
    defaultSortBy?: string;
    defaultSortOrder?: string;
  }>(),
  {
    defaultSortBy: "created_at",
    defaultSortOrder: "desc",
  }
);

const emit = defineEmits(["close", "openCreateEditDialog", "openDeleteDialog"]);

const loading = ref(false);
const showingDropdown = ref(null);

const showDropdown = (id) => {
  const itemId = id;
  showingDropdown.value = itemId;
};

const setStatus = (id) => {
  showingDropdown.value = null;
  console.log(id);
};

const ItemStatus = ref([
  { name: "In Prüfung", id: "is_checked" },
  { name: "Freigegeben", id: "confirmed" },
  { name: "Abgelehnt", id: "rejected" },
]);

const resetActiveItems = () => {
  activeItems.value = null;
};

const emitopenDeleteDialog = (itemId) => {
  emit("openDeleteDialog", itemId);
};
const activeItems = ref(null);
const handleEmitParent = (item, field, menu_order) => {
  activeItems.value = item;
  if (field.type === "move_up") {
    move(item, items.value[(menu_order -= 1)]);
  } else if (field.type === "move_down") {
    move(item, items.value[(menu_order += 1)]);
  } else if (field.type !== "switch" && field.type !== "enumDropdown") {
    emitParent(item.id, field.emit);
  }
};

const emitParent = (itemId, fieldEmit) => {
  if (!fieldEmit) {
    emit("openCreateEditDialog", itemId);
  } else {
    emit(fieldEmit, itemId);
  }
};

const move = async (entry, nextEntry) => {
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

const getItems = async () => {
  loading.value = true;
  const options = {
    page: 1,
    per_page: 999,
    sort_by: props.defaultSortBy,
    sort_order: props.defaultSortOrder,
    searchQuery: null as string,
    concat: false,
    filters: [] as any[],
  };
  adminStore.loading = true;
  await api.retrieveCollection(options);
  adminStore.loading = false;
  console.log(items.value)
  loading.value = false;
};

onMounted(() => {
  useNuxtApp().$bus.$on("triggerGetItems", () => {
    getItems();
  });
  getItems();
});

defineExpose({ resetActiveItems });
</script>

<style lang="sass">
.small
  font-size: 8px

.dropdown
  position: absolute
  margin-left: 100px
  margin-top: -50px
</style>
