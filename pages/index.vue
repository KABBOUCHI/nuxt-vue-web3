<template>
  <div
    class="bg-gray-500 min-h-screen md:flex items-center justify-center text-white"
  >
    <div
      class="relative md:max-w-lg min-h-screen md:min-h-0 w-full md:mx-auto bg-gray-800 shadow-lg md:rounded-lg px-8 py-6"
    >
      <Header />

      <hr :style="{ margin: '2rem' }" />

      <div
        :style="{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr 1fr',
          maxWidth: '20rem',
          margin: 'auto'
        }"
      >
        <button
          v-for="(newConnector, name) in connectorsByName"
          class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :key="name"
          @click="setActivatingConnector(newConnector)"
        >
          <span
            class="mr-2 "
            v-if="newConnector === connector"
            role="img"
            aria-label="check"
          >
            ✅
          </span>
          <svg
            v-else-if="activatingConnector === newConnector"
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-indigo"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>

          {{ name }}
        </button>
      </div>

      <div class="flex flex-col items-center mt-8 text-center">
        <button
          v-if="active"
          class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-red-800 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          @click="deactivate"
        >
          Deactivate
        </button>

        <h4 v-if="!!error" :style="{ marginTop: '1rem', marginBottom: '0' }">
          {{ getErrorMessage(error) }}
        </h4>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";
import {
  useWeb3,
  setWeb3LibraryCallback,
  UnsupportedChainIdError
} from "@kabbouchi/vue-web3";
import {
  injected,
  network,
  walletconnect,
  ledger,
  authereum
} from "~/connectors";
import { useEagerConnect } from "~/composables";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";

enum ConnectorNames {
  Injected = "Injected",
  Network = "Network",
  WalletConnect = "WalletConnect",
  // WalletLink = "WalletLink",
  Ledger = "Ledger",
  // Trezor = "Trezor",
  // Lattice = "Lattice",
  // Frame = "Frame",
  Authereum = "Authereum"
  // Fortmatic = "Fortmatic",
  // Magic = "Magic",
  // Portis = "Portis",
  // Torus = "Torus"
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.Network]: network,
  [ConnectorNames.WalletConnect]: walletconnect,
  // [ConnectorNames.WalletLink]: walletlink,
  [ConnectorNames.Ledger]: ledger,
  // [ConnectorNames.Trezor]: trezor,
  // [ConnectorNames.Lattice]: lattice,
  // [ConnectorNames.Frame]: frame,
  [ConnectorNames.Authereum]: authereum
  // [ConnectorNames.Fortmatic]: fortmatic,
  // [ConnectorNames.Magic]: magic,
  // [ConnectorNames.Portis]: portis,
  // [ConnectorNames.Torus]: torus
};

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
}

export default defineComponent({
  setup() {
    const { active, activate, deactivate, connector, error } = useWeb3();
    useEagerConnect();

    const activatingConnector = ref();

    const setActivatingConnector = async (newConnector: any) => {
      activatingConnector.value = newConnector;
      await activate(newConnector);
      activatingConnector.value = undefined;
    };

    return {
      active,
      activate,
      deactivate,
      connectorsByName,
      connector,
      getErrorMessage,
      error,
      setActivatingConnector,
      activatingConnector
    };
  }
});
</script>
