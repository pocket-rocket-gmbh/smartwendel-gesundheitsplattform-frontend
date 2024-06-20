<template>
  <div class="register-wrapper is-dark-grey">
    <div
      v-if="loading"
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
    <div v-else v-auto-animate>
      <div
        v-if="hasToken && !success && complaint?.status !== 'objection'"
        :class="['register-now elevation-10 card', { shake: animated }]"
      >
        <div class="text-h4 d-flex justify-center mb-4">Beschwerde</div>
        <div>
          <div class="field">
            <v-select
              v-model="complaint.kind"
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
              v-model="complaint.page_title"
              label="Titel"
              hide-details="auto"
              disabled
            />
          </div>
          <div class="field d-flex align-center ga-5">
            <v-text-field
              v-model="complaint.url"
              label="URL"
              hide-details="auto"
              disabled
            />
            <v-icon @click="goToLink(complaint.url)">mdi-open-in-new</v-icon>
          </div>
          <v-textarea
            v-if="complaint.reason"
            v-model="complaint.reason"
            disabled
            counter
            maxlength="300"
            hide-details="auto"
            label="Beschreibung"
          />
        </div>
        <div class="text-h4 d-flex mb-4">Grund</div>
        <div class="field">
          <v-textarea v-model="text" label="beschreiben" hide-details="auto" />
        </div>
        <div class="d-flex justify-end align-center">
          <v-btn @click="save">Senden</v-btn>
        </div>
      </div>
      <div
        v-else-if="!success && complaint?.status !== 'objection'"
        class="register-now elevation-10 d-flex flex-column justify-center align-center text-primary text-h4 font-weight-medium card"
        :class="{ shake: animated }"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-3">mdi-alert-circle-outline</v-icon>
          <span>Das Token ist ungültig.</span>
        </div>
      </div>

      <div
        v-if="success"
        class="register-now elevation-10 d-flex flex-column justify-center align-center text-primary text-h4 font-weight-medium card"
        :class="{ shake: animated }"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-3">mdi-check</v-icon>
          <span>Gesendet</span>
        </div>
      </div>

      <div
        v-if="complaint?.status === 'objection'"
        class="register-now elevation-10 d-flex flex-column justify-center align-center text-primary text-h4 font-weight-medium card"
        :class="{ shake: animated }"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-3">mdi-check</v-icon>
          <span>schon bearteitet, bitte warten</span>
        </div>
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

const goToLink = (url: string) => {
  window.open(url, "_blank");
};

const validateToken = async () => {
  loading.value = true;
  const result = await publicApi.call("get", `/complaints/${currentToken.value}`);
  if (result.status === ResultStatus.SUCCESSFUL) {
    const data = result.data.resource;
    complaint.value = data;
    hasToken.value = !!data;
  } else {
    hasToken.value = false;
  }
  loading.value = false;
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

const save = async () => {
  const data = {
    objection: text.value,
  };
  const result = await publicApi.call(
    "put",
    `/complaints/${currentToken.value}/objection/`,
    data
  );
  if (result.status === ResultStatus.SUCCESSFUL) {
    success.value = true;
  } else {
    error.value = true;
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
