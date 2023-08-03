<template>
  <v-dialog
    v-model="dialog"
    :width="size"
    transition="dialog-bottom-transition"
    @click:outside="emitClose()"
    persistent
    v-if="!editUserProfile"
  >
    <v-card :class="`dialog-${size}`" :height="`${height}`">
      <v-form ref="form">
        <v-card-title class="text-h5 has-bg-primary py-5 text-white">
          <span v-if="itemId">{{ conceptName }} bearbeiten</span>
          <span v-else>{{ conceptName }} erstellen</span>
        </v-card-title>

        <slot :item="item" :errors="errors"></slot>

        <v-card-actions class="card-actions">
          <v-btn @click="emitClose()"> Schließen </v-btn>
          <v-btn color="blue darken-1" variant="outlined" dark @click="handleCta()" :loading="loadingItem">
            Speichern
          </v-btn>
          <v-alert v-if="showSaveHint" type="info" density="compact" class="save-hint">
            Bitte denke daran regelmäßig zu speichern damit keine Daten verloren gehen!
          </v-alert>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>

  <div v-else>
    <div>
      <v-form ref="form">
        <slot :item="item" :errors="errors" />
      </v-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ResultStatus } from "@/types/serverCallResult";
import { VForm } from "vuetify/lib/components/index.mjs";
import { useAdminStore } from "~/store/admin";
import { CreateEditFacility } from "~/types/facilities";

const emit = defineEmits(["close", "hasChanged"]);
const props = defineProps({
  itemId: {
    type: String,
  },
  endpoint: {
    type: String,
    required: true,
  },
  conceptName: {
    type: String,
  },
  size: {
    type: Number,
    default: 500,
  },
  height: {
    type: Number,
  },
  itemPlaceholder: {
    type: Object,
  },
  overwriteGetItemEndpoint: {
    type: String,
  },
  overwriteUpdateItemEndpoint: {
    type: String,
  },
  editUserProfile: {
    type: Boolean,
    default: false,
  },
});

const loadingItem = ref(false);
const dialog = ref(true);
const errors = ref([]);
const item = ref<CreateEditFacility>({});
const form = ref<VForm>();

const snackbar = useSnackbar();
const adminStore = useAdminStore();
const showSaveHint = ref(false);
const saveHintTimeout = ref<NodeJS.Timeout>();

const showApi = useCollectionApi();
showApi.setBaseApi(usePrivateApi());

const createUpdateApi = useCollectionApi();
createUpdateApi.setBaseApi(usePrivateApi());

const itemHastChanged = ref(false);

const getItem = async () => {
  if (!props.itemId) return;

  let endpoint = `${props.endpoint}/${props.itemId}`;
  if (props.overwriteGetItemEndpoint) {
    endpoint = props.overwriteGetItemEndpoint;
  }

  showApi.setEndpoint(endpoint);

  loadingItem.value = true;
  await showApi.getItem();
  loadingItem.value = false;
  item.value = showApi.item.value;
};

const handleCta = async () => {
  const { valid } = await form.value.validate();

  if (!valid) {
    const formErrors = await form.value.errors;
    errors.value = formErrors.map((err) => err.errorMessages[0]);
    snackbar.showError("Speichern fehlgeschlagen! Es gibt ungültige Felder!");
    return;
  }
  if (props.itemId) {
    save();
  } else {
    create();
  }
};
const setLogo = (image: string) => {
  useNuxtApp().$bus.$emit("setPayloadFromSlotChild", {
    name: "logo",
    value: image,
  });
};

