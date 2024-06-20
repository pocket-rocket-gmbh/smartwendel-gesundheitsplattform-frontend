<template>
  <div class="register-wrapper is-dark-grey" v-if="loading">
    <div
      class="register-now elevation-10 d-flex flex-column justify-center align-center text-primary text-h4 font-weight-medium"
    >
      <span class="mb-10">Token wird überprüft</span>
      <v-progress-linear
        color="primary"
        indeterminate
        rounded
        height="10"
      ></v-progress-linear>
    </div>
  </div>
  <div class="register-wrapper is-dark-grey" v-else>
    <div
      class="register-now elevation-10"
      :class="['card', { shake: animated }]"
      v-if="hasToken"
    >
      <div>
        <div>
          <div class="field">
            <v-select
              :model-value="complaint?.kind"
              label="Titel"
              :items="allRoles"
              item-title="name"
              item-value="id"
              single-line
              hide-details="auto"
              disabled
            />
          </div>
          <div class="field">
            <v-text-field
              label="Titel"
              hide-details="auto"
              disabled
              :model-value="complaint?.page_title"
            />
          </div>
          <div class="field d-flex align-center ga-5">
            <v-text-field
              label="URL"
              hide-details="auto"
              disabled
              :model-value="complaint?.url"
            />
            <v-icon @click="goToLink(complaint?.url)">mdi-open-in-new</v-icon>
          </div>
          <v-textarea
            :model-value="complaint?.reason"
            disabled
            counter
            maxlength="300"
            hide-details="auto"
            label="Beschreibung"
          />
        </div>
        <div>warum ?</div>

        <div class="field">
          <v-textarea label="Text" hide-details="auto" :model="text" />
        </div>
      </div>
      <div class="d-flex justify-end align-center">
        <v-btn @click="save">Senden</v-btn>
      </div>
    </div>

    <div
      class="register-now elevation-10 d-flex flex-column justify-center align-center text-primary text-h4 font-weight-medium"
      :class="['card', { shake: animated }]"
      v-else
    >
      <div class="d-flex align-center">
        <v-icon class="mr-3">mdi-alert-circle-outline</v-icon
        ><span>Das Token ist ungültig.</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ResultStatus, ServerCallResult } from "@/types/serverCallResult";

const api = useCollectionApi();
api.setBaseApi(usePublicApi());

const loading = ref(true);
const animated = ref(false);
const router = useRouter();
const currentToken = ref("");
const hasToken = ref(false);

const text = ref("");

const getToken = () => {
  currentToken.value = String(router.currentRoute.value.query.token);
};

const complaint = ref({});
const publicApi = usePublicApi();

const goToLink = (item: any) => {
  const link = item;
  return window.open(link, "_blank");
};

const validateToken = async () => {
  loading.value = true;
  const result = await publicApi.call("get", `/complaints/${currentToken.value}`);
  if (result.status === ResultStatus.SUCCESSFUL) {
    const data = result.data.resource;
    complaint.value = data;
    if (data) {
      hasToken.value = true;
    }
    loading.value = false;
  } else {
    hasToken.value = false;
    loading.value = false;
  }
};

const allRoles = [
  { name: "Verstoß gegen geltendes Recht", id: "law_break" },
  { name: "Belästigung", id: "harassment" },
  { name: "Spam", id: "spam" },
  { name: "Verstoß gegen die Nutzungsbedingungen", id: "terms_violation" },
  { name: "Andere", id: "other" },
];


const error = ref(false);
const success = ref(false);

const createUpdateApi = useCollectionApi();
createUpdateApi.setBaseApi(usePublicApi());


const save = async () => {
  createUpdateApi.setEndpoint(`/complaints/${currentToken.value}/objection/`);
  try {
    loading.value = true;
    const data = {
      
    };
    const result = await createUpdateApi.createItem(
      data,
      "Beschwerde erfolgreich gesendet"
    );
    if (result.status === ResultStatus.SUCCESSFUL) {
      loading.value = false;
    }
  } catch (error) {
    loading.value = false;
    animated.value = false;
    console.log(error);
    setTimeout(() => {
      animated.value = false;
    }, 1000);
  }
};


onMounted(async () => {
  getToken();
  await validateToken();
});
</script>

<style lang="scss">
@import "@/assets/sass/main.sass";

.register-wrapper {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 5rem;

  @include md {
    padding: 0;
    gap: 3rem;
  }

  .register-now {
    @include md {
      box-shadow: none !important;
    }
  }

  .register {
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  .text {
    min-height: 350px;
  }

  .shake {
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
  }
  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }
    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }
    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }
    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }

  .register-now {
    background-color: white;
    padding: 1rem;
  }

  .steps-wrapper {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;

    @include md {
      flex-direction: column;

      .arrow {
        transform: rotate(90deg);
      }

      .item {
        align-self: stretch;
      }
    }

    .item {
      flex: 1;
      min-height: 100%;

      .background-text {
        background-color: #f5f5f5;
        padding: 1rem;
      }

      .background-icon {
        background-color: #8ab61d;
        padding: 20px;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        height: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .check .v-label {
    padding-left: 1rem;
    width: 100%;
  }
}

.thank-you {
  font-size: 55px;
}
</style>
