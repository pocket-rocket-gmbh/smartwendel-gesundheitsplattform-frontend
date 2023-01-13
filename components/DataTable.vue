<template>
  <v-table>
    <thead>
      <tr>
        <th v-for="field in fields" :key="field.text" :width="[ field.type === 'move_up' || field.type === 'move_down' || field.type === 'icon' || field.type === 'switch' ? '15px' : field.width]">
          {{ field.text }}
        </th>
        <th width="15px" v-if="!disableEdit"></th>
        <th width="15px"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, indexMain) in items" :key="item.id">
        <td v-for="(field, index) in fields" :key="index" class="is-clickable" @click="handleEmitParent(item, field, indexMain)" :width="field.width">
          <span v-if="field.type === 'projectTimeRange'">{{ useDatetime().getProjectTimeRangeString(item) }}</span>
          <span v-if="field.type === 'datetime' && item[field.value]">{{ useDatetime().parseDatetime(item[field.value]) }}</span>
          <span v-else-if="field.type === 'currency' && item[field.value]">{{ useCurrency().getCurrencyFromNumber(item[field.value]) }}</span>
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
            <div v-for="(item, index) in item[field.value]" :key="index" class="small">{{ item.name }}</div>
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
          <span v-else-if="item[field.value] && field.enum_values && field.type === 'enum'">
            {{ field.enum_values[item[field.value]] }}
          </span>
          <span v-else-if="field.type === 'array'">{{ item[field.value].join(', ') }}</span>
          <span v-else>{{ item[field.value] }}</span>
        </td>
        <td v-if="!disableEdit"><v-icon class="is-clickable" @click="emitParent(item.id, null)">mdi-pencil</v-icon></td>
        <td><v-icon class="is-clickable" @click="emitOpenDeleteDialogue(item.id)">mdi-delete</v-icon></td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import { ResultStatus } from '@/types/serverCallResult'
export default defineComponent({
  emits: ['close', 'openCreateEditDialogue', 'openDeleteDialogue'],
  props: {
    fields: {
      type: Array
    },
    disableEdit: {
      type: Boolean
    },
    endpoint: {
      type: String
    },
    overwriteMoveEndpoint: {
      type: String
    },
    defaultSortBy: {
      type: String,
      default: 'created_at'
    },
    defaultSortOrder: {
      type: String,
      default: 'desc'
    }
  },
  setup (props, { emit }) {
    const loading = ref(false)

    useNuxtApp().$bus.$on("triggerGetItems", () => {
      getItems()
    })

    const emitOpenDeleteDialogue = (itemId) => {
      emit('openDeleteDialogue', itemId)
    }

    const handleEmitParent = (item, field, menu_order) => {
      if (field.type === 'move_up') {
        move(item, items.value[menu_order -= 1])
      } else if (field.type === 'move_down') {
        move(item, items.value[menu_order += 1])
      } else if (field.type !== 'switch') {
        emitParent(item.id, field.emit)
      }
    }

    const emitParent = (itemId, fieldEmit) => {
      if (!fieldEmit) {
        emit('openCreateEditDialogue', itemId)
      } else {
        emit(fieldEmit, itemId)
      }
    }

    const move = async (entry, nextEntry) => {
      const result = await useTableMove().move(entry, nextEntry, props.overwriteMoveEndpoint)
      if (result) {
        getItems()
      }
    }

    const api = useCollectionApi()
    api.setBaseApi(usePrivateApi())
    api.setEndpoint(props.endpoint)
    const items = api.items

    const getItems = async () => {
      loading.value = true
      const options = { page: 1, per_page: 25, sort_by: props.defaultSortBy, sort_order: props.defaultSortOrder, searchQuery: null, concat: false, filters: [] }
      await api.retrieveCollection(options)
      loading.value = false
    }

    onMounted(() => {
      getItems()
    })

    return {
      emitOpenDeleteDialogue,
      emitParent,
      handleEmitParent,
      move,
      items
    }
  }
})
</script>

<style lang="sass">
.small
  font-size: 8px
</style>