const create = async () => {
  createUpdateApi.setEndpoint(`${props.endpoint}`);
  loadingItem.value = true;
  adminStore.loading = true;
  const result = await createUpdateApi.createItem(item.value, `Erfolgreich erstellt`);
  adminStore.loading = false;
  loadingItem.value = false;
  if (result.status === ResultStatus.SUCCESSFUL) {
    useNuxtApp().$bus.$emit("triggerGetItems", null);

    const facilityId = result.data.resource.id;

    loadingItem.value = true;
    if (item.value.offlineImageFiles.length) {
      for (const offlineImageFile of item.value.offlineImageFiles) {
        createUpdateApi.setEndpoint(`care_facilities/${facilityId}/images`);
        const data = {
          file: offlineImageFile,
        };
        await createUpdateApi.createItem(data, "Bild erfolgreich hinzugefügt");
      }
    }

    if (item.value.offlineLocations && item.value.offlineLocations.length) {
      createUpdateApi.setEndpoint(`locations/care_facility/${facilityId}`);

      const facilityLocationCreationPromises = item.value.offlineLocations.map((location) =>
        createUpdateApi.createItem({
          careFacility_id: facilityId,
          longitude: location.longitude,
          latitude: location.latitude,
        })
      );

      await Promise.all(facilityLocationCreationPromises);
    }
    if (item.value.offlineDocuments && item.value.offlineDocuments.length) {
      createUpdateApi.setEndpoint(`care_facilities/${facilityId}/documents`);

      const documentsPromises = item.value.offlineDocuments.map((document) =>
        createUpdateApi.createItem({
          document: document.document,
          documentname: document.documentname,
          tag: document.tag,
        })
      );

      await Promise.all(documentsPromises);
    }

    loadingItem.value = false;
    emit("close");
  } else {
    errors.value = result.data;
  }
};

const save = async () => {
  let endpoint = `${props.endpoint}/${props.itemId}`;
  if (props.overwriteUpdateItemEndpoint) {
    endpoint = props.overwriteUpdateItemEndpoint;
  }

  createUpdateApi.setEndpoint(endpoint);
  loadingItem.value = true;
  adminStore.loading = true;
  const result = await createUpdateApi.updateItem(item.value, "Erfolgreich aktualisiert");
  adminStore.loading = false;
  loadingItem.value = false;
  triggerSaveHintTimeout();

  if (result.status === ResultStatus.SUCCESSFUL) {
    useNuxtApp().$bus.$emit("triggerGetItems", null);
    itemHastChanged.value = false;
    // emit("close");
  } else {
    errors.value = result.data;
  }
};

useNuxtApp().$bus.$on("setPayloadFromSlotChild", (payload) => {
  // @ts-expect-error any in payload
  item.value[payload.name] = payload.value;
});

const triggerSaveHintTimeout = () => {
  showSaveHint.value = false;
  if (saveHintTimeout.value) clearTimeout(saveHintTimeout.value);

  saveHintTimeout.value = setTimeout(() => {
    showSaveHint.value = true;
  }, 30 * 1000); // Nach einer halben Minute wird ein Hinweis zum Speichern angezeigt
};

onMounted(async () => {
  if (props.itemId) {
    await getItem();
  }
  if (props.itemPlaceholder && !item.value.id) {
    item.value = { ...props.itemPlaceholder };
  }

  triggerSaveHintTimeout();

  watch(
    () => item.value,
    () => {
      itemHastChanged.value = true;
    },
    { deep: true }
  );
});

const emitClose = () => {
  if (!itemHastChanged.value) {
    emit("close");
    item.value = props.itemPlaceholder;
    return;
  }

  const confirmed = confirm("Wenn Sie fortfahren, werden Ihre Änderungen verworfen.");
  if (confirmed) {
    item.value = props.itemPlaceholder;
    emit("close");
  }
};

defineExpose({ getItem });

watch(
  [
    () => item.value?.phone,
    () => item.value?.email,
    () => item.value?.street,
    () => item.value?.additional_address_info,
    () => item.value?.community_id,
    () => item.value?.zip,
    () => item.value?.town,
  ],
  (
    [newPhone, newEmail, newStreet, newAdditionalAddressInfo, newCommunityId, newZip, newTown],
    [oldPhone, oldEmail, oldStreet, oldAdditionalAddressInfo, oldCommunityId, oldZip, oldTown]
  ) => {
    if (
      (oldPhone && newPhone !== oldPhone) ||
      (oldEmail && newEmail !== oldEmail) ||
      (oldStreet && newStreet !== oldStreet) ||
      (oldAdditionalAddressInfo && newAdditionalAddressInfo !== oldAdditionalAddressInfo) ||
      (oldCommunityId && newCommunityId !== oldCommunityId) ||
      (oldZip && newZip !== oldZip) ||
      (oldTown && newTown !== oldTown)
    ) {
      emit("hasChanged");
    }
  }
);
</script>

<style lang="scss">
.card-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 61px;

  .save-hint {
    animation: fadeIn 200ms ease-in-out forwards;

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }
}
</style>
