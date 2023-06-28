<template>
  <div class="choose-facility-type" v-if="!loadingFilters">
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
      </div>
    </CollapsibleItem>
  </div>
  <LoadingSpinner v-else> Filter werden geladen ... </LoadingSpinner>
</template>

<script setup lang="ts">
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
  return props.preSetTags.includes(option.id);
};

onMounted(async () => {
  loadingFilters.value = true;
  mainFilters.value = await getMainFilters(props.filterType);

  const nextFiltersPromises = mainFilters.value.map((mainFilter) => getFilterOptions(mainFilter.id));

  const allNextFilters = await Promise.all(nextFiltersPromises);
  allNextFilters.forEach((nextFilters, i) => {
    availableFilters.value.push({ ...mainFilters.value[i], next: nextFilters });
  });

  loadingFilters.value = false;
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
</style>
