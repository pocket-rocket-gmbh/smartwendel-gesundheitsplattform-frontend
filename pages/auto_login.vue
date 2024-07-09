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
    <div
      v-else-if="!success"
      class="register-now elevation-10 d-flex flex-column justify-center align-center text-primary text-h4 font-weight-medium card"
      :class="{ shake: animated }"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-3">mdi-alert-circle-outline</v-icon>
        <span>Das Token ist ungültig.</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ResultStatus, ServerCallResult } from "@/types/serverCallResult";

const api = useCollectionApi();
api.setBaseApi(usePublicApi());

const loading = ref(true);
const animated = ref(false);
const router = useRouter();
const currentToken = ref("");
const hasToken = ref(false);

const error = ref(false);
const success = ref(false);

const text = ref("");

const publicApi = usePublicApi();

const getToken = () => {
  currentToken.value = String(router.currentRoute.value.query.magic_login_token);
};

const complaint = ref({
  status: "",
  history: [],
  reason: "",
  url: "",
  page_title: "",
  kind: "",
  created_at: "",
});

const validateToken = async () => {
  loading.value = true;

  const data = {
    magic_login_token: currentToken.value,
  };

  const { data: result } = await axios.post<ServerCallResult>("/api/login_by_magic_token", { data });
  if (result.status === ResultStatus.SUCCESSFUL) {
    const data = result.data.resource;
    console.log(data);
    hasToken.value = !!data;
  } else {
    hasToken.value = false;
  }
  loading.value = false;
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
