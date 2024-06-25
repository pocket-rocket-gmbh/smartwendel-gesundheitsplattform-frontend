<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-top-transition"
    width="900"
    @click:outside="emitClose()"
  >
    <v-card class="dialog-900">
      <div v-if="item?.status && item?.status !== 'confirmed'" class="my-5 mx-5">
        <v-alert type="warning" class="general-font-size mt-3"
          >Dieser Benutzer wurde durch eine Beschwerdemaßnahme gesperrt.</v-alert
        >
        <div class="d-flex justify-center align-center mt-5 ga-5">
          <v-btn color="error" @click="unblockUser(item?.id)">entsperren</v-btn>
          <v-btn color="primary" @click="goToComplaints">Beschwerde ansehen</v-btn>
        </div>
      </div>
      <v-card-title class="text-h5"> Benutzer </v-card-title>
      <v-card-text>
        <div class="field">
          <v-text-field
            v-model="item.firstname"
            label="Vorname"
            hide-details="auto"
            :rules="[rules.required]"
          />
        </div>
        <div class="field">
          <v-text-field
            v-model="item.lastname"
            label="Nachname"
            hide-details="auto"
            :rules="[rules.required]"
          />
        </div>
        <div class="field">
          <v-text-field
            v-model="item.phone"
            label="Telefonnummer"
            :error-messages="useErrors().checkAndMapErrors('phone', errors)"
            hide-details="auto"
            :rules="[rules.required, rules.validateNumber]"
          />
        </div>
        <div class="field">
          <v-text-field
            v-model="item.email"
            label="E-Mail"
            :error-messages="useErrors().checkAndMapErrors('email', errors)"
            hide-details="auto"
            :rules="[rules.required, rules.email]"
          />
        </div>
        <div class="field">
          <v-select
            v-model="item.role"
            :items="roles"
            item-title="name"
            item-value="id"
            label="Rolle"
            single-line
            hide-details="auto"
            :rules="[rules.required]"
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="emitClose()"> Schließen </v-btn>
        <v-btn
          color="blue darken-1"
          variant="outlined"
          dark
          @click="handleCta()"
          :loading="loadingItem"
          :disabled="subumitCondition"
        >
          <span v-if="itemId">Speichern</span>
          <span v-else>Einladen</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { type User } from "~/store/searchFilter";
import { ResultStatus } from "@/types/serverCallResult";
import axios from "axios";
import { rules } from "../../../data/validationRules";


const emit = defineEmits(["close", "refreshCollection"]);
const props = defineProps<{
  itemId: string;
}>();

const loadingItem = ref(false);
const dialog = ref(true);
const errors = ref([]);

const router = useRouter();

const item = ref<User>({} as User);

const user = useUser();

const goToComplaints = () => {
  router.push({ path: "/admin/complaints" });
};

const allRoles = [
  { name: "Einrichtung", id: "facility_owner" },
  //{ name: "Administrator", id: "admin", condition: "admin" },
  { name: "Super Administrator", id: "care_facility_admin", condition: "care_facility_admin" },
];

const roles = ref([]);

const showApi = useCollectionApi();
showApi.setBaseApi(usePrivateApi());

const createUpdateApi = useCollectionApi();
createUpdateApi.setBaseApi(usePrivateApi());

const getItem = async () => {
  showApi.setEndpoint(`users/${props.itemId}`);
  loadingItem.value = true;
  await showApi.getItem();
  loadingItem.value = false;
  item.value = showApi.item.value;
};

const handleCta = () => {
  if (props.itemId) {
    save();
  } else {
    invite();
  }
};

const subumitCondition =  computed(() => {
  return !item.value.firstname || !item.value.lastname || !item.value.email || !item.value.phone || !item.value.role;
});

const unblockUser = async (id : any) => {
  createUpdateApi.setEndpoint(`users/${id}`);
  let data = {
    is_active_on_health_scope: true,
    status: "confirmed",
  };
  await createUpdateApi.updateItem(data, null);
  getItem();
};


const invite = async () => {
  createUpdateApi.setEndpoint(`users/invite`);
  loadingItem.value = true;

  const res = await axios.post("/api/get_register_token");
  item.value.register_token = res.data;

  const result = await createUpdateApi.createItem(item.value, "Benutzer erfolgreich eingeladen");
  loadingItem.value = false;
  if (result.status === ResultStatus.SUCCESSFUL) {
    emit("refreshCollection");
    emit("close");
  } else {
    errors.value = result.data;
  }
};

const save = async () => {
  createUpdateApi.setEndpoint(`users/${props.itemId}`);
  loadingItem.value = true;
  const result = await createUpdateApi.updateItem(item.value, "Benutzer erfolgreich aktualisiert");
  loadingItem.value = false;
  if (result.status === ResultStatus.SUCCESSFUL) {
    emit("refreshCollection");
    emit("close");
  } else {
    errors.value = result.data;
  }
};

onMounted(() => {
  if (props.itemId) {
    getItem();
  }

  roles.value = allRoles
    .map((role) => {
      if (
        !role.condition ||
        (role.condition === "admin" && user.isAdmin()) ||
        (role.condition === "care_facility_admin" && user.isSuperAdmin())
      )
        return role;
    })
    .filter(Boolean);
});

const emitClose = () => {
  emit("close");
};
</script>

<style lang="sass"></style>
