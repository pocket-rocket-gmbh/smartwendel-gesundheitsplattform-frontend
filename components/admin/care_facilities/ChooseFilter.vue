<template>
  <LoadingSpinner v-if="loadingFilters && (!availableFilters || !availableFilters.length)">
    Filter werden geladen ...
  </LoadingSpinner>
  <div class="choose-facility-type" v-else>
    <CollapsibleItem
      v-for="mainFilter in availableFilters"
      :title="mainFilter.name"
      :id="mainFilter.id"
      :expand="expandId === mainFilter.id"
      @expand-toggled="expandId = mainFilter.id"
    >
      <div class="filter-options">
        <div class="option" v-for="option in mainFilter.next">
          <label class="option-label">
            <input
              :type="enableMultiSelect ? 'checkbox' : 'radio'"
              :checked="isChecked(option)"
              @click.stop="handleSubFilterParentClick(mainFilter, option)"
            />
            {{ option.name }}

            <div class="option" v-for="subOption in option.next">
              <label class="option-label">
                <input
                  :type="enableMultiSelect ? 'checkbox' : 'radio'"
                  :checked="isChecked(subOption)"
                  @click.stop="handleSubFilterClick(option, subOption)"
                />
                {{ subOption.name }}
              </label>
            </div>
          </label>
        </div>
        <LoadingSpinner v-if="loadingFilters">Leistung wird hinzugefügt... </LoadingSpinner>
      </div>
      <div v-if="isCurrentMainFilterServices(mainFilter)" class="add-new">
        <v-text-field
          @click.stop
          hide-details="auto"
          v-model="newServiceName"
          label="Neue Leistung"
          density="compact"
        />
        <v-btn variant="outlined" elevation="0" @click="handleCreateNewService(mainFilter.id, newServiceName)"
          >Neue Leistung hinzufügen</v-btn
        >
      </div>
    </CollapsibleItem>
  </div>
</template>

<script setup lang="ts">
import { ResultStatus } from "~/types/serverCallResult";
import { FilterType } from "~/utils/filter.utils";

const props = defineProps<{
  preSetTags: string[];
  filterType: FilterType;
  enableMultiSelect?: boolean;
}>();

const emit = defineEmits<{
  (event: "setTags", tags: string[]): void;
}>();

type Filter = { id: string; name: string; next?: Filter[] };

const selectedFilter = ref<Filter>();
const availableFilters = ref<Filter[]>([]);

const mainFilters = ref([]);
const expandId = ref("");

const loadingFilters = ref(false);

const newServiceName = ref("");

/**
 * Currently limited to max 2 layers more
 */
const getFilterOptions = async (id: string) => {
  const filters = await getFilters(id);

  const subTagPromises = filters.map((filter) => {
    return getFilters(filter.id);
  });

  const allSubTags = await Promise.all(subTagPromises);

  allSubTags.forEach((subTags, i) => {
    if (!subTags.length) return;
    filters[i].next = subTags;
  });

  return filters;
};

const enableAllTags = (filter: Filter) => {
  const updatedTags = [...new Set([...props.preSetTags, filter.id, ...filter.next.map(({ id }) => id)])];
  emit("setTags", updatedTags);
};

const disableAllTags = (filter: Filter) => {
  const parentIndex = props.preSetTags.findIndex((tag) => tag === filter.id);
  if (parentIndex !== -1) {
    props.preSetTags.splice(parentIndex, 1);
  }

  filter.next.forEach((nextFilter) => {
    const nextIndex = props.preSetTags.findIndex((tag) => tag === nextFilter.id);
    if (nextIndex !== -1) {
      props.preSetTags.splice(nextIndex, 1);
    }
  });
  emit("setTags", props.preSetTags);
};

const handleSubFilterParentClick = async (parent: Filter, current: Filter) => {
  if (!current.next) return handleClick(parent, current);

  if (props.preSetTags.includes(current.id)) {
    disableAllTags(current);
  } else {
    enableAllTags(current);
  }
};

const handleSubFilterClick = async (parent: Filter, current: Filter) => {
  selectedFilter.value = current;

  const removeIndex = props.preSetTags.findIndex((tagId) => tagId === current.id);
  selectedFilter.value = null;
  if (removeIndex !== -1) {
    props.preSetTags.splice(removeIndex, 1);

    const parentIndex = props.preSetTags.findIndex((item) => item === parent.id);
    if (parentIndex !== -1) props.preSetTags.splice(parentIndex, 1);

    emit("setTags", props.preSetTags);
    return;
  }

  props.preSetTags.push(current.id);

  if (parent.next.map((next) => next.id).every((id) => props.preSetTags.includes(id))) {
    props.preSetTags.push(parent.id);
  }

  emit("setTags", props.preSetTags);
};

const handleClick = (parent: Filter, current: Filter) => {
  selectedFilter.value = current;

  const removeIndex = props.preSetTags.findIndex((tagId) => tagId === current.id);
  selectedFilter.value = null;
  if (removeIndex !== -1) {
    props.preSetTags.splice(removeIndex, 1);
    emit("setTags", props.preSetTags);
    return;
  }

  if (!props.enableMultiSelect) {
    const optionsOfMainFilter = parent.next;

    const alreadyInGroupIndex = props.preSetTags.findIndex((tagId) =>
      optionsOfMainFilter.find((filter) => filter.id === tagId)
    );
    if (alreadyInGroupIndex !== -1) {
      props.preSetTags.splice(alreadyInGroupIndex, 1);
    }
  }

  emit("setTags", [...props.preSetTags, current.id]);
};

const isChecked = (option: Filter) => {
  return props.preSetTags?.includes(option.id);
};

const isCurrentMainFilterServices = (mainFilter: Filter) => {
  return mainFilter.name === "Leistungen";
};

const handleCreateNewService = async (parentId: string, name: string) => {
  if (!name) return;

  const api = useCollectionApi();
  api.setBaseApi(usePrivateApi());
  api.setEndpoint(`tag_categories`);

  const result = await api.createItem({ name, parent_id: parentId }, `Erfolgreich erstellt`);

  if (result.status === ResultStatus.SUCCESSFUL) {
    console.log("SUCCESS");
    newServiceName.value = "";
    await reloadFilters();
    emit("setTags", [...props.preSetTags, result.data.resource.id]);
  } else {
    console.error("ERROR");
  }
};

const reloadFilters = async () => {
  loadingFilters.value = true;
  mainFilters.value = await getMainFilters(props.filterType);

  const nextFiltersPromises = mainFilters.value.map((mainFilter) => getFilterOptions(mainFilter.id));

  const allNextFilters = await Promise.all(nextFiltersPromises);
  availableFilters.value = [];
  allNextFilters.forEach((nextFilters, i) => {
    availableFilters.value.push({ ...mainFilters.value[i], next: nextFilters });
  });

  loadingFilters.value = false;
};

onMounted(async () => {
  reloadFilters();
});
</script>

<style lang="scss" scoped>
.choose-facility-type {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option {
  margin-left: 1rem;
}

.add-new {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
</style>
