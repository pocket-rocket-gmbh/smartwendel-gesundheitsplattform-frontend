<template>
  <div class="collapsible-list">
    <div class="category clickable" v-for="item in items" v-auto-animate @click="setExpandCategory(item.id)">
      <div class="title">
        <h2>{{ item.name }}</h2>
      </div>
      <div class="sub-categories" v-if="item.id === expandCategory">
        <div class="sub-categories">
          <div
            class="sub-category clickable"
            v-for="subCategory in item.sub_categories"
            v-auto-animate
            @click.stop="
              setExpandSubCategory(subCategory.id);
              log(subCategory);
            "
          >
            <div class="title">
              <h3>{{ subCategory.name }}</h3>
              <div class="description">
                {{ getSubCategoryDescription(item, subCategory.id) }}
              </div>
            </div>
            <div class="sub-sub-categories clickable" v-if="subCategory.id === expandSubCategory">
              <div class="sub-sub-categories">
                <div class="sub-sub-category" v-for="subSubCategory in subCategory.sub_sub_categories" @click.stop>
                  <div class="title">
                    <h4>{{ subSubCategory.name }}</h4>
                  </div>
                </div>
                <div class="sub-sub-category" @click.stop="addNewSubSubCategory(item.id, subCategory.id)">
                  <div class="title">
                    <button>Neuer Eintrag hinzufügen</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="sub-category" @click.stop="addNewSubCategory(item.id)">
            <div class="title">
              <button>Neuer Eintrag hinzufügen</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CollapsibleFieldItem } from "~/types/collapsibleList";
const loading = ref(false);

const props = withDefaults(
  defineProps<{
    fields: CollapsibleFieldItem[];
    endpoint: string;
    disableEdit?: boolean;
    overwriteMoveEndpoint?: string;
    defaultSortBy?: string;
    defaultSortOrder?: string;
  }>(),
  { defaultSortBy: "created_at", defaultSortOrder: "desc" }
);

const expandCategory = ref(null);
const expandSubCategory = ref(null);

const setExpandCategory = (categoryId: string) => {
  if (categoryId === expandCategory.value) {
    expandCategory.value = null;
    return;
  }

  expandCategory.value = categoryId;
};

const setExpandSubCategory = (subCategoryId: string) => {
  if (subCategoryId === expandSubCategory.value) {
    expandSubCategory.value = null;
    return;
  }

  expandSubCategory.value = subCategoryId;
};

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
    searchQuery: null as any,
    concat: false,
    filters: [] as any,
  };
  await api.retrieveCollection(options);
  loading.value = false;
};

const log = console.log;

const addNewSubCategory = (itemId: string) => {
  console.log(itemId);
};

const addNewSubSubCategory = (itemId: string, subCategoryId: string) => {
  console.log(itemId, subCategoryId);
};

const getSubCategoryDescription = (item: any, subCategoryId: string) => {

    console.log(item)

    api.setEndpoint

}

onMounted(() => {
  getItems();
});
</script>

<style lang="scss" scoped>
.collapsible-list {
  margin-top: 2rem;

  .clickable {
    cursor: pointer;
  }

  button {
    background-color: gray;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 2rem;

    &:hover {
        background-color: rgba(gray, 0.8);
    }
  }

  .category {
    border-top: 1px solid lightgray;
    padding: 1rem;

    .sub-categories,
    .sub-sub-categories {
      margin-left: 2rem;
    }

    .sub-sub-categories {
      .sub-sub-category {
        &:not(:first-child) {
          border-top: 1px solid black;
        }
        padding: 1rem;
      }
    }
  }
}
</style>
